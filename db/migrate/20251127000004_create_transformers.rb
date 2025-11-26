# frozen_string_literal: true

class CreateTransformers < ActiveRecord::Migration[7.2]
  def change
    create_table :transformers do |t|
      t.string :transformer_number, null: false, limit: 50
      t.decimal :capacity_kva, precision: 10, scale: 2
      t.decimal :age_years, precision: 4, scale: 1
      t.string :status, limit: 20, default: 'operational'
      t.decimal :failure_risk, precision: 5, scale: 3
      t.timestamps

      t.index :transformer_number, unique: true
      t.index :status
    end
  end
end
