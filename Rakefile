# frozen_string_literal: true

require 'uri'
require 'active_record'
require 'dotenv/load'
require_relative 'config/database'

namespace :db do
  desc 'Run database migrations'
  task :migrate do
    Database.connect
    ActiveRecord::MigrationContext.new('db/migrate').migrate
    puts '✅ Migrations complete'
  end

  desc 'Rollback the last migration'
  task :rollback do
    Database.connect
    ActiveRecord::MigrationContext.new('db/migrate').rollback
    puts '✅ Rollback complete'
  end

  desc 'Show migration status'
  task :status do
    Database.connect
    puts "\nMigration Status:\n"
    ActiveRecord::MigrationContext.new('db/migrate').migrations_status.each do |status, version, name|
      puts "  #{status.ljust(8)} #{version} #{name}"
    end
  end

  desc 'Load seed data'
  task :seed do
    Database.connect
    # Load application_record first, then other models
    require File.join(__dir__, 'app', 'models', 'application_record.rb')
    Dir[File.join(__dir__, 'app', 'models', '*.rb')].each { |f| require f }
    load 'db/seeds.rb'
    puts '✅ Seed data loaded'
  end

  desc 'Reset database (drop, create, migrate, seed)'
  task :reset do
    puts '⚠️  This will destroy all data. Continue? (y/n)'
    exit unless $stdin.gets.chomp.downcase == 'y'

    Rake::Task['db:drop'].invoke
    Rake::Task['db:create'].invoke
    Rake::Task['db:migrate'].invoke
    Rake::Task['db:seed'].invoke
  end

  desc 'Create database'
  task :create do
    database_url = ENV.fetch('DATABASE_URL')
    uri = URI.parse(database_url)
    db_name = uri.path[1..]

    # Preserve query params (sslmode, channel_binding) when connecting to postgres db
    base_url = database_url.gsub(%r{/[^/?]+(\?|$)}, '/postgres\1')
    ActiveRecord::Base.establish_connection(base_url)
    ActiveRecord::Base.connection.create_database(db_name)
    puts "✅ Database '#{db_name}' created"
  rescue ActiveRecord::DatabaseAlreadyExists
    puts 'ℹ️  Database already exists'
  rescue StandardError => e
    if e.message.include?('already exists')
      puts 'ℹ️  Database already exists'
    else
      raise
    end
  end

  desc 'Drop database'
  task :drop do
    database_url = ENV.fetch('DATABASE_URL')
    uri = URI.parse(database_url)
    db_name = uri.path[1..]

    base_url = database_url.gsub(%r{/[^/]+$}, '/postgres')
    ActiveRecord::Base.establish_connection(base_url)
    ActiveRecord::Base.connection.drop_database(db_name)
    puts "✅ Database '#{db_name}' dropped"
  rescue ActiveRecord::NoDatabaseError
    puts "ℹ️  Database doesn't exist"
  end
end

namespace :data do
  desc 'Load sample meter data'
  task :load_sample do
    Database.connect
    require_relative 'app/services/data_ingestion_service'

    puts 'Loading sample data...'
    service = DataIngestionService.new

    # Load from parquet if available
    parquet_path = 'data/sample/meter_readings.parquet'
    if File.exist?(parquet_path)
      result = service.load_from_parquet(parquet_path)
      puts "✅ Loaded #{result[:records]} readings from parquet"
    else
      puts '⚠️  No sample data found. Run: python ml/src/generate_sample_data.py'
    end
  end
end

desc 'Start development server'
task :server do
  exec 'bundle exec rackup -p 4567'
end

desc 'Start console'
task :console do
  require_relative 'app'
  Database.connect
  require 'pry'
  Pry.start
end
