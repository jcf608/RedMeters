# frozen_string_literal: true

class DemandForecast < ApplicationRecord
  validates :forecast_time, presence: true
  validates :predicted_demand_mw, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  scope :future, -> { where('forecast_time > ?', Time.current) }
  scope :past, -> { where('forecast_time <= ?', Time.current) }
  scope :for_date_range, ->(from, to) { where(forecast_time: from..to) }
  scope :with_actuals, -> { where.not(actual_demand_mw: nil) }

  def to_api_response
    {
      id: id,
      forecast_time: forecast_time.iso8601,
      predicted_demand_mw: predicted_demand_mw&.to_f,
      confidence_lower: confidence_lower&.to_f,
      confidence_upper: confidence_upper&.to_f,
      actual_demand_mw: actual_demand_mw&.to_f,
      accuracy: accuracy_percentage,
      created_at: created_at.iso8601
    }
  end

  def accuracy_percentage
    return nil unless actual_demand_mw && predicted_demand_mw&.positive?

    error = (actual_demand_mw - predicted_demand_mw).abs
    (100 - (error / predicted_demand_mw * 100)).round(2)
  end

  def within_confidence_interval?
    return nil unless actual_demand_mw && confidence_lower && confidence_upper

    actual_demand_mw >= confidence_lower && actual_demand_mw <= confidence_upper
  end
end

