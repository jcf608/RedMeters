# frozen_string_literal: true

class CreateDemandForecasts < ActiveRecord::Migration[7.2]
  def change
    create_table :demand_forecasts do |t|
      t.timestamp :forecast_time, null: false
      t.decimal :predicted_demand_mw, precision: 10, scale: 2
      t.decimal :confidence_lower, precision: 10, scale: 2
      t.decimal :confidence_upper, precision: 10, scale: 2
      t.decimal :actual_demand_mw, precision: 10, scale: 2
      t.timestamps

      t.index :forecast_time
    end
  end
end
