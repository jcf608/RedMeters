# frozen_string_literal: true

class Transformer < ApplicationRecord
  has_many :smart_meters, dependent: :nullify

  validates :transformer_number, presence: true, uniqueness: true, length: { maximum: 50 }
  validates :status, inclusion: { in: %w[operational maintenance warning critical decommissioned] }
  validates :capacity_kva, numericality: { greater_than: 0 }, allow_nil: true
  validates :failure_risk, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 1 }, allow_nil: true

  scope :operational, -> { where(status: 'operational') }
  scope :high_risk, -> { where('failure_risk > ?', 0.7) }
  scope :aging, -> { where('age_years > ?', 20) }

  def to_api_response(include_meters: false)
    response = {
      id: id,
      transformer_number: transformer_number,
      capacity_kva: capacity_kva&.to_f,
      age_years: age_years&.to_f,
      status: status,
      failure_risk: failure_risk&.to_f,
      connected_meters: smart_meters.count,
      created_at: created_at.iso8601,
      updated_at: updated_at.iso8601
    }

    response[:meters] = smart_meters.map(&:to_api_response) if include_meters

    response
  end

  def risk_level
    return 'unknown' unless failure_risk

    case failure_risk
    when 0..0.3 then 'low'
    when 0.3..0.6 then 'medium'
    when 0.6..0.8 then 'high'
    else 'critical'
    end
  end

  def current_load_percentage
    return nil unless capacity_kva&.positive?

    total_demand = smart_meters.joins(:readings)
                               .where('meter_readings.reading_time > ?', 1.hour.ago)
                               .sum('meter_readings.demand_kw')

    ((total_demand / capacity_kva) * 100).round(2)
  end
end

