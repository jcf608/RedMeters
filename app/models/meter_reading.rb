# frozen_string_literal: true

class MeterReading < ApplicationRecord
  belongs_to :meter, class_name: 'SmartMeter'

  validates :meter_id, presence: true
  validates :reading_time, presence: true
  validates :consumption_kwh, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :demand_kw, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :voltage, numericality: { greater_than: 0 }, allow_nil: true
  validates :power_factor, numericality: { greater_than: 0, less_than_or_equal_to: 1 }, allow_nil: true

  scope :normal, -> { where(quality_flag: 'normal') }
  scope :anomalies, -> { where(quality_flag: 'anomaly') }
  scope :recent, ->(hours = 24) { where('reading_time > ?', hours.hours.ago) }
  scope :for_date_range, ->(from, to) { where(reading_time: from..to) }

  def to_api_response
    {
      id: id,
      meter_id: meter_id,
      reading_time: reading_time.iso8601,
      consumption_kwh: consumption_kwh&.to_f,
      demand_kw: demand_kw&.to_f,
      voltage: voltage&.to_f,
      power_factor: power_factor&.to_f,
      quality_flag: quality_flag
    }
  end

  def anomaly?
    quality_flag == 'anomaly'
  end

  def voltage_deviation
    return nil unless voltage

    ((voltage - 230).abs / 230.0 * 100).round(2)
  end
end
