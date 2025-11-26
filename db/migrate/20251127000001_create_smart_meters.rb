# frozen_string_literal: true

class CreateSmartMeters < ActiveRecord::Migration[7.2]
  def change
    create_table :smart_meters do |t|
      t.string :meter_number, null: false, limit: 50
      t.bigint :customer_id
      t.bigint :transformer_id
      t.string :meter_type, limit: 30
      t.string :status, limit: 20, default: 'active'
      t.timestamp :installed_at
      t.timestamps

      t.index :meter_number, unique: true
      t.index :customer_id
      t.index :status
    end
  end
end
