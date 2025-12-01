# frozen_string_literal: true

class CreateMeterReadings < ActiveRecord::Migration[7.2]
  def change
    create_table :meter_readings do |t|
      t.bigint :meter_id, null: false
      t.timestamp :reading_time, null: false
      t.decimal :consumption_kwh, precision: 12, scale: 4
      t.decimal :demand_kw, precision: 10, scale: 4
      t.decimal :voltage, precision: 8, scale: 2
      t.decimal :power_factor, precision: 5, scale: 4
      t.string :quality_flag, limit: 20

      t.index %i[meter_id reading_time]
      t.index :reading_time
      t.index :quality_flag
    end

    add_foreign_key :meter_readings, :smart_meters, column: :meter_id
  end
end

