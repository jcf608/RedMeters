# frozen_string_literal: true

class CreatePredictions < ActiveRecord::Migration[7.2]
  def change
    create_table :predictions do |t|
      t.string :prediction_type, null: false, limit: 50
      t.string :asset_type, limit: 50
      t.bigint :asset_id
      t.decimal :probability, precision: 5, scale: 4
      t.decimal :confidence, precision: 5, scale: 2
      t.jsonb :details
      t.timestamp :predicted_for
      t.timestamps

      t.index %i[prediction_type created_at]
      t.index %i[asset_type asset_id]
    end
  end
end
