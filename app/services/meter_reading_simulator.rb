# frozen_string_literal: true

# Generates realistic smart meter readings based on customer segments
# and time-of-day patterns. Occasionally injects anomalies for testing.
class MeterReadingSimulator
  ANOMALY_RATE = 0.02 # 2% of readings will be anomalies

  # Base consumption patterns by segment (kWh per 15-min interval)
  SEGMENT_PROFILES = {
    'early_morning_industrial' => { base: 2.5, peak_hours: 4..10, peak_mult: 2.0 },
    'business_hours_commercial' => { base: 1.8, peak_hours: 8..18, peak_mult: 1.8 },
    'evening_residential_peak' => { base: 0.4, peak_hours: 17..22, peak_mult: 2.5 },
    'solar_battery_households' => { base: 0.3, peak_hours: 18..21, peak_mult: 1.5, solar_offset: true },
    'ev_charging_households' => { base: 0.5, peak_hours: 21..24, peak_mult: 3.0 },
    'efficiency_optimizers' => { base: 0.25, peak_hours: 7..9, peak_mult: 1.3 },
    'high_consumption_all_day' => { base: 1.2, peak_hours: 6..22, peak_mult: 1.4 },
    'seasonal_variation_heavy' => { base: 0.8, peak_hours: 15..21, peak_mult: 2.2 },
    'weekend_shift_users' => { base: 0.5, peak_hours: 10..16, peak_mult: 1.6 },
    'night_owl_households' => { base: 0.35, peak_hours: 22..26, peak_mult: 2.0 },
    'retired_home_all_day' => { base: 0.6, peak_hours: 8..20, peak_mult: 1.2 },
    'low_use_minimal' => { base: 0.15, peak_hours: 18..21, peak_mult: 1.5 }
  }.freeze

  class << self
    # Generate readings for all active meters
    def generate_batch(time: Time.current)
      meters = SmartMeter.active.includes(:customer)
      readings = []
      anomalies = []

      meters.find_each do |meter|
        reading = generate_reading(meter, time)
        readings << reading

        anomalies << reading if reading.quality_flag == 'anomaly'
      end

      logger.info("[Simulator] Generated #{readings.size} readings, #{anomalies.size} anomalies")
      { readings: readings, anomalies: anomalies }
    end

    # Generate a single reading for a meter
    def generate_reading(meter, time = Time.current)
      segment = meter.customer&.segment_id || 'evening_residential_peak'
      profile = SEGMENT_PROFILES[segment] || SEGMENT_PROFILES['evening_residential_peak']

      is_anomaly = should_inject_anomaly?
      consumption = calculate_consumption(profile, time, is_anomaly)
      voltage = calculate_voltage(is_anomaly)
      power_factor = calculate_power_factor(is_anomaly)

      MeterReading.create!(
        meter_id: meter.id,
        reading_time: time,
        consumption_kwh: consumption,
        demand_kw: consumption * 4, # 15-min interval -> hourly rate
        voltage: voltage,
        power_factor: power_factor,
        quality_flag: is_anomaly ? 'anomaly' : 'normal'
      )
    end

    private

    def should_inject_anomaly?
      rand < ANOMALY_RATE
    end

    def calculate_consumption(profile, time, is_anomaly)
      hour = time.hour
      base = profile[:base]

      # Apply peak multiplier if in peak hours
      multiplier = in_peak_hours?(hour, profile[:peak_hours]) ? profile[:peak_mult] : 1.0

      # Apply solar offset during daylight
      if profile[:solar_offset] && hour.between?(9, 16)
        multiplier *= 0.3 # Solar reduces grid consumption
      end

      # Add some randomness (±20%)
      consumption = base * multiplier * (0.8 + rand * 0.4)

      # Inject anomaly: consumption spike (3-5x normal)
      consumption *= (3.0 + rand * 2.0) if is_anomaly && rand < 0.5

      consumption.round(3)
    end

    def calculate_voltage(is_anomaly)
      # Normal voltage: 228-232V (nominal 230V)
      base_voltage = 230.0 + (rand * 4 - 2)

      if is_anomaly && rand < 0.5
        # Voltage anomaly: too high or too low
        deviation = (rand < 0.5) ? -(15 + rand * 20) : (15 + rand * 30)
        base_voltage += deviation
      end

      base_voltage.round(2)
    end

    def calculate_power_factor(is_anomaly)
      # Normal power factor: 0.90-0.98
      base_pf = 0.92 + rand * 0.06

      if is_anomaly && rand < 0.3
        # Power factor anomaly: drops below 0.85
        base_pf = 0.65 + rand * 0.18
      end

      base_pf.round(4)
    end

    def in_peak_hours?(hour, peak_range)
      # Handle ranges that cross midnight (e.g., 22..26 becomes 22-24 and 0-2)
      if peak_range.end > 24
        hour >= peak_range.begin || hour < (peak_range.end - 24)
      else
        peak_range.cover?(hour)
      end
    end

    def logger
      @logger ||= Logger.new($stdout)
    end
  end
end


