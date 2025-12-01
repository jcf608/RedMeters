# frozen_string_literal: true

puts 'Seeding database...'

# Create sample transformers
puts '  Creating transformers...'
10.times do |i|
  Transformer.find_or_create_by!(transformer_number: "TRF#{format('%04d', i + 1)}") do |t|
    t.capacity_kva = [100, 200, 500, 1000].sample
    t.age_years = rand(1.0..30.0).round(1)
    t.status = 'operational'
    t.failure_risk = (0.1 + (t.age_years / 30.0) * 0.5 + rand(0.0..0.2)).round(3)
  end
end
puts "    Created #{Transformer.count} transformers"

# Create sample customers
puts '  Creating customers...'
segments = Customer::SEGMENTS
100.times do |i|
  Customer.find_or_create_by!(customer_hash: "CUST#{format('%06d', i + 1)}") do |c|
    c.segment_id = segments.sample
    c.segment_confidence = rand(70.0..99.0).round(2)
    c.tariff_type = %w[flat tou demand].sample
    c.solar_installed = rand < 0.15
    c.ev_charging = rand < 0.1
    c.demand_response_opted_in = rand < 0.3
  end
end
puts "    Created #{Customer.count} customers"

# Create sample smart meters
puts '  Creating smart meters...'
100.times do |i|
  customer = Customer.offset(i).first
  transformer = Transformer.offset(i % 10).first

  SmartMeter.find_or_create_by!(meter_number: "MTR#{format('%06d', i + 1)}") do |m|
    m.customer = customer
    m.transformer = transformer
    m.meter_type = %w[residential commercial industrial].sample
    m.status = 'active'
    m.installed_at = rand(1..5).years.ago
  end
end
puts "    Created #{SmartMeter.count} meters"

# Create sample readings for each meter (last 7 days)
puts '  Creating meter readings (this may take a moment)...'
reading_count = 0

SmartMeter.find_each do |meter|
  base_consumption = rand(5.0..25.0)

  # 7 days * 48 readings per day (30-min intervals)
  (0..7).each do |day|
    48.times do |half_hour|
      timestamp = day.days.ago + (half_hour * 30).minutes
      hour = timestamp.hour

      # Time-of-use pattern
      peak_factor = if (6..8).cover?(hour) || (17..20).cover?(hour)
                      1.5 # Morning/evening peak
                    elsif (9..16).cover?(hour)
                      0.8 # Daytime
                    else
                      0.5 # Night
                    end

      # Add randomness
      noise = 1 + rand(-0.15..0.15)
      consumption = (base_consumption / 48.0) * peak_factor * noise
      consumption = [0, consumption].max

      # Voltage (normally around 230V)
      voltage = 230 + rand(-5.0..5.0)

      # Occasionally inject anomalies (2% of readings)
      is_anomaly = rand < 0.02
      if is_anomaly
        voltage = [195, 260].sample if rand < 0.5
        consumption *= [3, 5].sample if rand < 0.5
      end

      MeterReading.create!(
        meter_id: meter.id,
        reading_time: timestamp,
        consumption_kwh: consumption.round(4),
        demand_kw: (consumption * 2).round(4),
        voltage: voltage.round(2),
        power_factor: rand(0.85..0.99).round(4),
        quality_flag: is_anomaly ? 'anomaly' : 'normal'
      )
      reading_count += 1
    end
  end
end
puts "    Created #{reading_count} readings"

# Create some sample alerts
puts '  Creating sample alerts...'
5.times do
  meter = SmartMeter.order('RANDOM()').first
  Alert.create!(
    title: ['Voltage Anomaly Detected', 'High Consumption Spike', 'Low Power Factor'].sample,
    description: "Alert detected on meter #{meter.meter_number}",
    severity: %w[warning critical].sample,
    source: 'anomaly_detection',
    confidence: rand(70..95),
    asset_type: 'smart_meter',
    asset_id: meter.id,
    detected_at: rand(1..48).hours.ago
  )
end
puts "    Created #{Alert.count} alerts"

puts "\n✅ Seeding complete!"
puts "   Transformers: #{Transformer.count}"
puts "   Customers: #{Customer.count}"
puts "   Smart Meters: #{SmartMeter.count}"
puts "   Meter Readings: #{MeterReading.count}"
puts "   Alerts: #{Alert.count}"

