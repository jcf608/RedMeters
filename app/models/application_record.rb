# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  # Common helper method for API responses
  def to_api_response(options = {})
    as_json(options)
  end
end

