# frozen_string_literal: true

class CreateCustomers < ActiveRecord::Migration[7.2]
  def change
    create_table :customers do |t|
      t.string :customer_hash, null: false, limit: 64
      t.string :segment_id, limit: 50
      t.decimal :segment_confidence, precision: 5, scale: 2
      t.string :tariff_type, limit: 30
      t.boolean :solar_installed, default: false
      t.boolean :ev_charging, default: false
      t.boolean :demand_response_opted_in, default: false
      t.timestamps

      t.index :customer_hash, unique: true
      t.index :segment_id
    end
  end
end
