# frozen_string_literal: true

source 'https://rubygems.org'
ruby '~> 3.2'

# Web framework
gem 'puma', '~> 6.4'
gem 'rack-cors', '~> 2.0'
gem 'rackup', '~> 2.1'
gem 'sinatra', '~> 4.0'
gem 'sinatra-contrib', '~> 4.0'

# Database
gem 'activerecord', '~> 7.2'
gem 'pg', '~> 1.5'
gem 'rake', '~> 13.2'

# Background jobs (no Redis needed)
gem 'rufus-scheduler', '~> 3.9'

# Utilities
gem 'dotenv', '~> 3.1'
gem 'httparty', '~> 0.22'
gem 'oj', '~> 3.16'

# Azure Storage
gem 'azure-storage-blob', '~> 2.0'

# ML model loading (for ONNX models exported from Python)
gem 'onnxruntime', '~> 0.7'

group :development, :test do
  gem 'pry', '~> 0.14'
  gem 'rack-test', '~> 2.1'
  gem 'rspec', '~> 3.13'
  gem 'rubocop', '~> 1.69'
end
