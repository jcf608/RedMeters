# frozen_string_literal: true

require 'rufus-scheduler'

# Background job scheduler for periodic tasks:
# - Meter reading simulation (demo/dev mode)
# - Anomaly detection scanning
# - Alert cleanup
class BackgroundScheduler
  class << self
    attr_reader :scheduler

    def start!
      return if running?

      @scheduler = Rufus::Scheduler.new

      schedule_jobs
      logger.info('[Scheduler] Background scheduler started')

      @scheduler
    end

    def stop!
      return unless running?

      @scheduler.shutdown
      @scheduler = nil
      logger.info('[Scheduler] Background scheduler stopped')
    end

    def running?
      @scheduler&.up?
    end

    private

    def schedule_jobs
      # Generate meter readings every 15 minutes (for demo/simulation)
      @scheduler.every '15m', first: :now, overlap: false do
        run_reading_simulation
      end

      # Run anomaly detection every 5 minutes
      @scheduler.every '5m', first_in: '1m', overlap: false do
        run_anomaly_detection
      end

      # Clean up old resolved alerts weekly
      @scheduler.cron '0 3 * * 0', overlap: false do
        cleanup_old_alerts
      end

      logger.info('[Scheduler] Jobs scheduled: readings (15m), anomaly detection (5m), cleanup (weekly)')
    end

    def run_reading_simulation
      logger.info('[Scheduler] Running meter reading simulation...')
      result = MeterReadingSimulator.generate_batch
      logger.info("[Scheduler] Generated #{result[:readings].size} readings")
    rescue StandardError => e
      logger.error("[Scheduler] Reading simulation failed: #{e.message}")
      logger.error(e.backtrace.first(5).join("\n"))
    end

    def run_anomaly_detection
      logger.info('[Scheduler] Running anomaly detection...')
      service = AnomalyDetectionService.new
      results = service.detect_anomalies

      anomaly_count = results.count { |r| r[:is_anomaly] }
      logger.info("[Scheduler] Anomaly detection complete: #{anomaly_count} anomalies in #{results.size} readings")
    rescue StandardError => e
      logger.error("[Scheduler] Anomaly detection failed: #{e.message}")
      logger.error(e.backtrace.first(5).join("\n"))
    end

    def cleanup_old_alerts
      logger.info('[Scheduler] Cleaning up old resolved alerts...')
      deleted = Alert.resolved.where('resolved_at < ?', 30.days.ago).delete_all
      logger.info("[Scheduler] Deleted #{deleted} old alerts")
    rescue StandardError => e
      logger.error("[Scheduler] Alert cleanup failed: #{e.message}")
    end

    def logger
      @logger ||= Logger.new($stdout)
    end
  end
end


