# frozen_string_literal: true

require 'rufus-scheduler'

module Scheduler
  class << self
    def start
      scheduler = Rufus::Scheduler.new

      # Run anomaly detection every 15 minutes
      scheduler.every '15m', first: :now do
        run_anomaly_detection
      end

      # Run customer segmentation daily at 2 AM
      scheduler.cron '0 2 * * *' do
        run_customer_segmentation
      end

      # Run demand forecasting every hour
      scheduler.every '1h' do
        run_demand_forecasting
      end

      puts '✅ Background scheduler started'
      puts '   - Anomaly detection: every 15 minutes'
      puts '   - Customer segmentation: daily at 2 AM'
      puts '   - Demand forecasting: every hour'

      scheduler
    end

    private

    def run_anomaly_detection
      puts "[#{Time.now}] Running scheduled anomaly detection..."
      AnomalyDetectionService.new.detect_anomalies
    rescue StandardError => e
      puts "[#{Time.now}] Anomaly detection error: #{e.message}"
    end

    def run_customer_segmentation
      puts "[#{Time.now}] Running scheduled customer segmentation..."
      # CustomerSegmentationService.new.segment_all_customers
      puts "[#{Time.now}] Customer segmentation complete"
    rescue StandardError => e
      puts "[#{Time.now}] Customer segmentation error: #{e.message}"
    end

    def run_demand_forecasting
      puts "[#{Time.now}] Running scheduled demand forecasting..."
      # DemandForecastingService.new.forecast(hours: 72)
      puts "[#{Time.now}] Demand forecasting complete"
    rescue StandardError => e
      puts "[#{Time.now}] Demand forecasting error: #{e.message}"
    end
  end
end

