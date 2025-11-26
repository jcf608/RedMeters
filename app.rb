# frozen_string_literal: true

require 'sinatra/base'
require 'sinatra/json'
require 'active_record'
require 'dotenv/load'
require 'rack/cors'

require_relative 'config/database'

# Load models (application_record first)
require_relative 'app/models/application_record'
Dir[File.join(__dir__, 'app', 'models', '*.rb')].sort.each { |f| require f }

# Load services
Dir[File.join(__dir__, 'app', 'services', '*.rb')].each { |f| require f }

class RedMetersAPI < Sinatra::Base
  configure do
    set :show_exceptions, false
    set :raise_errors, true
    enable :logging
    set :default_content_type, 'application/json'
  end

  use Rack::Cors do
    allow do
      origins '*' # Allow all origins for development
      resource '*',
               headers: :any,
               methods: %i[get post put patch delete options]
    end
  end

  before do
    content_type :json
    Database.connect unless ActiveRecord::Base.connected?
  end

  # Health check endpoint
  get '/health' do
    json({
           status: 'healthy',
           timestamp: Time.now.utc.iso8601,
           database: check_database,
           scheduler: check_scheduler,
           models: check_ml_models,
           version: '1.0.0'
         })
  end

  # Root endpoint
  get '/' do
    json({
           name: 'Red Energy Meters API',
           version: '1.0.0',
           description: 'Smart Meter Analytics Platform',
           endpoints: [
             '/api/v1/meters',
             '/api/v1/readings',
             '/api/v1/predictions',
             '/api/v1/customers',
             '/api/v1/alerts',
             '/api/v1/analytics'
           ]
         })
  end

  # Load route modules
  Dir[File.join(__dir__, 'app', 'routes', '*.rb')].each { |f| require f }

  # Error handling
  error ActiveRecord::RecordNotFound do
    status 404
    json({ error: 'Record not found', code: 'NOT_FOUND' })
  end

  error ActiveRecord::RecordInvalid do |e|
    status 422
    json({
           error: 'Validation failed',
           code: 'VALIDATION_ERROR',
           details: e.record.errors.messages
         })
  end

  error StandardError do |e|
    status 500
    logger.error "#{e.class}: #{e.message}\n#{e.backtrace.first(10).join("\n")}"
    json({
           error: 'Internal server error',
           code: 'INTERNAL_ERROR',
           message: ENV['RACK_ENV'] == 'development' ? e.message : nil
         })
  end

  private

  def check_database
    ActiveRecord::Base.connection.execute('SELECT 1')
    { status: 'connected' }
  rescue StandardError => e
    { status: 'error', message: e.message }
  end

  def check_scheduler
    {
      status: BackgroundScheduler.running? ? 'running' : 'stopped',
      enabled: ENV['ENABLE_SCHEDULER'] != 'false'
    }
  end

  def check_ml_models
    models_path = ENV.fetch('ML_MODELS_PATH', './ml/models')
    models = %w[anomaly_detector failure_predictor customer_segmenter demand_forecaster]

    models.map do |model|
      path = File.join(models_path, "#{model}.joblib")
      { name: model, loaded: File.exist?(path) }
    end
  end
end

# Start background scheduler if not in test mode
if ENV['RACK_ENV'] != 'test' && ENV['ENABLE_SCHEDULER'] != 'false'
  Thread.new do
    sleep 2 # Give the app time to fully start
    BackgroundScheduler.start!
  end
end
