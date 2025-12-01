# frozen_string_literal: true

class CreateAlerts < ActiveRecord::Migration[7.2]
  def change
    create_table :alerts do |t|
      t.string :title, null: false, limit: 200
      t.text :description
      t.string :severity, null: false, limit: 20
      t.string :source, limit: 50
      t.integer :confidence
      t.string :asset_type, limit: 50
      t.bigint :asset_id
      t.timestamp :detected_at
      t.timestamp :resolved_at
      t.string :resolved_by, limit: 100
      t.timestamps

      t.index %i[severity created_at]
      t.index :resolved_at
      t.index %i[asset_type asset_id]
    end
  end
end

