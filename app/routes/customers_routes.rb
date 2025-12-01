# frozen_string_literal: true

class RedMetersAPI < Sinatra::Base
  # GET /api/v1/customers
  get '/api/v1/customers' do
    customers = Customer.order(created_at: :desc)
    customers = customers.by_segment(params[:segment]) if params[:segment]
    customers = customers.limit(params[:limit] || 100)
                         .offset(params[:offset] || 0)

    json({
           customers: customers.map(&:to_api_response),
           total: Customer.count
         })
  end

  # GET /api/v1/customers/:id
  get '/api/v1/customers/:id' do
    customer = Customer.find(params[:id])
    json customer.to_api_response(include_meters: params[:include_meters] == 'true')
  end

  # GET /api/v1/customers/segments
  get '/api/v1/customers/segments' do
    segments = Customer.group(:segment_id).count

    json({
           segments: segments.map do |segment, count|
             {
               segment_id: segment,
               segment_name: segment&.titleize&.gsub('_', ' '),
               count: count,
               percentage: (count.to_f / Customer.count * 100).round(1)
             }
           end,
           total_customers: Customer.count
         })
  end

  # PUT /api/v1/customers/:id
  put '/api/v1/customers/:id' do
    customer = Customer.find(params[:id])
    data = JSON.parse(request.body.read, symbolize_names: true)
    customer.update!(data)
    json customer.to_api_response
  end
end

