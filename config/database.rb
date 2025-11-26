# frozen_string_literal: true

require 'active_record'
require 'dotenv/load'
require 'logger'

module Database
  class << self
    def connect
      establish_connection unless ActiveRecord::Base.connected?
    end

    def establish_connection
      database_url = ENV.fetch('DATABASE_URL') do
        raise 'DATABASE_URL not found. Check your .env file.'
      end

      ActiveRecord::Base.establish_connection(database_url)

      if ENV['RACK_ENV'] == 'development'
        ActiveRecord::Base.logger = Logger.new($stdout)
        ActiveRecord::Base.logger.level = Logger::DEBUG
      end

      puts '✅ Connected to PostgreSQL'
    end

    def connected?
      ActiveRecord::Base.connected?
    end

    def disconnect
      ActiveRecord::Base.connection_pool.disconnect! if connected?
    end
  end
end
