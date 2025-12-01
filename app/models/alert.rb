# frozen_string_literal: true

class Alert < ApplicationRecord
  SEVERITIES = %w[info warning critical].freeze
  SOURCES = %w[anomaly_detection failure_prediction manual voltage_issue demand_spike].freeze

  validates :title, presence: true, length: { maximum: 200 }
  validates :severity, presence: true, inclusion: { in: SEVERITIES }
  validates :source, inclusion: { in: SOURCES }, allow_nil: true
  validates :confidence, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }, allow_nil: true

  scope :active, -> { where(resolved_at: nil) }
  scope :resolved, -> { where.not(resolved_at: nil) }
  scope :critical, -> { where(severity: 'critical') }
  scope :warnings, -> { where(severity: 'warning') }
  scope :recent, ->(hours = 24) { where('created_at > ?', hours.hours.ago) }

  def to_api_response
    {
      id: id,
      title: title,
      description: description,
      severity: severity,
      source: source,
      confidence: confidence,
      asset_type: asset_type,
      asset_id: asset_id,
      detected_at: detected_at&.iso8601,
      resolved_at: resolved_at&.iso8601,
      resolved_by: resolved_by,
      is_active: active?,
      created_at: created_at.iso8601
    }
  end

  def active?
    resolved_at.nil?
  end

  def resolve!(by:)
    update!(resolved_at: Time.current, resolved_by: by)
  end

  def asset
    return nil unless asset_type && asset_id

    case asset_type
    when 'smart_meter' then SmartMeter.find_by(id: asset_id)
    when 'transformer' then Transformer.find_by(id: asset_id)
    end
  end
end

