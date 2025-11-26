# frozen_string_literal: true

class Prediction < ApplicationRecord
  TYPES = %w[anomaly failure_risk demand_forecast segment_change].freeze

  validates :prediction_type, presence: true, inclusion: { in: TYPES }
  validates :probability, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 1 }, allow_nil: true
  validates :confidence, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }, allow_nil: true

  scope :anomalies, -> { where(prediction_type: 'anomaly') }
  scope :failure_risks, -> { where(prediction_type: 'failure_risk') }
  scope :demand_forecasts, -> { where(prediction_type: 'demand_forecast') }
  scope :recent, ->(hours = 24) { where('created_at > ?', hours.hours.ago) }
  scope :high_confidence, -> { where('confidence > ?', 80) }

  def to_api_response
    {
      id: id,
      prediction_type: prediction_type,
      asset_type: asset_type,
      asset_id: asset_id,
      probability: probability&.to_f,
      confidence: confidence,
      details: details,
      predicted_for: predicted_for&.iso8601,
      created_at: created_at.iso8601
    }
  end

  def asset
    return nil unless asset_type && asset_id

    case asset_type
    when 'smart_meter' then SmartMeter.find_by(id: asset_id)
    when 'transformer' then Transformer.find_by(id: asset_id)
    when 'customer' then Customer.find_by(id: asset_id)
    end
  end

  def high_probability?
    probability && probability > 0.7
  end
end
