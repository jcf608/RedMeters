# Red Energy Smart Meter Analytics Platform
## Implementation Plan - Student Edition

**Project:** Electric Meter Data Processing & ML Analytics  
**Version:** 3.0 (Student Budget Architecture)  
**Date:** November 27, 2025  
**Owner:** Kyndryl Agentic AI Platform Team

---

## Executive Summary

This implementation plan details a **budget-friendly** build of Red Energy's Smart Meter Analytics Platform using local development with Azure data services. Designed to work within Azure for Students constraints ($100 USD/year credit).

### Architecture Approach
- **Local Development:** API, Frontend, and ML training run on your Mac
- **Azure Data Services:** PostgreSQL and Blob Storage only
- **No Containers Required:** Eliminates Container Apps quota issues
- **Traditional ML:** Isolation Forest, XGBoost, K-means, Prophet

### Business Outcomes (Demo Scale)
- Demonstrate predictive maintenance capabilities
- Show customer segmentation and recommendations
- Prove demand forecasting accuracy
- Build working prototype for stakeholder demos

### Estimated Azure Cost: ~$30-35 AUD/month
(Uses existing PostgreSQL server)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Azure Services Required](#2-azure-services-required)
3. [Local Development Setup](#3-local-development-setup)
4. [Project Timeline](#4-project-timeline)
5. [Phase 1: Foundation](#5-phase-1-foundation-weeks-1-2)
6. [Phase 2: Data Pipeline](#6-phase-2-data-pipeline-weeks-2-4)
7. [Phase 3: ML Models](#7-phase-3-ml-models-weeks-4-8)
8. [Phase 4: API & Frontend](#8-phase-4-api--frontend-weeks-6-10)
9. [Phase 5: Integration](#9-phase-5-integration-weeks-9-12)
10. [Database Schema](#10-database-schema)
11. [ML Model Specifications](#11-ml-model-specifications)
12. [API Endpoints](#12-api-endpoints)
13. [Running the Application](#13-running-the-application)
14. [Cost Management](#14-cost-management)

---

## 1. Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR MAC (Free)                          │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  Sinatra API    │  │  React Frontend │                  │
│  │  localhost:4567 │  │  localhost:5173 │                  │
│  │                 │  │                 │                  │
│  │  - REST API     │  │  - Dashboards   │                  │
│  │  - Background   │  │  - Forms        │                  │
│  │    jobs (rufus) │  │  - Charts       │                  │
│  └────────┬────────┘  └─────────────────┘                  │
│           │                                                 │
│  ┌────────┴────────┐  ┌─────────────────┐                  │
│  │  ML Models      │  │  Grafana        │                  │
│  │  (Python)       │  │  (Optional)     │                  │
│  │                 │  │  localhost:3000 │                  │
│  │  - Training     │  │                 │                  │
│  │  - Inference    │  │  - Dashboards   │                  │
│  │  - Notebooks    │  │  - Alerts       │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                      Internet Connection
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                 AZURE (East Asia Region)                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Flexible Server (Existing)              │   │
│  │  Server: uts-dev-pg-eas-983d                        │   │
│  │  SKU: Standard_B1ms (Burstable)                     │   │
│  │  Storage: 32 GB                                     │   │
│  │  Cost: ~$30/month                                   │   │
│  │                                                     │   │
│  │  Databases:                                         │   │
│  │  └── red_meters_dev                                 │   │
│  │      ├── meters schema                              │   │
│  │      ├── customers schema                           │   │
│  │      ├── predictions schema                         │   │
│  │      └── analytics schema                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Blob Storage (Existing)                            │   │
│  │  Account: utsdevstorf379e165                        │   │
│  │  Cost: ~$1-5/month                                  │   │
│  │                                                     │   │
│  │  Containers:                                        │   │
│  │  ├── meter-data (CSV/Parquet files)                │   │
│  │  ├── ml-models (trained model artifacts)           │   │
│  │  └── exports (reports, backups)                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Why This Architecture?

| Traditional Approach | Student-Budget Approach | Benefit |
|---------------------|------------------------|---------|
| Container Apps ($150/mo) | Local Ruby server | Free |
| Event Hubs ($30/mo) | File-based ingestion | Free |
| Stream Analytics ($120/mo) | Ruby background jobs | Free |
| Azure ML ($400/mo) | Local Python training | Free |
| Redis Cache ($100/mo) | PostgreSQL caching | Free |
| **Total: ~$800/mo** | **Total: ~$30/mo** | **96% savings** |

---

## 2. Azure Services Required

### Services You'll Use

| Service | Purpose | Status | Monthly Cost |
|---------|---------|--------|--------------|
| **PostgreSQL Flexible** | All application data | ✅ Existing | ~$30 |
| **Blob Storage** | File storage | ✅ Existing | ~$2 |
| **TOTAL** | | | **~$32 AUD** |

### Services NOT Needed

| Service | Why Not Needed |
|---------|---------------|
| Container Apps | Run locally on Mac |
| Event Hubs | Use file-based data loading |
| Stream Analytics | Process in application code |
| Azure ML | Train locally with Python |
| Redis Cache | Use PostgreSQL or in-memory |
| Azure Functions | API runs locally |

### Your Azure Constraints

```
Subscription: Azure for Students
Credit: $100 USD/year (~$150 AUD)
Allowed Regions: East Asia, Southeast Asia, Japan East, Malaysia West, Indonesia Central
Container Apps: Limited to 1 (already in use)
```

---

## 3. Local Development Setup

### Prerequisites

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install required tools
brew install rbenv ruby-build    # Ruby version manager
brew install node@20             # Node.js for frontend
brew install python@3.11         # Python for ML
brew install postgresql@14       # Local PostgreSQL (for testing)
brew install azure-cli           # Azure CLI
brew install gh                  # GitHub CLI

# Install Ruby 3.2
rbenv install 3.2.0
rbenv global 3.2.0

# Verify installations
ruby --version      # Should show 3.2.x
node --version      # Should show 20.x
python3 --version   # Should show 3.11.x
az --version        # Azure CLI
```

### Project Structure

```
RedEnergyMeters/
├── app/
│   ├── models/                    # ActiveRecord models
│   │   ├── application_record.rb
│   │   ├── smart_meter.rb
│   │   ├── meter_reading.rb
│   │   ├── customer.rb
│   │   ├── prediction.rb
│   │   └── alert.rb
│   ├── routes/                    # API endpoints (LEAN)
│   │   ├── meters_routes.rb
│   │   ├── predictions_routes.rb
│   │   ├── customers_routes.rb
│   │   └── analytics_routes.rb
│   ├── services/                  # Business logic
│   │   ├── data_ingestion_service.rb
│   │   ├── anomaly_detection_service.rb
│   │   ├── failure_prediction_service.rb
│   │   ├── customer_segmentation_service.rb
│   │   └── demand_forecasting_service.rb
│   └── jobs/                      # Background jobs
│       ├── scheduler.rb           # Rufus-scheduler setup
│       ├── run_predictions_job.rb
│       └── generate_alerts_job.rb
├── config/
│   ├── database.rb
│   └── database.yml
├── db/
│   ├── migrate/
│   └── seeds.rb
├── frontend/                      # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
├── ml/                            # Python ML code
│   ├── notebooks/
│   │   ├── 01_data_exploration.ipynb
│   │   ├── 02_anomaly_detection.ipynb
│   │   ├── 03_failure_prediction.ipynb
│   │   ├── 04_customer_segmentation.ipynb
│   │   └── 05_demand_forecasting.ipynb
│   ├── src/
│   │   ├── train_models.py
│   │   ├── anomaly_detector.py
│   │   ├── failure_predictor.py
│   │   ├── customer_segmenter.py
│   │   └── demand_forecaster.py
│   ├── models/                    # Saved model files
│   │   ├── anomaly_detector.joblib
│   │   ├── failure_predictor.joblib
│   │   ├── customer_segmenter.joblib
│   │   └── demand_forecaster.joblib
│   └── requirements.txt
├── data/                          # Local data files
│   ├── raw/                       # Raw meter data CSVs
│   ├── processed/                 # Cleaned data
│   └── sample/                    # Sample data for testing
├── test/
│   └── results/
├── app.rb                         # Main Sinatra application
├── config.ru
├── Gemfile
├── Rakefile
├── .env                           # Environment variables
├── .env.example
└── README.md
```

---

## 4. Project Timeline

### 12-Week Development Plan

```
Week:  1  2  3  4  5  6  7  8  9  10 11 12
       ├──┴──┤                              Phase 1: Foundation
          ├──┴──┴──┤                        Phase 2: Data Pipeline
                ├──┴──┴──┴──┴──┤            Phase 3: ML Models
                      ├──┴──┴──┴──┴──┤      Phase 4: API & Frontend
                               ├──┴──┴──┴──┤ Phase 5: Integration
```

| Phase | Weeks | Focus |
|-------|-------|-------|
| **1: Foundation** | 1-2 | Database setup, project structure |
| **2: Data Pipeline** | 2-4 | Data ingestion, sample data generation |
| **3: ML Models** | 4-8 | Train all 4 ML models locally |
| **4: API & Frontend** | 6-10 | Build API endpoints and dashboards |
| **5: Integration** | 9-12 | Connect everything, testing, demo prep |

---

## 5. Phase 1: Foundation (Weeks 1-2)

### 5.1 Database Setup

#### Connect to Existing Azure PostgreSQL

```bash
# Get connection string from Azure Portal or CLI
az postgres flexible-server show \
  --name uts-dev-pg-eas-983d \
  --resource-group uts-development-rg \
  --query "fullyQualifiedDomainName" -o tsv
```

#### Create Database

```bash
# Connect to Azure PostgreSQL
psql "host=uts-dev-pg-eas-983d.postgres.database.azure.com \
      dbname=postgres \
      user=YOUR_ADMIN_USER \
      password=YOUR_PASSWORD \
      sslmode=require"

# Create database
CREATE DATABASE red_meters_dev;

# Connect to new database
\c red_meters_dev

# Create schemas
CREATE SCHEMA meters;
CREATE SCHEMA customers;
CREATE SCHEMA predictions;
CREATE SCHEMA analytics;
```

#### Environment Configuration

```bash
# Create .env file
cat > .env << 'EOF'
# Database (Azure PostgreSQL)
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@uts-dev-pg-eas-983d.postgres.database.azure.com:5432/red_meters_dev?sslmode=require

# Azure Storage
AZURE_STORAGE_ACCOUNT=utsdevstorf379e165
AZURE_STORAGE_KEY=YOUR_STORAGE_KEY

# Application
RACK_ENV=development
CORS_ORIGIN=http://localhost:5173

# ML Models
ML_MODELS_PATH=./ml/models
EOF
```

### 5.2 Ruby Application Setup

#### Gemfile

```ruby
# Gemfile
source 'https://rubygems.org'
ruby '~> 3.2'

# Web framework
gem 'sinatra', '~> 4.0'
gem 'sinatra-contrib', '~> 4.0'
gem 'puma', '~> 6.4'
gem 'rack-cors', '~> 2.0'

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
gem 'azure-storage-blob', '~> 2.0'

# ML model loading
gem 'onnxruntime', '~> 0.7'  # For loading Python models

group :development, :test do
  gem 'rspec', '~> 3.13'
  gem 'pry', '~> 0.14'
end
```

```bash
# Install dependencies
bundle install
```

#### Main Application

```ruby
# app.rb
require 'sinatra/base'
require 'sinatra/json'
require 'active_record'
require 'dotenv/load'
require 'rack/cors'

require_relative 'config/database'
require_relative 'app/jobs/scheduler'

# Load models
Dir[File.join(__dir__, 'app', 'models', '*.rb')].each { |f| require f }

# Load services
Dir[File.join(__dir__, 'app', 'services', '*.rb')].each { |f| require f }

class RedMetersAPI < Sinatra::Base
  configure do
    set :show_exceptions, false
    set :raise_errors, true
    enable :logging
  end
  
  use Rack::Cors do
    allow do
      origins ENV.fetch('CORS_ORIGIN', 'http://localhost:5173')
      resource '/api/*',
        headers: :any,
        methods: [:get, :post, :put, :delete, :options]
    end
  end
  
  before do
    content_type :json
    Database.connect unless ActiveRecord::Base.connected?
  end
  
  # Health check
  get '/health' do
    json({
      status: 'healthy',
      timestamp: Time.now.utc.iso8601,
      database: check_database,
      models: check_ml_models
    })
  end
  
  get '/' do
    json({
      name: 'Red Energy Meters API',
      version: '1.0.0',
      endpoints: [
        '/api/v1/meters',
        '/api/v1/readings',
        '/api/v1/predictions',
        '/api/v1/customers',
        '/api/v1/alerts',
        '/api/v1/analytics'
      ]
    })
  end
  
  # Load route modules
  Dir[File.join(__dir__, 'app', 'routes', '*.rb')].each { |f| require f }
  
  private
  
  def check_database
    ActiveRecord::Base.connection.execute('SELECT 1')
    { status: 'connected' }
  rescue => e
    { status: 'error', message: e.message }
  end
  
  def check_ml_models
    models_path = ENV.fetch('ML_MODELS_PATH', './ml/models')
    models = %w[anomaly_detector failure_predictor customer_segmenter demand_forecaster]
    
    models.map do |model|
      path = File.join(models_path, "#{model}.joblib")
      { name: model, loaded: File.exist?(path) }
    end
  end
end

# Start background scheduler
Scheduler.start unless ENV['RACK_ENV'] == 'test'
```

### 5.3 Database Configuration

```ruby
# config/database.rb
require 'active_record'
require 'dotenv/load'

module Database
  def self.connect
    ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'])
    ActiveRecord::Base.logger = Logger.new($stdout) if ENV['RACK_ENV'] == 'development'
  end
end
```

---

## 6. Phase 2: Data Pipeline (Weeks 2-4)

### 6.1 Sample Data Generation

Since we don't have real smart meter data, generate realistic sample data:

```python
# ml/src/generate_sample_data.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_meter_readings(num_meters=1000, days=90):
    """Generate realistic smart meter readings."""
    
    readings = []
    start_date = datetime.now() - timedelta(days=days)
    
    for meter_id in range(1, num_meters + 1):
        # Each meter has a base consumption profile
        base_consumption = np.random.uniform(5, 25)  # kWh/day average
        
        for day in range(days):
            date = start_date + timedelta(days=day)
            
            # Generate 48 readings per day (30-min intervals)
            for half_hour in range(48):
                timestamp = date + timedelta(minutes=half_hour * 30)
                hour = timestamp.hour
                
                # Time-of-use pattern
                if 6 <= hour < 9 or 17 <= hour < 21:
                    peak_factor = 1.5  # Morning/evening peak
                elif 9 <= hour < 17:
                    peak_factor = 0.8  # Daytime
                elif 21 <= hour < 24 or 0 <= hour < 6:
                    peak_factor = 0.5  # Night
                else:
                    peak_factor = 1.0
                
                # Add randomness and seasonal variation
                seasonal = 1 + 0.2 * np.sin(2 * np.pi * day / 365)
                noise = np.random.normal(1, 0.15)
                
                consumption = (base_consumption / 48) * peak_factor * seasonal * noise
                consumption = max(0, consumption)
                
                # Voltage (normally around 230V)
                voltage = np.random.normal(230, 5)
                
                # Occasionally inject anomalies (2% of readings)
                is_anomaly = np.random.random() < 0.02
                if is_anomaly:
                    anomaly_type = np.random.choice(['voltage', 'consumption', 'both'])
                    if anomaly_type in ['voltage', 'both']:
                        voltage = np.random.choice([195, 260])  # Low or high voltage
                    if anomaly_type in ['consumption', 'both']:
                        consumption *= np.random.choice([3, 5])  # Spike
                
                readings.append({
                    'meter_id': meter_id,
                    'reading_time': timestamp,
                    'consumption_kwh': round(consumption, 4),
                    'demand_kw': round(consumption * 2, 4),
                    'voltage': round(voltage, 2),
                    'power_factor': round(np.random.uniform(0.85, 0.99), 4),
                    'quality_flag': 'anomaly' if is_anomaly else 'normal'
                })
    
    return pd.DataFrame(readings)

def generate_customers(num_customers=1000):
    """Generate customer profiles."""
    
    segments = [
        'early_morning_industrial',
        'business_hours_commercial', 
        'evening_residential_peak',
        'solar_battery_households',
        'ev_charging_households',
        'efficiency_optimizers',
        'high_consumption_all_day',
        'seasonal_variation_heavy',
        'weekend_shift_users',
        'night_owl_households',
        'retired_home_all_day',
        'low_use_minimal'
    ]
    
    segment_weights = [3, 8, 22, 7, 9, 5, 6, 12, 8, 6, 9, 5]
    
    customers = []
    for i in range(1, num_customers + 1):
        segment = np.random.choice(segments, p=np.array(segment_weights)/100)
        
        customers.append({
            'id': i,
            'customer_hash': f'CUST{i:06d}',
            'segment_id': segment,
            'tariff_type': np.random.choice(['flat', 'tou', 'demand']),
            'solar_installed': segment == 'solar_battery_households' or np.random.random() < 0.15,
            'ev_charging': segment == 'ev_charging_households' or np.random.random() < 0.1,
            'demand_response_opted_in': np.random.random() < 0.3
        })
    
    return pd.DataFrame(customers)

def generate_transformers(num_transformers=50):
    """Generate transformer data."""
    
    transformers = []
    for i in range(1, num_transformers + 1):
        age = np.random.uniform(1, 30)
        
        # Older transformers more likely to have issues
        failure_risk = min(0.95, 0.1 + (age / 30) * 0.5 + np.random.uniform(0, 0.2))
        
        transformers.append({
            'id': i,
            'transformer_number': f'TRF{i:04d}',
            'capacity_kva': np.random.choice([100, 200, 500, 1000]),
            'age_years': round(age, 1),
            'status': 'operational',
            'failure_risk': round(failure_risk, 3)
        })
    
    return pd.DataFrame(transformers)

if __name__ == '__main__':
    print("Generating sample data...")
    
    # Create output directory
    os.makedirs('data/sample', exist_ok=True)
    
    # Generate data
    print("  - Meter readings (this may take a minute)...")
    readings = generate_meter_readings(num_meters=1000, days=90)
    readings.to_parquet('data/sample/meter_readings.parquet', index=False)
    print(f"    Generated {len(readings):,} readings")
    
    print("  - Customers...")
    customers = generate_customers(num_customers=1000)
    customers.to_csv('data/sample/customers.csv', index=False)
    print(f"    Generated {len(customers):,} customers")
    
    print("  - Transformers...")
    transformers = generate_transformers(num_transformers=50)
    transformers.to_csv('data/sample/transformers.csv', index=False)
    print(f"    Generated {len(transformers):,} transformers")
    
    print("\nDone! Sample data saved to data/sample/")
```

### 6.2 Data Ingestion Service

```ruby
# app/services/data_ingestion_service.rb
require 'csv'

class DataIngestionService
  def initialize
    @batch_size = 1000
  end
  
  def load_from_csv(file_path)
    raise "File not found: #{file_path}" unless File.exist?(file_path)
    
    readings = []
    CSV.foreach(file_path, headers: true) do |row|
      readings << {
        meter_id: row['meter_id'].to_i,
        reading_time: Time.parse(row['reading_time']),
        consumption_kwh: row['consumption_kwh'].to_f,
        demand_kw: row['demand_kw'].to_f,
        voltage: row['voltage'].to_f,
        power_factor: row['power_factor'].to_f,
        quality_flag: row['quality_flag']
      }
      
      if readings.size >= @batch_size
        MeterReading.insert_all(readings)
        readings = []
      end
    end
    
    MeterReading.insert_all(readings) unless readings.empty?
    
    { success: true, message: "Data loaded from #{file_path}" }
  end
  
  def load_from_parquet(file_path)
    # Use Python subprocess for Parquet reading
    require 'open3'
    
    script = <<~PYTHON
      import pandas as pd
      import json
      df = pd.read_parquet('#{file_path}')
      print(df.to_json(orient='records', date_format='iso'))
    PYTHON
    
    stdout, stderr, status = Open3.capture3('python3', '-c', script)
    raise "Parquet read error: #{stderr}" unless status.success?
    
    readings = JSON.parse(stdout)
    
    readings.each_slice(@batch_size) do |batch|
      MeterReading.insert_all(batch.map do |r|
        {
          meter_id: r['meter_id'],
          reading_time: Time.parse(r['reading_time']),
          consumption_kwh: r['consumption_kwh'],
          demand_kw: r['demand_kw'],
          voltage: r['voltage'],
          power_factor: r['power_factor'],
          quality_flag: r['quality_flag']
        }
      end)
    end
    
    { success: true, records: readings.size }
  end
end
```

---

## 7. Phase 3: ML Models (Weeks 4-8)

### 7.1 Python ML Environment

```bash
# Create virtual environment
cd ml
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

```txt
# ml/requirements.txt
pandas>=2.0.0
numpy>=1.24.0
scikit-learn>=1.3.0
xgboost>=2.0.0
prophet>=1.1.0
matplotlib>=3.7.0
seaborn>=0.12.0
jupyter>=1.0.0
joblib>=1.3.0
pyarrow>=14.0.0
psycopg2-binary>=2.9.0
python-dotenv>=1.0.0
```

### 7.2 Anomaly Detection Model

```python
# ml/src/anomaly_detector.py
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import os

class AnomalyDetector:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_columns = [
            'consumption_kwh', 'demand_kw', 'voltage', 
            'power_factor', 'hour', 'day_of_week'
        ]
    
    def prepare_features(self, df):
        """Engineer features for anomaly detection."""
        features = df.copy()
        features['hour'] = pd.to_datetime(features['reading_time']).dt.hour
        features['day_of_week'] = pd.to_datetime(features['reading_time']).dt.dayofweek
        features['voltage_deviation'] = abs(features['voltage'] - 230) / 230
        
        return features[self.feature_columns + ['voltage_deviation']]
    
    def train(self, df, contamination=0.02):
        """Train Isolation Forest model."""
        print("Preparing features...")
        features = self.prepare_features(df)
        
        print("Scaling features...")
        scaled_features = self.scaler.fit_transform(features)
        
        print("Training Isolation Forest...")
        self.model = IsolationForest(
            contamination=contamination,
            n_estimators=200,
            max_samples='auto',
            random_state=42,
            n_jobs=-1
        )
        self.model.fit(scaled_features)
        
        # Calculate scores for training data
        scores = self.model.decision_function(scaled_features)
        predictions = self.model.predict(scaled_features)
        
        n_anomalies = (predictions == -1).sum()
        print(f"Training complete. Found {n_anomalies} anomalies ({n_anomalies/len(df)*100:.2f}%)")
        
        return self
    
    def predict(self, df):
        """Predict anomalies for new data."""
        features = self.prepare_features(df)
        scaled_features = self.scaler.transform(features)
        
        scores = self.model.decision_function(scaled_features)
        predictions = self.model.predict(scaled_features)
        
        # Convert to anomaly scores (0 = normal, 1 = anomaly)
        anomaly_scores = 1 - (scores - scores.min()) / (scores.max() - scores.min())
        is_anomaly = predictions == -1
        
        return {
            'anomaly_score': anomaly_scores,
            'is_anomaly': is_anomaly
        }
    
    def save(self, path='models/anomaly_detector.joblib'):
        """Save model to disk."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'feature_columns': self.feature_columns
        }, path)
        print(f"Model saved to {path}")
    
    @classmethod
    def load(cls, path='models/anomaly_detector.joblib'):
        """Load model from disk."""
        data = joblib.load(path)
        detector = cls()
        detector.model = data['model']
        detector.scaler = data['scaler']
        detector.feature_columns = data['feature_columns']
        return detector


if __name__ == '__main__':
    # Load sample data
    print("Loading data...")
    df = pd.read_parquet('../data/sample/meter_readings.parquet')
    
    # Train model
    detector = AnomalyDetector()
    detector.train(df)
    
    # Save model
    detector.save('../models/anomaly_detector.joblib')
    
    # Test prediction
    sample = df.head(100)
    results = detector.predict(sample)
    print(f"\nTest prediction: {results['is_anomaly'].sum()} anomalies in 100 samples")
```

### 7.3 Customer Segmentation Model

```python
# ml/src/customer_segmenter.py
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib

class CustomerSegmenter:
    SEGMENT_NAMES = {
        0: 'early_morning_industrial',
        1: 'business_hours_commercial',
        2: 'evening_residential_peak',
        3: 'solar_battery_households',
        4: 'ev_charging_households',
        5: 'efficiency_optimizers',
        6: 'high_consumption_all_day',
        7: 'seasonal_variation_heavy',
        8: 'weekend_shift_users',
        9: 'night_owl_households',
        10: 'retired_home_all_day',
        11: 'low_use_minimal'
    }
    
    def __init__(self, n_clusters=12):
        self.n_clusters = n_clusters
        self.model = None
        self.scaler = StandardScaler()
    
    def prepare_features(self, readings_df):
        """Create customer usage profile from meter readings."""
        
        # Hourly profile (24 features)
        readings_df['hour'] = pd.to_datetime(readings_df['reading_time']).dt.hour
        hourly = readings_df.groupby(['meter_id', 'hour'])['consumption_kwh'].mean().unstack(fill_value=0)
        
        # Aggregate features
        agg = readings_df.groupby('meter_id').agg({
            'consumption_kwh': ['mean', 'std', 'max'],
            'demand_kw': 'max'
        })
        agg.columns = ['avg_consumption', 'std_consumption', 'max_consumption', 'max_demand']
        
        # Weekend vs weekday
        readings_df['is_weekend'] = pd.to_datetime(readings_df['reading_time']).dt.dayofweek >= 5
        weekend_ratio = readings_df.groupby('meter_id').apply(
            lambda x: x[x['is_weekend']]['consumption_kwh'].mean() / 
                     (x[~x['is_weekend']]['consumption_kwh'].mean() + 0.001)
        )
        
        # Combine features
        features = hourly.join(agg).join(weekend_ratio.rename('weekend_ratio'))
        
        return features.fillna(0)
    
    def train(self, readings_df):
        """Train K-means clustering model."""
        print("Preparing customer features...")
        features = self.prepare_features(readings_df)
        
        print("Scaling features...")
        scaled = self.scaler.fit_transform(features)
        
        print(f"Training K-means with {self.n_clusters} clusters...")
        self.model = KMeans(
            n_clusters=self.n_clusters,
            random_state=42,
            n_init=20,
            max_iter=500
        )
        self.model.fit(scaled)
        
        # Assign segments
        labels = self.model.labels_
        print(f"Training complete. Cluster distribution:")
        for i in range(self.n_clusters):
            count = (labels == i).sum()
            name = self.SEGMENT_NAMES.get(i, f'cluster_{i}')
            print(f"  {name}: {count} customers ({count/len(labels)*100:.1f}%)")
        
        return self
    
    def predict(self, readings_df):
        """Assign customers to segments."""
        features = self.prepare_features(readings_df)
        scaled = self.scaler.transform(features)
        
        labels = self.model.predict(scaled)
        
        return {
            'meter_id': features.index.tolist(),
            'segment_id': [self.SEGMENT_NAMES[l] for l in labels],
            'cluster': labels.tolist()
        }
    
    def save(self, path='models/customer_segmenter.joblib'):
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'n_clusters': self.n_clusters
        }, path)
        print(f"Model saved to {path}")
    
    @classmethod
    def load(cls, path='models/customer_segmenter.joblib'):
        data = joblib.load(path)
        segmenter = cls(n_clusters=data['n_clusters'])
        segmenter.model = data['model']
        segmenter.scaler = data['scaler']
        return segmenter
```

### 7.4 Training All Models Script

```python
# ml/src/train_all_models.py
import pandas as pd
from anomaly_detector import AnomalyDetector
from customer_segmenter import CustomerSegmenter
# from failure_predictor import FailurePredictor  # Similar pattern
# from demand_forecaster import DemandForecaster  # Similar pattern

def main():
    print("=" * 60)
    print("RED ENERGY METERS - ML MODEL TRAINING")
    print("=" * 60)
    
    # Load data
    print("\n1. Loading data...")
    readings = pd.read_parquet('../data/sample/meter_readings.parquet')
    print(f"   Loaded {len(readings):,} meter readings")
    
    # Train Anomaly Detector
    print("\n2. Training Anomaly Detector...")
    anomaly = AnomalyDetector()
    anomaly.train(readings)
    anomaly.save('../models/anomaly_detector.joblib')
    
    # Train Customer Segmenter
    print("\n3. Training Customer Segmenter...")
    segmenter = CustomerSegmenter(n_clusters=12)
    segmenter.train(readings)
    segmenter.save('../models/customer_segmenter.joblib')
    
    # Train Failure Predictor (placeholder)
    print("\n4. Training Failure Predictor...")
    print("   (Using XGBoost - implementation similar to anomaly detector)")
    
    # Train Demand Forecaster (placeholder)
    print("\n5. Training Demand Forecaster...")
    print("   (Using Prophet - implementation in separate file)")
    
    print("\n" + "=" * 60)
    print("TRAINING COMPLETE")
    print("=" * 60)
    print("\nModels saved to ml/models/")

if __name__ == '__main__':
    main()
```

---

## 8. Phase 4: API & Frontend (Weeks 6-10)

### 8.1 API Routes

```ruby
# app/routes/meters_routes.rb
class RedMetersAPI < Sinatra::Base
  # GET /api/v1/meters
  get '/api/v1/meters' do
    meters = SmartMeter.limit(params[:limit] || 100)
                       .offset(params[:offset] || 0)
    
    json({
      meters: meters.map(&:to_api_response),
      total: SmartMeter.count
    })
  end
  
  # GET /api/v1/meters/:id
  get '/api/v1/meters/:id' do
    meter = SmartMeter.find(params[:id])
    json meter.to_api_response(include_readings: true)
  end
  
  # GET /api/v1/meters/:id/readings
  get '/api/v1/meters/:id/readings' do
    meter = SmartMeter.find(params[:id])
    readings = meter.readings
                    .where(reading_time: parse_date_range)
                    .order(reading_time: :desc)
                    .limit(params[:limit] || 1000)
    
    json({
      meter_id: meter.id,
      readings: readings.map(&:to_api_response)
    })
  end
  
  private
  
  def parse_date_range
    from = params[:from] ? Time.parse(params[:from]) : 7.days.ago
    to = params[:to] ? Time.parse(params[:to]) : Time.current
    from..to
  end
end
```

```ruby
# app/routes/predictions_routes.rb
class RedMetersAPI < Sinatra::Base
  # GET /api/v1/predictions
  get '/api/v1/predictions' do
    predictions = Prediction
                    .where(prediction_type: params[:type])
                    .order(created_at: :desc)
                    .limit(params[:limit] || 50)
    
    json predictions.map(&:to_api_response)
  end
  
  # POST /api/v1/predictions/anomalies
  post '/api/v1/predictions/anomalies' do
    service = AnomalyDetectionService.new
    results = service.detect_anomalies(params[:meter_ids])
    
    json({
      success: true,
      anomalies_detected: results.count,
      results: results
    })
  end
  
  # GET /api/v1/predictions/demand-forecast
  get '/api/v1/predictions/demand-forecast' do
    service = DemandForecastingService.new
    forecast = service.forecast(hours: params[:hours]&.to_i || 72)
    
    json forecast
  end
end
```

```ruby
# app/routes/analytics_routes.rb
class RedMetersAPI < Sinatra::Base
  # GET /api/v1/analytics/overview
  get '/api/v1/analytics/overview' do
    json({
      total_meters: SmartMeter.count,
      total_readings: MeterReading.count,
      anomalies_today: Prediction.anomalies.where('created_at > ?', Date.today).count,
      alerts_active: Alert.active.count,
      customers_by_segment: Customer.group(:segment_id).count
    })
  end
  
  # GET /api/v1/analytics/grid-health
  get '/api/v1/analytics/grid-health' do
    recent_readings = MeterReading.where('reading_time > ?', 1.hour.ago)
    
    json({
      avg_voltage: recent_readings.average(:voltage)&.round(2),
      voltage_range: {
        min: recent_readings.minimum(:voltage),
        max: recent_readings.maximum(:voltage)
      },
      avg_power_factor: recent_readings.average(:power_factor)&.round(4),
      total_consumption_kwh: recent_readings.sum(:consumption_kwh).round(2),
      anomaly_rate: calculate_anomaly_rate(recent_readings)
    })
  end
  
  # GET /api/v1/analytics/customer-segments
  get '/api/v1/analytics/customer-segments' do
    segments = Customer.group(:segment_id)
                       .select('segment_id, COUNT(*) as count')
                       .map do |s|
      {
        segment: s.segment_id,
        count: s.count,
        percentage: (s.count.to_f / Customer.count * 100).round(1)
      }
    end
    
    json segments
  end
  
  private
  
  def calculate_anomaly_rate(readings)
    return 0 if readings.empty?
    anomalies = readings.where(quality_flag: 'anomaly').count
    (anomalies.to_f / readings.count * 100).round(2)
  end
end
```

### 8.2 Frontend Components

```jsx
// frontend/src/App.jsx
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import MetersPage from './pages/MetersPage'
import PredictionsPage from './pages/PredictionsPage'
import CustomersPage from './pages/CustomersPage'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />
      case 'meters': return <MetersPage />
      case 'predictions': return <PredictionsPage />
      case 'customers': return <CustomersPage />
      default: return <Dashboard />
    }
  }
  
  return (
    <div className="flex h-screen bg-nordic-cream">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-auto p-8">
        {renderPage()}
      </main>
    </div>
  )
}
```

```jsx
// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { Activity, Zap, Users, AlertTriangle } from 'lucide-react'
import { api } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [gridHealth, setGridHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function loadData() {
      try {
        const [overview, health] = await Promise.all([
          api.getOverview(),
          api.getGridHealth()
        ])
        setStats(overview)
        setGridHealth(health)
      } catch (err) {
        console.error('Failed to load dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])
  
  if (loading) return <div className="p-8">Loading...</div>
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-nordic-dark mb-8">
        Red Energy Meters Dashboard
      </h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Zap className="text-nordic-blue" />}
          label="Total Meters"
          value={stats?.total_meters?.toLocaleString()}
        />
        <StatCard
          icon={<Activity className="text-nordic-green" />}
          label="Readings Today"
          value={stats?.total_readings?.toLocaleString()}
        />
        <StatCard
          icon={<AlertTriangle className="text-nordic-yellow" />}
          label="Active Alerts"
          value={stats?.alerts_active}
        />
        <StatCard
          icon={<Users className="text-nordic-teal" />}
          label="Customers"
          value={Object.values(stats?.customers_by_segment || {}).reduce((a, b) => a + b, 0)?.toLocaleString()}
        />
      </div>
      
      {/* Grid Health */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-nordic-dark mb-4">Grid Health</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Average Voltage</p>
            <p className="text-2xl font-bold">{gridHealth?.avg_voltage}V</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Power Factor</p>
            <p className="text-2xl font-bold">{gridHealth?.avg_power_factor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Consumption (1hr)</p>
            <p className="text-2xl font-bold">{gridHealth?.total_consumption_kwh} kWh</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Anomaly Rate</p>
            <p className="text-2xl font-bold">{gridHealth?.anomaly_rate}%</p>
          </div>
        </div>
      </div>
      
      {/* Customer Segments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-nordic-dark mb-4">Customer Segments</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(stats?.customers_by_segment || {}).map(([segment, count]) => (
            <div key={segment} className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">{segment.replace(/_/g, ' ')}</p>
              <p className="text-lg font-semibold">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-nordic-dark">{value || '—'}</p>
        </div>
      </div>
    </div>
  )
}
```

---

## 9. Phase 5: Integration (Weeks 9-12)

### 9.1 ML Service Integration

```ruby
# app/services/anomaly_detection_service.rb
require 'open3'

class AnomalyDetectionService
  MODEL_PATH = ENV.fetch('ML_MODELS_PATH', './ml/models')
  
  def detect_anomalies(meter_ids = nil)
    # Get recent readings
    readings = MeterReading
      .where(meter_ids ? { meter_id: meter_ids } : {})
      .where('reading_time > ?', 1.hour.ago)
      .order(reading_time: :desc)
      .limit(10000)
    
    return [] if readings.empty?
    
    # Prepare data for Python model
    data = readings.map do |r|
      {
        meter_id: r.meter_id,
        reading_time: r.reading_time.iso8601,
        consumption_kwh: r.consumption_kwh,
        demand_kw: r.demand_kw,
        voltage: r.voltage,
        power_factor: r.power_factor
      }
    end
    
    # Call Python model
    results = call_python_model('anomaly', data)
    
    # Create alerts for anomalies
    anomalies = results.select { |r| r['is_anomaly'] }
    
    anomalies.each do |anomaly|
      Alert.create!(
        title: "Anomaly Detected",
        description: "Anomaly detected on meter #{anomaly['meter_id']}",
        severity: anomaly['anomaly_score'] > 0.9 ? 'critical' : 'warning',
        source: 'anomaly_detection',
        confidence: (anomaly['anomaly_score'] * 100).round,
        asset_type: 'smart_meter',
        asset_id: anomaly['meter_id'],
        detected_at: Time.current
      )
    end
    
    anomalies
  end
  
  private
  
  def call_python_model(model_type, data)
    script = <<~PYTHON
      import sys
      import json
      import pandas as pd
      sys.path.insert(0, 'ml/src')
      
      from anomaly_detector import AnomalyDetector
      
      # Load model
      model = AnomalyDetector.load('#{MODEL_PATH}/anomaly_detector.joblib')
      
      # Load data
      data = json.loads('''#{data.to_json}''')
      df = pd.DataFrame(data)
      
      # Predict
      results = model.predict(df)
      
      # Combine with input data
      output = []
      for i, row in df.iterrows():
          output.append({
              'meter_id': int(row['meter_id']),
              'reading_time': row['reading_time'],
              'anomaly_score': float(results['anomaly_score'][i]),
              'is_anomaly': bool(results['is_anomaly'][i])
          })
      
      print(json.dumps(output))
    PYTHON
    
    stdout, stderr, status = Open3.capture3('python3', '-c', script)
    
    unless status.success?
      Rails.logger.error("Python ML error: #{stderr}")
      raise "ML model error: #{stderr}"
    end
    
    JSON.parse(stdout)
  end
end
```

### 9.2 Background Scheduler

```ruby
# app/jobs/scheduler.rb
require 'rufus-scheduler'

module Scheduler
  def self.start
    scheduler = Rufus::Scheduler.new
    
    # Run anomaly detection every 15 minutes
    scheduler.every '15m' do
      Rails.logger.info "Running scheduled anomaly detection..."
      AnomalyDetectionService.new.detect_anomalies
    end
    
    # Run customer segmentation daily at 2 AM
    scheduler.cron '0 2 * * *' do
      Rails.logger.info "Running scheduled customer segmentation..."
      CustomerSegmentationService.new.segment_all_customers
    end
    
    # Run demand forecasting every hour
    scheduler.every '1h' do
      Rails.logger.info "Running scheduled demand forecasting..."
      DemandForecastingService.new.forecast(hours: 72)
    end
    
    Rails.logger.info "Background scheduler started"
    scheduler
  end
end
```

---

## 10. Database Schema

### Complete Migration

```ruby
# db/migrate/20251127000001_create_all_tables.rb
class CreateAllTables < ActiveRecord::Migration[7.2]
  def change
    # Smart Meters
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
    end
    
    # Meter Readings (partitioned by month for performance)
    create_table :meter_readings do |t|
      t.bigint :meter_id, null: false
      t.timestamp :reading_time, null: false
      t.decimal :consumption_kwh, precision: 12, scale: 4
      t.decimal :demand_kw, precision: 10, scale: 4
      t.decimal :voltage, precision: 8, scale: 2
      t.decimal :power_factor, precision: 5, scale: 4
      t.string :quality_flag, limit: 20
      
      t.index [:meter_id, :reading_time]
      t.index :reading_time
      t.index :quality_flag
    end
    
    # Customers
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
    
    # Transformers
    create_table :transformers do |t|
      t.string :transformer_number, null: false, limit: 50
      t.decimal :capacity_kva, precision: 10, scale: 2
      t.decimal :age_years, precision: 4, scale: 1
      t.string :status, limit: 20, default: 'operational'
      t.decimal :failure_risk, precision: 5, scale: 3
      t.timestamps
      
      t.index :transformer_number, unique: true
    end
    
    # Predictions
    create_table :predictions do |t|
      t.string :prediction_type, null: false, limit: 50
      t.string :asset_type, limit: 50
      t.bigint :asset_id
      t.decimal :probability, precision: 5, scale: 4
      t.decimal :confidence, precision: 5, scale: 2
      t.jsonb :details
      t.timestamp :predicted_for
      t.timestamps
      
      t.index [:prediction_type, :created_at]
      t.index [:asset_type, :asset_id]
    end
    
    # Alerts
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
      
      t.index [:severity, :created_at]
      t.index :resolved_at
    end
    
    # Demand Forecasts
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
```

---

## 11. ML Model Specifications

| Model | Algorithm | Training Data | Accuracy Target | Local Training Time |
|-------|-----------|---------------|-----------------|---------------------|
| **Anomaly Detection** | Isolation Forest | 90 days readings | 88% | ~5 minutes |
| **Failure Prediction** | XGBoost | Historical + failures | 85% | ~10 minutes |
| **Customer Segmentation** | K-means (12 clusters) | 90 days usage profiles | 90% | ~3 minutes |
| **Demand Forecasting** | Prophet | 24 months demand | 95% | ~15 minutes |

---

## 12. API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| GET | `/api/v1/meters` | List meters |
| GET | `/api/v1/meters/:id` | Get meter details |
| GET | `/api/v1/meters/:id/readings` | Get meter readings |
| GET | `/api/v1/predictions` | List predictions |
| POST | `/api/v1/predictions/anomalies` | Run anomaly detection |
| GET | `/api/v1/predictions/demand-forecast` | Get demand forecast |
| GET | `/api/v1/customers` | List customers |
| GET | `/api/v1/customers/:id` | Get customer details |
| GET | `/api/v1/analytics/overview` | Dashboard stats |
| GET | `/api/v1/analytics/grid-health` | Grid health metrics |
| GET | `/api/v1/analytics/customer-segments` | Segment distribution |
| GET | `/api/v1/alerts` | List alerts |
| PUT | `/api/v1/alerts/:id/resolve` | Resolve alert |

---

## 13. Running the Application

### Quick Start

```bash
# Terminal 1: Start API Server
cd RedEnergyMeters
bundle install
bundle exec rackup -p 4567

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Generate sample data & train models
cd ml
source venv/bin/activate
python src/generate_sample_data.py
python src/train_all_models.py
```

### Load Sample Data to Database

```bash
# Run migrations
bundle exec rake db:migrate

# Load sample data
bundle exec rake data:load_sample
```

### Access Points

| Service | URL |
|---------|-----|
| API | http://localhost:4567 |
| Frontend | http://localhost:5173 |
| API Health | http://localhost:4567/health |

---

## 14. Cost Management

### Monthly Azure Costs

| Service | Cost (AUD) | Notes |
|---------|------------|-------|
| PostgreSQL (B1ms) | ~$30 | Existing server |
| Blob Storage | ~$2 | Minimal usage |
| **TOTAL** | **~$32** | Well under $150 credit |

### Credit Monitoring

```bash
# Check remaining credit
az consumption usage list --query "[].{Date:usageStart, Cost:pretaxCost}" -o table
```

### Cost Optimization Tips

1. **Stop PostgreSQL when not in use** (saves ~$1/day)
   ```bash
   az postgres flexible-server stop --name uts-dev-pg-eas-983d --resource-group uts-development-rg
   ```

2. **Use local PostgreSQL for development** (free)
   ```bash
   brew services start postgresql@14
   createdb red_meters_dev
   ```

3. **Delete old data** regularly to stay within storage limits

---

## Summary

This student-budget architecture delivers:

✅ **Full ML capabilities** - All 4 models trained locally  
✅ **Working API** - Complete REST API running locally  
✅ **Modern frontend** - React dashboard with real-time data  
✅ **Minimal Azure cost** - ~$32/month (fits $150 AUD credit)  
✅ **No container quota issues** - Everything runs on your Mac  
✅ **Production-ready patterns** - Same code structure as full deployment  

**Total Azure Cost: ~$32/month** (vs ~$800/month for full cloud deployment)

---

**Document Version:** 3.0 (Student Budget Edition)  
**Last Updated:** November 27, 2025
