# frozen_string_literal: true

class SmartMeter < ApplicationRecord
  has_many :readings, class_name: 'MeterReading', foreign_key: 'meter_id', dependent: :destroy
  belongs_to :customer, optional: true
  belongs_to :transformer, optional: true

  validates :meter_number, presence: true, uniqueness: true, length: { maximum: 50 }
  validates :status, inclusion: { in: %w[active inactive maintenance decommissioned] }

  scope :active, -> { where(status: 'active') }
  scope :with_recent_readings, lambda {
    joins(:readings)
      .where('meter_readings.reading_time > ?', 24.hours.ago)
      .distinct
  }

  def to_api_response(include_readings: false)
    response = {
      id: id,
      meter_number: meter_number,
      customer_id: customer_id,
      transformer_id: transformer_id,
      meter_type: meter_type,
      status: status,
      installed_at: installed_at&.iso8601,
      created_at: created_at.iso8601,
      updated_at: updated_at.iso8601
    }

    if include_readings
      response[:recent_readings] = readings
                                   .where('reading_time > ?', 7.days.ago)
                                   .order(reading_time: :desc)
                                   .limit(100)
                                   .map(&:to_api_response)
    end

    response
  end

  def latest_reading
    readings.order(reading_time: :desc).first
  end

  def average_consumption(period: 30.days)
    readings.where('reading_time > ?', period.ago).average(:consumption_kwh)
  end
end

