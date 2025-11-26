# frozen_string_literal: true

require 'csv'
require 'json'
require 'open3'

class DataIngestionService
  BATCH_SIZE = 1000

  def initialize(batch_size: BATCH_SIZE)
    @batch_size = batch_size
  end

  def load_from_csv(file_path)
    raise "File not found: #{file_path}" unless File.exist?(file_path)

    readings = []
    count = 0

    CSV.foreach(file_path, headers: true) do |row|
      readings << build_reading_from_row(row)

      if readings.size >= @batch_size
        MeterReading.insert_all(readings)
        count += readings.size
        readings = []
        puts "  Inserted #{count} readings..."
      end
    end

    MeterReading.insert_all(readings) unless readings.empty?
    count += readings.size

    { success: true, records: count, source: file_path }
  end

  def load_from_parquet(file_path)
    raise "File not found: #{file_path}" unless File.exist?(file_path)

    # Use Python subprocess for Parquet reading
    script = <<~PYTHON
      import pandas as pd
      import json
      df = pd.read_parquet('#{file_path}')
      df['reading_time'] = df['reading_time'].astype(str)
      print(df.to_json(orient='records'))
    PYTHON

    stdout, stderr, status = Open3.capture3('python3', '-c', script)
    raise "Parquet read error: #{stderr}" unless status.success?

    readings_data = JSON.parse(stdout)
    count = 0

    readings_data.each_slice(@batch_size) do |batch|
      records = batch.map do |r|
        {
          meter_id: r['meter_id'],
          reading_time: Time.parse(r['reading_time']),
          consumption_kwh: r['consumption_kwh'],
          demand_kw: r['demand_kw'],
          voltage: r['voltage'],
          power_factor: r['power_factor'],
          quality_flag: r['quality_flag']
        }
      end

      MeterReading.insert_all(records)
      count += records.size
      puts "  Inserted #{count} readings..."
    end

    { success: true, records: count, source: file_path }
  end

  def load_customers_from_csv(file_path)
    raise "File not found: #{file_path}" unless File.exist?(file_path)

    customers = []
    count = 0

    CSV.foreach(file_path, headers: true) do |row|
      customers << {
        id: row['id'].to_i,
        customer_hash: row['customer_hash'],
        segment_id: row['segment_id'],
        tariff_type: row['tariff_type'],
        solar_installed: row['solar_installed'] == 'True',
        ev_charging: row['ev_charging'] == 'True',
        demand_response_opted_in: row['demand_response_opted_in'] == 'True',
        created_at: Time.current,
        updated_at: Time.current
      }

      if customers.size >= @batch_size
        Customer.insert_all(customers)
        count += customers.size
        customers = []
      end
    end

    Customer.insert_all(customers) unless customers.empty?
    count += customers.size

    { success: true, records: count, source: file_path }
  end

  def load_transformers_from_csv(file_path)
    raise "File not found: #{file_path}" unless File.exist?(file_path)

    transformers = []
    count = 0

    CSV.foreach(file_path, headers: true) do |row|
      transformers << {
        id: row['id'].to_i,
        transformer_number: row['transformer_number'],
        capacity_kva: row['capacity_kva'].to_f,
        age_years: row['age_years'].to_f,
        status: row['status'],
        failure_risk: row['failure_risk'].to_f,
        created_at: Time.current,
        updated_at: Time.current
      }

      if transformers.size >= @batch_size
        Transformer.insert_all(transformers)
        count += transformers.size
        transformers = []
      end
    end

    Transformer.insert_all(transformers) unless transformers.empty?
    count += transformers.size

    { success: true, records: count, source: file_path }
  end

  private

  def build_reading_from_row(row)
    {
      meter_id: row['meter_id'].to_i,
      reading_time: Time.parse(row['reading_time']),
      consumption_kwh: row['consumption_kwh'].to_f,
      demand_kw: row['demand_kw'].to_f,
      voltage: row['voltage'].to_f,
      power_factor: row['power_factor'].to_f,
      quality_flag: row['quality_flag']
    }
  end
end
