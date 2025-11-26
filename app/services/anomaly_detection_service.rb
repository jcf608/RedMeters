# frozen_string_literal: true

require 'open3'
require 'json'

class AnomalyDetectionService
  MODEL_PATH = ENV.fetch('ML_MODELS_PATH', './ml/models')

  def detect_anomalies(meter_ids = nil)
    readings = fetch_recent_readings(meter_ids)
    return [] if readings.empty?

    # Check if ML model is available and working
    if ml_model_available?
      begin
        detect_with_ml_model(readings)
      rescue StandardError => e
        logger.warn("ML model failed, falling back to rules: #{e.message}")
        detect_with_rules(readings)
      end
    else
      detect_with_rules(readings)
    end
  end

  private

  def fetch_recent_readings(meter_ids)
    scope = MeterReading.where('reading_time > ?', 1.hour.ago)
    scope = scope.where(meter_id: meter_ids) if meter_ids.present?
    scope.order(reading_time: :desc).limit(10_000)
  end

  def ml_model_available?
    File.exist?(File.join(MODEL_PATH, 'anomaly_detector.joblib'))
  end

  def detect_with_ml_model(readings)
    data = prepare_data_for_ml(readings)
    results = call_python_model(data)

    # Create alerts for detected anomalies
    create_alerts_for_anomalies(results)

    results
  end

  def detect_with_rules(readings)
    # Fallback rule-based detection when ML model not available
    results = []

    readings.each do |reading|
      analysis = analyze_reading(reading)
      is_anomaly = analysis[:score] > 0.7

      results << {
        meter_id: reading.meter_id,
        reading_time: reading.reading_time.iso8601,
        anomaly_score: analysis[:score],
        is_anomaly: is_anomaly,
        detection_method: 'rule_based',
        reasons: analysis[:reasons]
      }

      create_anomaly_alert(reading, analysis) if is_anomaly
    end

    results
  end

  def analyze_reading(reading)
    score = 0.0
    reasons = []

    # Voltage deviation check (normal range: 216-253V for 230V nominal)
    if reading.voltage
      voltage_deviation = (reading.voltage - 230).abs / 230.0
      if voltage_deviation > 0.06
        score += voltage_deviation * 0.4
        direction = reading.voltage > 230 ? 'HIGH' : 'LOW'
        reasons << {
          type: 'voltage',
          severity: voltage_deviation > 0.1 ? 'critical' : 'warning',
          message: "Voltage #{direction}: #{reading.voltage.round(1)}V (#{(voltage_deviation * 100).round(1)}% deviation from 230V nominal)",
          value: reading.voltage,
          threshold: '216-244V',
          contribution: (voltage_deviation * 0.4).round(3)
        }
      end
    end

    # Power factor check (should be > 0.85)
    if reading.power_factor && reading.power_factor < 0.85
      pf_gap = 0.85 - reading.power_factor
      score += pf_gap * 0.3
      reasons << {
        type: 'power_factor',
        severity: reading.power_factor < 0.75 ? 'critical' : 'warning',
        message: "Low power factor: #{reading.power_factor.round(3)} (minimum threshold: 0.85)",
        value: reading.power_factor,
        threshold: '>= 0.85',
        contribution: (pf_gap * 0.3).round(3)
      }
    end

    # Consumption spike check (compare to meter average)
    meter = reading.meter
    avg_consumption = meter&.average_consumption(period: 7.days) || 0
    if avg_consumption.positive? && reading.consumption_kwh
      deviation = (reading.consumption_kwh - avg_consumption).abs / avg_consumption
      if deviation > 2
        score += deviation * 0.3
        spike_type = reading.consumption_kwh > avg_consumption ? 'spike' : 'drop'
        reasons << {
          type: 'consumption',
          severity: deviation > 4 ? 'critical' : 'warning',
          message: "Consumption #{spike_type}: #{reading.consumption_kwh.round(3)} kWh (#{(deviation * 100).round(0)}% vs 7-day avg of #{avg_consumption.round(3)} kWh)",
          value: reading.consumption_kwh,
          average: avg_consumption,
          deviation_percent: (deviation * 100).round(1),
          contribution: (deviation * 0.3).round(3)
        }
      end
    end

    { score: [score, 1.0].min, reasons: reasons }
  end

  def prepare_data_for_ml(readings)
    readings.map do |r|
      {
        meter_id: r.meter_id,
        reading_time: r.reading_time.iso8601,
        consumption_kwh: r.consumption_kwh,
        demand_kw: r.demand_kw,
        voltage: r.voltage,
        power_factor: r.power_factor
      }
    end
  end

  def call_python_model(data)
    script = <<~PYTHON
      import sys
      import json
      import pandas as pd
      sys.path.insert(0, 'ml/src')

      from anomaly_detector import AnomalyDetector

      model = AnomalyDetector.load('#{MODEL_PATH}/anomaly_detector.joblib')

      data = json.loads('''#{data.to_json}''')
      df = pd.DataFrame(data)

      results = model.predict(df)

      output = []
      for i, row in df.iterrows():
          output.append({
              'meter_id': int(row['meter_id']),
              'reading_time': row['reading_time'],
              'anomaly_score': float(results['anomaly_score'][i]),
              'is_anomaly': bool(results['is_anomaly'][i]),
              'detection_method': 'ml_model'
          })

      print(json.dumps(output))
    PYTHON

    stdout, stderr, status = Open3.capture3('python3', '-c', script)

    unless status.success?
      logger.error("Python ML error: #{stderr}")
      raise "ML model error: #{stderr}"
    end

    JSON.parse(stdout, symbolize_names: true)
  end

  def create_alerts_for_anomalies(results)
    results.select { |r| r[:is_anomaly] }.each do |anomaly|
      create_anomaly_alert_from_result(anomaly)
    end
  end

  def create_anomaly_alert(reading, analysis)
    reasons = analysis[:reasons]
    score = analysis[:score]

    # Build human-readable explanation
    explanation = reasons.map { |r| "• #{r[:message]}" }.join("\n")

    # Determine overall severity from worst reason
    severity = reasons.any? { |r| r[:severity] == 'critical' } ? 'critical' : 'warning'

    # Build title from reason types
    reason_types = reasons.map { |r| r[:type].capitalize }.uniq.join(', ')
    title = "#{severity == 'critical' ? '🚨' : '⚠️'} #{reason_types} Anomaly"

    Alert.create!(
      title: title,
      description: "Meter #{reading.meter.meter_number} at #{reading.reading_time.strftime('%Y-%m-%d %H:%M')}:\n\n#{explanation}",
      severity: severity,
      source: 'anomaly_detection',
      confidence: (score * 100).round,
      asset_type: 'smart_meter',
      asset_id: reading.meter_id,
      detected_at: Time.current
    )
  end

  def create_anomaly_alert_from_result(anomaly)
    Alert.create!(
      title: 'Anomaly Detected',
      description: "ML model detected anomaly on meter #{anomaly[:meter_id]}",
      severity: anomaly[:anomaly_score] > 0.9 ? 'critical' : 'warning',
      source: 'anomaly_detection',
      confidence: (anomaly[:anomaly_score] * 100).round,
      asset_type: 'smart_meter',
      asset_id: anomaly[:meter_id],
      detected_at: Time.current
    )
  end

  def logger
    @logger ||= Logger.new($stdout)
  end
end
