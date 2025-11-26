# frozen_string_literal: true

class RedMetersAPI < Sinatra::Base
  # GET /api/v1/analytics/overview
  get '/api/v1/analytics/overview' do
    json({
           total_meters: SmartMeter.count,
           active_meters: SmartMeter.active.count,
           total_readings: MeterReading.count,
           readings_today: MeterReading.where('reading_time > ?', Date.today).count,
           anomalies_today: Prediction.anomalies.where('created_at > ?', Date.today).count,
           alerts_active: Alert.active.count,
           alerts_critical: Alert.active.critical.count,
           customers_total: Customer.count,
           customers_by_segment: Customer.group(:segment_id).count
         })
  end

  # GET /api/v1/analytics/grid-health
  get '/api/v1/analytics/grid-health' do
    recent_readings = MeterReading.where('reading_time > ?', 1.hour.ago)

    json({
           timestamp: Time.current.iso8601,
           readings_last_hour: recent_readings.count,
           avg_voltage: recent_readings.average(:voltage)&.round(2),
           voltage_range: {
             min: recent_readings.minimum(:voltage),
             max: recent_readings.maximum(:voltage)
           },
           avg_power_factor: recent_readings.average(:power_factor)&.round(4),
           total_consumption_kwh: recent_readings.sum(:consumption_kwh).round(2),
           total_demand_kw: recent_readings.sum(:demand_kw).round(2),
           anomaly_rate: calculate_anomaly_rate(recent_readings)
         })
  end

  # GET /api/v1/analytics/customer-segments
  get '/api/v1/analytics/customer-segments' do
    segments = Customer.group(:segment_id)
                       .select('segment_id, COUNT(*) as customer_count')

    segment_data = segments.map do |s|
      {
        segment: s.segment_id,
        segment_name: s.segment_id&.titleize&.gsub('_', ' '),
        count: s.customer_count,
        percentage: (s.customer_count.to_f / Customer.count * 100).round(1)
      }
    end

    json({
           segments: segment_data,
           total_customers: Customer.count,
           generated_at: Time.current.iso8601
         })
  end

  # GET /api/v1/analytics/transformers
  get '/api/v1/analytics/transformers' do
    transformers = Transformer.all

    json({
           total: transformers.count,
           operational: transformers.operational.count,
           high_risk: transformers.high_risk.count,
           aging: transformers.aging.count,
           by_status: Transformer.group(:status).count,
           avg_failure_risk: transformers.average(:failure_risk)&.round(3),
           avg_age_years: transformers.average(:age_years)&.round(1)
         })
  end

  # GET /api/v1/alerts
  get '/api/v1/alerts' do
    alerts = Alert.order(created_at: :desc)
    alerts = alerts.active if params[:active] == 'true'
    alerts = alerts.where(severity: params[:severity]) if params[:severity]
    alerts = alerts.limit(params[:limit] || 50)

    json({
           alerts: alerts.map(&:to_api_response),
           active_count: Alert.active.count,
           total: Alert.count
         })
  end

  # PUT /api/v1/alerts/:id/resolve
  put '/api/v1/alerts/:id/resolve' do
    alert = Alert.find(params[:id])
    data = JSON.parse(request.body.read, symbolize_names: true)
    alert.resolve!(by: data[:resolved_by] || 'system')
    json alert.to_api_response
  end

  private

  def calculate_anomaly_rate(readings)
    return 0 if readings.empty?

    anomalies = readings.where(quality_flag: 'anomaly').count
    (anomalies.to_f / readings.count * 100).round(2)
  end
end
