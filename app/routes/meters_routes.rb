# frozen_string_literal: true

class RedMetersAPI < Sinatra::Base
  # GET /api/v1/meters
  get '/api/v1/meters' do
    meters = SmartMeter.limit(params[:limit] || 100)
                       .offset(params[:offset] || 0)
                       .order(created_at: :desc)

    json({
           meters: meters.map(&:to_api_response),
           total: SmartMeter.count,
           limit: (params[:limit] || 100).to_i,
           offset: (params[:offset] || 0).to_i
         })
  end

  # GET /api/v1/meters/:id
  get '/api/v1/meters/:id' do
    meter = SmartMeter.find(params[:id])
    json meter.to_api_response(include_readings: params[:include_readings] == 'true')
  end

  # GET /api/v1/meters/:id/readings
  get '/api/v1/meters/:id/readings' do
    meter = SmartMeter.find(params[:id])
    readings = meter.readings
                    .where(reading_time: parse_date_range)
                    .order(reading_time: :desc)
                    .limit(params[:limit] || 1000)

    json({
           meter_id: meter.id,
           meter_number: meter.meter_number,
           readings: readings.map(&:to_api_response),
           count: readings.size
         })
  end

  # POST /api/v1/meters
  post '/api/v1/meters' do
    data = JSON.parse(request.body.read, symbolize_names: true)
    meter = SmartMeter.create!(data)
    status 201
    json meter.to_api_response
  end

  # PUT /api/v1/meters/:id
  put '/api/v1/meters/:id' do
    meter = SmartMeter.find(params[:id])
    data = JSON.parse(request.body.read, symbolize_names: true)
    meter.update!(data)
    json meter.to_api_response
  end

  private

  def parse_date_range
    from_date = params[:from] ? Time.parse(params[:from]) : 7.days.ago
    to_date = params[:to] ? Time.parse(params[:to]) : Time.current
    from_date..to_date
  end
end

