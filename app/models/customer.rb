# frozen_string_literal: true

class Customer < ApplicationRecord
  has_many :smart_meters, dependent: :nullify

  validates :customer_hash, presence: true, uniqueness: true, length: { maximum: 64 }
  validates :tariff_type, inclusion: { in: %w[flat tou demand] }, allow_nil: true

  SEGMENTS = %w[
    early_morning_industrial
    business_hours_commercial
    evening_residential_peak
    solar_battery_households
    ev_charging_households
    efficiency_optimizers
    high_consumption_all_day
    seasonal_variation_heavy
    weekend_shift_users
    night_owl_households
    retired_home_all_day
    low_use_minimal
  ].freeze

  scope :by_segment, ->(segment) { where(segment_id: segment) }
  scope :with_solar, -> { where(solar_installed: true) }
  scope :with_ev, -> { where(ev_charging: true) }
  scope :demand_response, -> { where(demand_response_opted_in: true) }

  def to_api_response(include_meters: false)
    response = {
      id: id,
      customer_hash: customer_hash,
      segment_id: segment_id,
      segment_confidence: segment_confidence&.to_f,
      tariff_type: tariff_type,
      solar_installed: solar_installed,
      ev_charging: ev_charging,
      demand_response_opted_in: demand_response_opted_in,
      created_at: created_at.iso8601,
      updated_at: updated_at.iso8601
    }

    response[:meters] = smart_meters.map(&:to_api_response) if include_meters

    response
  end

  def segment_name
    segment_id&.titleize&.gsub('_', ' ')
  end

  def total_consumption(period: 30.days)
    smart_meters.joins(:readings)
                .where('meter_readings.reading_time > ?', period.ago)
                .sum('meter_readings.consumption_kwh')
  end
end

