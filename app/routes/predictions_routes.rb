# frozen_string_literal: true

class RedMetersAPI < Sinatra::Base
  # GET /api/v1/predictions
  get '/api/v1/predictions' do
    predictions = Prediction.order(created_at: :desc)
    predictions = predictions.where(prediction_type: params[:type]) if params[:type]
    predictions = predictions.limit(params[:limit] || 50)

    json({
           predictions: predictions.map(&:to_api_response),
           total: predictions.count
         })
  end

  # GET /api/v1/predictions/:id
  get '/api/v1/predictions/:id' do
    prediction = Prediction.find(params[:id])
    json prediction.to_api_response
  end

  # POST /api/v1/predictions/anomalies
  post '/api/v1/predictions/anomalies' do
    data = JSON.parse(request.body.read, symbolize_names: true)
    meter_ids = data[:meter_ids]

    # Call anomaly detection service
    service = AnomalyDetectionService.new
    results = service.detect_anomalies(meter_ids)

    json({
           success: true,
           anomalies_detected: results.count { |r| r[:is_anomaly] },
           results: results
         })
  end

  # GET /api/v1/predictions/demand-forecast
  get '/api/v1/predictions/demand-forecast' do
    hours = (params[:hours] || 72).to_i

    forecasts = DemandForecast.future
                              .where('forecast_time < ?', hours.hours.from_now)
                              .order(:forecast_time)

    json({
           forecasts: forecasts.map(&:to_api_response),
           hours_ahead: hours,
           generated_at: Time.current.iso8601
         })
  end
end

