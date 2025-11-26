# Red Energy Smart Meter Analytics Platform
## Implementation Plan

**Project:** Electric Meter Data Processing & ML Analytics  
**Version:** 2.0  
**Date:** November 26, 2025  
**Owner:** Kyndryl Agentic AI Platform Team

---

## Executive Summary

This implementation plan details the build-out of Red Energy's Smart Meter Analytics Platform - a **traditional machine learning** system that transforms raw electricity consumption data from 1.2 million customers into actionable business intelligence.

### Business Outcomes
- **$23.84M** net annual benefit
- **627%** ROI with 1.8-month payback
- **70%** reduction in unplanned outages
- **25%** customer engagement (vs 2% baseline)
- **15%** peak demand reduction

### Three Core Workflows
1. **Observability Platform** - Real-time grid monitoring with Grafana dashboards
2. **Predictive Maintenance AI** - 48-72 hour early warning for equipment failures
3. **Customer Intelligence AI** - Segmentation, recommendations, and demand forecasting

### ML Approach
This is a **traditional ML project** using proven algorithms:
- Isolation Forest & LSTM for anomaly detection
- Gradient Boosting for failure prediction
- K-means clustering for customer segmentation
- Prophet + Neural Networks for demand forecasting

**No RAG or LLM services required** - this is numerical/time-series ML, not natural language processing.

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Azure Services Required](#2-azure-services-required)
3. [Project Timeline](#3-project-timeline)
4. [Phase 1: Foundation Infrastructure](#4-phase-1-foundation-infrastructure-weeks-1-4)
5. [Phase 2: Data Pipeline & Ingestion](#5-phase-2-data-pipeline--ingestion-weeks-3-6)
6. [Phase 3: Observability Platform](#6-phase-3-observability-platform-weeks-4-7)
7. [Phase 4: Predictive Maintenance ML](#7-phase-4-predictive-maintenance-ml-weeks-5-10)
8. [Phase 5: Customer Intelligence ML](#8-phase-5-customer-intelligence-ml-weeks-8-14)
9. [Phase 6: Integration & Testing](#9-phase-6-integration--testing-weeks-12-16)
10. [Phase 7: Production Deployment](#10-phase-7-production-deployment-weeks-15-18)
11. [Database Architecture](#11-database-architecture)
12. [API Design](#12-api-design)
13. [ML Model Specifications](#13-ml-model-specifications)
14. [Security & Compliance](#14-security--compliance)
15. [Cost Estimates](#15-cost-estimates)
16. [Success Criteria](#16-success-criteria)

---

## 1. Technology Stack

### Backend (Following PRINCIPLES.md)

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Sinatra | 4.0+ | Lightweight API framework |
| **ORM** | ActiveRecord | 7.2+ | Database abstraction |
| **Web Server** | Puma | 6.4+ | Multi-threaded Ruby server |
| **Background Jobs** | Sidekiq + Redis | 7.3+ | Async ML job processing |
| **HTTP Client** | HTTParty | 0.22+ | External API calls |
| **ML Client** | azure_mgmt_machinelearning | Latest | Azure ML integration |

### Frontend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | React | 19.0+ | UI components |
| **Build Tool** | Vite | 6.0+ | Fast dev/build |
| **Styling** | Tailwind CSS | 3.4+ | Nordic/Scandinavian palette |
| **Icons** | Lucide React | 0.460+ | Consistent iconography |
| **Charts** | Recharts | 2.12+ | Data visualization |
| **Real-time** | Socket.io | 4.7+ | Live data streams |

### Database & Storage

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Primary Database** | Azure PostgreSQL 14+ | Relational data |
| **Time-Series Extension** | TimescaleDB | Optimized meter data storage |
| **Cache/Queue** | Azure Redis | Real-time data, job queues |
| **Data Lake** | Azure Blob Storage | Raw data, model artifacts |

### ML Platform

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Training** | Azure Machine Learning | Model training & experimentation |
| **Inference** | Azure ML Managed Endpoints | Real-time predictions |
| **Frameworks** | scikit-learn, PyTorch, Prophet | ML algorithms |

### External Integrations

| System | Purpose | Protocol |
|--------|---------|----------|
| **Grafana** | Data visualization | REST API / Prometheus |
| **IBM Bridge** | Enterprise correlation | REST API |
| **Smart Meters** | 1.2M data sources | MQTT / REST |
| **AEMO** | Regulatory reporting | REST API |
| **ServiceNow** | Incident management | REST API |
| **Teams** | Alert notifications | Webhooks |

---

## 2. Azure Services Required

### Core Infrastructure

| Service | SKU | Purpose | Monthly Cost (AUD) |
|---------|-----|---------|-------------------|
| **Azure Container Apps** | Consumption | API + worker hosting | $150 |
| **Azure Database for PostgreSQL** | D4s Flexible | Time-series data, customer profiles | $350 |
| **Azure Cache for Redis** | Standard C1 | Real-time metrics, Sidekiq queue | $100 |
| **Azure Blob Storage** | Standard GRS | Data lake, model artifacts | $50 |
| **Azure Container Registry** | Basic | Docker images for CI/CD | $7 |

### Data Ingestion

| Service | SKU | Purpose | Monthly Cost (AUD) |
|---------|-----|---------|-------------------|
| **Azure Event Hubs** | Standard (1 TU) | Ingest 10K+ events/sec | $30 |
| **Azure Stream Analytics** | 1 Streaming Unit | Real-time validation & aggregation | $120 |

### Machine Learning

| Service | SKU | Purpose | Monthly Cost (AUD) |
|---------|-----|---------|-------------------|
| **Azure Machine Learning** | Pay-as-you-go | Model training & deployment | $400 |
| **Azure ML Compute** | Standard_DS3_v2 | Training clusters | Included above |
| **Azure ML Managed Endpoints** | Standard | Real-time inference | Included above |

### Monitoring & Security

| Service | SKU | Purpose | Monthly Cost (AUD) |
|---------|-----|---------|-------------------|
| **Azure Key Vault** | Standard | Secrets management | $5 |
| **Azure Monitor** | Pay-as-you-go | Infrastructure metrics | $50 |
| **Application Insights** | Pay-as-you-go | APM & logging | $50 |
| **Log Analytics** | Pay-as-you-go | Centralized logs | $30 |

### Networking

| Service | Purpose | Monthly Cost (AUD) |
|---------|---------|-------------------|
| **Azure Virtual Network** | Network isolation | Free |
| **Private Endpoints** | Secure DB access | $10 |

### **Total Monthly Cost: ~$1,350 AUD**

### Services NOT Required

| Service | Why NOT Needed |
|---------|----------------|
| ~~Azure OpenAI~~ | No NLP/LLM - this is numerical ML |
| ~~Azure AI Search~~ | No vector search - this is traditional ML |
| ~~Azure Cognitive Services~~ | No text/image processing |

---

## 3. Project Timeline

```
Week:  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18
       ├──┴──┴──┴──┤                                          Phase 1: Foundation
          ├──┴──┴──┴──┤                                       Phase 2: Data Pipeline
             ├──┴──┴──┴──┤                                    Phase 3: Observability
                ├──┴──┴──┴──┴──┴──┤                           Phase 4: Predictive ML
                      ├──┴──┴──┴──┴──┴──┴──┤                  Phase 5: Customer ML
                               ├──┴──┴──┴──┴──┤               Phase 6: Integration
                                        ├──┴──┴──┴──┤         Phase 7: Production
```

| Phase | Description | Weeks | Key Deliverables |
|-------|-------------|-------|------------------|
| **1** | Foundation Infrastructure | 1-4 | Azure resources, database, CI/CD |
| **2** | Data Pipeline & Ingestion | 3-6 | Event Hubs, Stream Analytics, TimescaleDB |
| **3** | Observability Platform | 4-7 | Grafana dashboards, alerting |
| **4** | Predictive Maintenance ML | 5-10 | Anomaly detection, failure prediction |
| **5** | Customer Intelligence ML | 8-14 | Segmentation, forecasting, recommendations |
| **6** | Integration & Testing | 12-16 | End-to-end testing, 80%+ coverage |
| **7** | Production Deployment | 15-18 | Shadow mode, pilot, full rollout |

---

## 4. Phase 1: Foundation Infrastructure (Weeks 1-4)

### 4.1 Week 1: Azure Landing Zone

#### Tasks
- [ ] Create Azure subscription and resource group
- [ ] Deploy Virtual Network with subnets
- [ ] Configure Azure Key Vault
- [ ] Set up Azure Container Registry
- [ ] Deploy Log Analytics workspace

#### Azure Resource Naming Convention

```
Pattern: {resource}-redenergy-meters-{env}

Examples:
- rg-redenergy-meters-dev           # Resource Group
- vnet-redenergy-meters-dev         # Virtual Network
- psql-redenergy-meters-dev         # PostgreSQL
- acr-redenergymetersdev            # Container Registry (no hyphens)
- kv-redenergy-meters-dev           # Key Vault
- aml-redenergy-meters-dev          # Azure ML Workspace
```

#### Infrastructure as Code (Bicep)

```
infrastructure/
├── main.bicep
├── modules/
│   ├── networking.bicep       # VNet, subnets, NSGs
│   ├── database.bicep         # PostgreSQL Flexible Server
│   ├── compute.bicep          # Container Apps Environment
│   ├── storage.bicep          # Blob Storage
│   ├── ml.bicep               # Azure ML Workspace
│   ├── streaming.bicep        # Event Hubs, Stream Analytics
│   ├── monitoring.bicep       # Log Analytics, App Insights
│   └── security.bicep         # Key Vault
├── parameters.dev.json
├── parameters.prod.json
└── deploy.rb
```

### 4.2 Week 2: Database Infrastructure

#### PostgreSQL with TimescaleDB

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS timescaledb;     -- Time-series optimization
CREATE EXTENSION IF NOT EXISTS pg_trgm;         -- Text search

-- Schema organization
CREATE SCHEMA meters;        -- Smart meter data
CREATE SCHEMA customers;     -- Customer profiles
CREATE SCHEMA grid;          -- Grid infrastructure
CREATE SCHEMA ml;            -- ML predictions
CREATE SCHEMA audit;         -- Audit trails
```

#### Core Tables

```ruby
# db/migrate/20251126000001_create_meter_readings.rb
class CreateMeterReadings < ActiveRecord::Migration[7.2]
  def change
    create_table :meter_readings, id: false do |t|
      t.bigint :meter_id, null: false
      t.timestamp :reading_time, null: false
      t.decimal :consumption_kwh, precision: 12, scale: 4
      t.decimal :demand_kw, precision: 10, scale: 4
      t.decimal :voltage, precision: 8, scale: 2
      t.decimal :current_amps, precision: 8, scale: 2
      t.decimal :power_factor, precision: 5, scale: 4
      t.string :quality_flag, limit: 10
    end
    
    # Convert to TimescaleDB hypertable
    execute <<-SQL
      SELECT create_hypertable('meter_readings', 'reading_time',
        chunk_time_interval => INTERVAL '1 day'
      );
    SQL
    
    add_index :meter_readings, [:meter_id, :reading_time], unique: true
  end
end
```

### 4.3 Week 3: Application Foundation

#### Project Structure

```
RedEnergyMeters/
├── app/
│   ├── models/
│   │   ├── application_record.rb
│   │   ├── concerns/
│   │   │   ├── auditable.rb
│   │   │   └── predictable.rb
│   │   ├── smart_meter.rb
│   │   ├── meter_reading.rb
│   │   ├── customer.rb
│   │   ├── transformer.rb
│   │   ├── prediction.rb
│   │   └── alert.rb
│   ├── routes/                    # LEAN: 5-10 lines per endpoint
│   │   ├── meters_routes.rb
│   │   ├── predictions_routes.rb
│   │   ├── alerts_routes.rb
│   │   └── analytics_routes.rb
│   ├── services/
│   │   ├── ml_service_factory.rb  # Factory for ML services
│   │   ├── meter_ingestion_service.rb
│   │   ├── anomaly_detection_service.rb
│   │   ├── failure_prediction_service.rb
│   │   ├── customer_segmentation_service.rb
│   │   ├── demand_forecasting_service.rb
│   │   └── alert_service.rb
│   └── jobs/
│       ├── ingest_meter_data_job.rb
│       ├── run_predictions_job.rb
│       └── send_alerts_job.rb
├── config/
│   ├── database.rb
│   ├── sidekiq.yml
│   └── ml_models.yml
├── db/
│   └── migrate/
├── frontend/
├── infrastructure/
├── ml/                            # ML training code
│   ├── notebooks/
│   │   ├── 01_anomaly_detection.ipynb
│   │   ├── 02_failure_prediction.ipynb
│   │   ├── 03_customer_segmentation.ipynb
│   │   └── 04_demand_forecasting.ipynb
│   ├── src/
│   │   ├── train_anomaly_model.py
│   │   ├── train_failure_model.py
│   │   ├── train_segmentation_model.py
│   │   └── train_forecasting_model.py
│   └── requirements.txt
├── test/
│   └── results/                   # MANDATORY: Save all test results
├── app.rb
├── Gemfile
└── Dockerfile.api
```

#### ML Service Factory (Following PRINCIPLES.md)

```ruby
# app/services/ml_service_factory.rb
class MlServiceFactory
  class << self
    # MANDATORY: Always use factory methods
    
    def anomaly_detector
      mode = EnvironmentMode.current_mode
      
      case mode
      when :sandbox then Sandbox::MockAnomalyDetector.new
      when :simulation then Simulation::MockAnomalyDetector.new
      when :production then Production::AzureMLAnomalyDetector.new
      end
    end
    
    def failure_predictor
      mode = EnvironmentMode.current_mode
      
      case mode
      when :sandbox then Sandbox::MockFailurePredictor.new
      when :simulation then Simulation::MockFailurePredictor.new
      when :production then Production::AzureMLFailurePredictor.new
      end
    end
    
    def customer_segmenter
      mode = EnvironmentMode.current_mode
      
      case mode
      when :sandbox then Sandbox::MockSegmenter.new
      when :simulation then Simulation::MockSegmenter.new
      when :production then Production::AzureMLSegmenter.new
      end
    end
    
    def demand_forecaster
      mode = EnvironmentMode.current_mode
      
      case mode
      when :sandbox then Sandbox::MockForecaster.new
      when :simulation then Simulation::MockForecaster.new
      when :production then Production::AzureMLForecaster.new
      end
    end
  end
end
```

### 4.4 Week 4: CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Red Energy Meters Platform

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: timescale/timescaledb:latest-pg14
        env:
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
      - name: Run Tests
        run: |
          bundle exec rake db:create db:migrate
          bundle exec rake test > test/results/test_$(date +%Y%m%d).txt 2>&1

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - name: Build and Push
        run: |
          az acr login --name ${{ secrets.ACR_NAME }}
          docker build -f Dockerfile.api -t ${{ secrets.ACR_SERVER }}/meters-api:${{ github.sha }} .
          docker push ${{ secrets.ACR_SERVER }}/meters-api:${{ github.sha }}
      - name: Deploy
        run: |
          az containerapp update \
            --name ca-redenergy-meters-api \
            --resource-group rg-redenergy-meters-dev \
            --image ${{ secrets.ACR_SERVER }}/meters-api:${{ github.sha }}
```

---

## 5. Phase 2: Data Pipeline & Ingestion (Weeks 3-6)

### 5.1 Data Flow Architecture

```
Smart Meters (1.2M)
    │
    ▼ MQTT / REST (15-30 min intervals)
┌───────────────────────────────────────┐
│         Azure Event Hubs              │
│      (10,000+ events/second)          │
└─────────────────┬─────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────┐
│      Azure Stream Analytics           │
│   - Data validation                   │
│   - Quality flagging                  │
│   - Real-time aggregation             │
└─────────────────┬─────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
    ▼                           ▼
┌─────────────────┐   ┌─────────────────┐
│   PostgreSQL    │   │   Redis Cache   │
│  (TimescaleDB)  │   │  (Real-time)    │
│  - Raw readings │   │  - Latest values│
│  - 24mo history │   │  - Aggregates   │
└─────────────────┘   └─────────────────┘
```

### 5.2 Stream Analytics Query

```sql
-- Azure Stream Analytics job
SELECT
    meter_id,
    reading_time,
    consumption_kwh,
    demand_kw,
    voltage,
    current_amps,
    power_factor,
    CASE
        WHEN voltage < 210 OR voltage > 250 THEN 'voltage_warning'
        WHEN power_factor < 0.8 THEN 'pf_warning'
        ELSE 'normal'
    END as quality_flag
INTO [postgresql-output]
FROM [eventhub-input]
WHERE
    consumption_kwh >= 0
    AND voltage BETWEEN 180 AND 280
    AND power_factor BETWEEN 0 AND 1
```

### 5.3 Ingestion Service

```ruby
# app/services/meter_ingestion_service.rb
class MeterIngestionService
  BATCH_SIZE = 1000
  
  def initialize
    @redis = Redis.new(url: ENV['REDIS_URL'])
  end
  
  def process_batch(readings)
    validated = validate_readings(readings)
    
    ActiveRecord::Base.transaction do
      # Bulk insert to TimescaleDB
      MeterReading.insert_all(validated.map(&:to_db_hash))
      
      # Update real-time cache
      update_redis_cache(validated)
      
      # Queue anomaly detection for flagged readings
      queue_anomaly_checks(validated)
    end
    
    { processed: validated.size, rejected: readings.size - validated.size }
  end
  
  private
  
  def validate_readings(readings)
    readings.select do |r|
      r.voltage.between?(180, 280) &&
      r.power_factor.between?(0, 1) &&
      r.consumption_kwh >= 0
    end
  end
  
  def queue_anomaly_checks(readings)
    flagged = readings.select { |r| r.quality_flag != 'normal' }
    return if flagged.empty?
    
    RunPredictionsJob.perform_later(
      prediction_type: 'anomaly_detection',
      reading_ids: flagged.map(&:id)
    )
  end
  
  def update_redis_cache(readings)
    readings.each do |reading|
      @redis.setex("meter:#{reading.meter_id}:latest", 3600, reading.to_json)
    end
  end
end
```

---

## 6. Phase 3: Observability Platform (Weeks 4-7)

### 6.1 Grafana Dashboards

| Dashboard | Purpose | Refresh |
|-----------|---------|---------|
| **Grid Overview** | Network-wide health | 30 sec |
| **Substation Status** | Capacity & alerts | 1 min |
| **Transformer Health** | Thermal, load, efficiency | 1 min |
| **Power Quality** | Voltage, frequency | 30 sec |
| **Anomaly Tracker** | Active anomalies | 30 sec |
| **Demand Forecast** | 24-72 hour prediction | 15 min |
| **Customer Segments** | Segment distribution | 1 hour |

### 6.2 Alert Configuration

```ruby
# app/services/alert_service.rb
class AlertService
  SEVERITY_CHANNELS = {
    critical: [:pagerduty, :teams, :email],
    warning: [:teams, :email],
    info: [:email]
  }.freeze
  
  def notify(alert)
    channels = SEVERITY_CHANNELS[alert.severity.to_sym] || [:email]
    
    channels.each do |channel|
      send("notify_#{channel}", alert)
    rescue => e
      Rails.logger.error("Notification failed for #{channel}: #{e.message}")
    end
    
    alert.update!(notified_at: Time.current)
  end
  
  private
  
  def notify_teams(alert)
    TeamsWebhookClient.new.send_card(
      title: "[#{alert.severity.upcase}] #{alert.title}",
      body: alert.description,
      facts: [
        { title: "Asset", value: alert.asset_name },
        { title: "Confidence", value: "#{alert.confidence}%" },
        { title: "Time", value: alert.detected_at.strftime("%Y-%m-%d %H:%M") }
      ]
    )
  end
  
  def notify_pagerduty(alert)
    PagerDutyClient.new.trigger(
      summary: alert.title,
      severity: alert.severity,
      source: "red-energy-meters"
    )
  end
  
  def notify_email(alert)
    AlertMailer.notification(alert).deliver_later
  end
end
```

---

## 7. Phase 4: Predictive Maintenance ML (Weeks 5-10)

### 7.1 Anomaly Detection Model

| Attribute | Value |
|-----------|-------|
| **Algorithm** | Isolation Forest + LSTM Ensemble |
| **Features** | voltage, current, power_factor, consumption, time_features |
| **Output** | anomaly_score (0-1), is_anomaly (boolean) |
| **Training Data** | 12 months historical (~4.2TB) |
| **Retraining** | Weekly |
| **Inference Latency** | <100ms |
| **Accuracy Target** | 88% |

#### Training Script

```python
# ml/src/train_anomaly_model.py
import pandas as pd
from sklearn.ensemble import IsolationForest
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import mlflow
import joblib

def train_anomaly_model(data_path: str):
    mlflow.start_run(run_name="anomaly_detection")
    
    # Load data
    df = pd.read_parquet(data_path)
    features = engineer_features(df)
    
    # Train Isolation Forest
    iso_forest = IsolationForest(
        contamination=0.01,
        n_estimators=200,
        random_state=42
    )
    iso_forest.fit(features)
    
    # Train LSTM for temporal patterns
    lstm_model = Sequential([
        LSTM(64, input_shape=(24, features.shape[1]), return_sequences=True),
        LSTM(32),
        Dense(16, activation='relu'),
        Dense(1, activation='sigmoid')
    ])
    lstm_model.compile(optimizer='adam', loss='binary_crossentropy')
    lstm_model.fit(prepare_sequences(features), epochs=50, batch_size=256)
    
    # Save models
    joblib.dump(iso_forest, 'models/iso_forest.joblib')
    lstm_model.save('models/lstm_model.h5')
    
    mlflow.log_artifacts('models/')
    mlflow.end_run()

def engineer_features(df):
    df['hour'] = df['reading_time'].dt.hour
    df['day_of_week'] = df['reading_time'].dt.dayofweek
    df['voltage_deviation'] = abs(df['voltage'] - 230) / 230
    df['rolling_mean'] = df.groupby('meter_id')['consumption_kwh'].transform(
        lambda x: x.rolling(96).mean()
    )
    return df[FEATURE_COLUMNS].fillna(0)
```

#### Inference Service

```ruby
# app/services/anomaly_detection_service.rb
class AnomalyDetectionService
  THRESHOLD = 0.85
  
  def initialize
    @detector = MlServiceFactory.anomaly_detector
  end
  
  def detect(readings)
    features = prepare_features(readings)
    
    predictions = @detector.predict(features)
    
    anomalies = []
    readings.each_with_index do |reading, idx|
      score = predictions[idx][:anomaly_score]
      
      if score >= THRESHOLD
        anomalies << create_alert(reading, score, predictions[idx])
      end
    end
    
    anomalies
  end
  
  private
  
  def prepare_features(readings)
    readings.map do |r|
      {
        voltage: r.voltage,
        current: r.current_amps,
        power_factor: r.power_factor,
        consumption: r.consumption_kwh,
        hour: r.reading_time.hour,
        day_of_week: r.reading_time.wday,
        voltage_deviation: (r.voltage - 230).abs / 230.0
      }
    end
  end
  
  def create_alert(reading, score, prediction)
    Alert.create!(
      title: "Anomaly Detected: #{prediction[:type]}",
      description: "Anomaly detected on meter #{reading.smart_meter.meter_number}",
      severity: score >= 0.95 ? 'critical' : 'warning',
      source: 'anomaly_detection',
      confidence: (score * 100).round,
      asset_type: 'smart_meter',
      asset_id: reading.meter_id,
      detected_at: Time.current
    )
  end
end
```

### 7.2 Failure Prediction Model

| Attribute | Value |
|-----------|-------|
| **Algorithm** | Gradient Boosting (XGBoost) |
| **Prediction Window** | 48-72 hours ahead |
| **Target** | equipment_failure (binary) |
| **Accuracy Target** | 87% |

```python
# ml/src/train_failure_model.py
import xgboost as xgb
from sklearn.model_selection import train_test_split
import mlflow

def train_failure_model(data_path: str):
    mlflow.start_run(run_name="failure_prediction")
    
    df = pd.read_parquet(data_path)
    features = engineer_transformer_features(df)
    
    X = features.drop('failed_within_72h', axis=1)
    y = features['failed_within_72h']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    
    model = xgb.XGBClassifier(
        n_estimators=500,
        max_depth=6,
        learning_rate=0.1,
        scale_pos_weight=len(y[y==0]) / len(y[y==1])  # Handle imbalance
    )
    model.fit(X_train, y_train)
    
    accuracy = model.score(X_test, y_test)
    mlflow.log_metric("accuracy", accuracy)
    
    model.save_model('models/failure_predictor.json')
    mlflow.log_artifact('models/failure_predictor.json')
    mlflow.end_run()

def engineer_transformer_features(df):
    return df[[
        'age_years',
        'load_utilization_avg',
        'load_utilization_max',
        'temperature_avg',
        'temperature_max',
        'anomaly_count_7d',
        'maintenance_days_since',
        'efficiency_trend',
        'failed_within_72h'  # Target
    ]]
```

---

## 8. Phase 5: Customer Intelligence ML (Weeks 8-14)

### 8.1 Customer Segmentation (K-means)

#### The 12 Segments

| Segment | % of Customers | Peak Hours | Opportunity |
|---------|----------------|------------|-------------|
| Early Morning Industrial | 3% | 4am-8am | Off-peak incentives |
| Business Hours Commercial | 8% | 9am-5pm | Demand response contracts |
| Evening Residential Peak | 22% | 6pm-10pm | Time-shift recommendations |
| Solar + Battery Households | 7% | Varies | Virtual power plant |
| EV Charging Households | 9% | 6pm-11pm | Smart charging |
| Efficiency Optimizers | 5% | Flat | Loyalty rewards |
| High Consumption All-Day | 6% | All day | Premium service tiers |
| Seasonal Variation Heavy | 12% | Seasonal | Seasonal rate plans |
| Weekend Shift Users | 8% | Weekend | Weekend off-peak rates |
| Night Owl Households | 6% | 10pm-2am | Super off-peak incentives |
| Retired / Home All Day | 9% | All day | Daytime solar plans |
| Low-Use Minimal | 5% | Minimal | Low-use discounts |

#### Training Script

```python
# ml/src/train_segmentation_model.py
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import mlflow

def train_segmentation_model(data_path: str):
    mlflow.start_run(run_name="customer_segmentation")
    
    df = pd.read_parquet(data_path)
    features = engineer_customer_features(df)
    
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)
    
    model = KMeans(n_clusters=12, random_state=42, n_init=20)
    model.fit(scaled_features)
    
    # Log cluster statistics
    for i in range(12):
        cluster_size = (model.labels_ == i).sum()
        mlflow.log_metric(f"cluster_{i}_size", cluster_size)
    
    joblib.dump(model, 'models/segmentation_model.joblib')
    joblib.dump(scaler, 'models/segmentation_scaler.joblib')
    mlflow.log_artifacts('models/')
    mlflow.end_run()

def engineer_customer_features(df):
    # Create hourly usage profile (24 features)
    hourly_profile = df.pivot_table(
        index='customer_id',
        columns='hour',
        values='consumption_kwh',
        aggfunc='mean'
    )
    
    # Add aggregate features
    agg_features = df.groupby('customer_id').agg({
        'consumption_kwh': ['mean', 'std', 'max'],
        'demand_kw': 'max'
    })
    
    return pd.concat([hourly_profile, agg_features], axis=1)
```

### 8.2 Demand Forecasting (Prophet + Neural Network)

| Attribute | Value |
|-----------|-------|
| **Algorithm** | Prophet + LSTM Ensemble |
| **Forecast Horizon** | 24-72 hours |
| **Granularity** | 15-minute intervals |
| **Accuracy Target** | 96% within 5% margin |

```python
# ml/src/train_forecasting_model.py
from prophet import Prophet
import tensorflow as tf

def train_demand_forecaster(data_path: str):
    mlflow.start_run(run_name="demand_forecasting")
    
    df = pd.read_parquet(data_path)
    
    # Train Prophet for trend + seasonality
    prophet_df = df[['timestamp', 'total_demand_mw']].rename(
        columns={'timestamp': 'ds', 'total_demand_mw': 'y'}
    )
    
    prophet_model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=True
    )
    prophet_model.fit(prophet_df)
    
    # Train LSTM for residuals
    residuals = calculate_residuals(prophet_model, prophet_df)
    lstm_model = train_residual_lstm(residuals)
    
    # Save models
    prophet_model.save('models/prophet_demand.json')
    lstm_model.save('models/lstm_residuals.h5')
    
    mlflow.log_artifacts('models/')
    mlflow.end_run()
```

### 8.3 Recommendation Engine

```ruby
# app/services/recommendation_service.rb
class RecommendationService
  def generate_recommendations(customer)
    segment = customer.segment
    usage = analyze_usage(customer)
    
    recommendations = []
    
    # Time-shift recommendation
    if usage[:peak_usage_percent] > 40
      recommendations << {
        type: 'time_shift',
        title: "Shift usage to off-peak hours",
        description: "Move #{usage[:shiftable_appliances].join(', ')} to after 10pm",
        estimated_savings: calculate_time_shift_savings(customer)
      }
    end
    
    # Tariff optimization
    optimal_tariff = find_optimal_tariff(customer)
    if optimal_tariff != customer.tariff_type
      recommendations << {
        type: 'tariff_change',
        title: "Switch to #{optimal_tariff} tariff",
        description: "Based on your usage pattern, you'd save money",
        estimated_savings: calculate_tariff_savings(customer, optimal_tariff)
      }
    end
    
    # Demand response
    if segment.key.in?(['evening_residential_peak', 'ev_charging_households'])
      recommendations << {
        type: 'demand_response',
        title: "Join our Demand Response program",
        description: "Earn credits by reducing usage during peak events",
        estimated_savings: 12.0  # Average monthly credit
      }
    end
    
    # Store recommendations
    recommendations.each do |rec|
      CustomerRecommendation.create!(customer: customer, **rec)
    end
    
    recommendations
  end
end
```

---

## 9. Phase 6: Integration & Testing (Weeks 12-16)

### 9.1 Test Requirements (per PRINCIPLES.md)

- **80% code coverage minimum**
- Test results saved to `test/results/`
- Never commit with known test failures

### 9.2 Integration Tests

```ruby
# test/integration/full_workflow_test.rb
class FullWorkflowTest < ActiveSupport::TestCase
  def setup
    @transformer = transformers(:transformer_247)
    EnvironmentMode.set_mode(:sandbox)
  end
  
  test "anomaly detection to alert workflow" do
    # Create anomalous reading
    reading = MeterReading.create!(
      meter_id: @transformer.primary_meter.id,
      reading_time: Time.current,
      voltage: 195,  # Low - anomaly
      consumption_kwh: 150,
      power_factor: 0.92
    )
    
    # Run detection
    anomalies = AnomalyDetectionService.new.detect([reading])
    
    assert_equal 1, anomalies.size
    assert anomalies.first.confidence >= 85
    
    # Verify alert created
    alert = Alert.find_by(asset_id: reading.meter_id)
    assert alert.present?
  end
  
  test "failure prediction triggers automated response" do
    create_failure_indicators(@transformer)
    
    predictions = FailurePredictionService.new.predict([@transformer])
    
    assert predictions.first.confidence >= 85
    assert_equal 'maintenance_pending', @transformer.reload.status
  end
  
  test "customer segmentation assigns correct segment" do
    customer = customers(:evening_user)
    
    CustomerSegmentationService.new.segment(customer)
    
    assert_equal 'evening_residential_peak', customer.reload.segment_id
  end
end
```

### 9.3 Performance Tests

```ruby
# test/performance/throughput_test.rb
class ThroughputTest < ActiveSupport::TestCase
  test "ingestion handles 10000 readings per second" do
    readings = 10000.times.map { build_random_reading }
    
    time = Benchmark.realtime do
      MeterIngestionService.new.process_batch(readings)
    end
    
    throughput = 10000 / time
    assert throughput >= 10000, "Throughput #{throughput.round}/sec below target"
  end
  
  test "anomaly detection under 100ms" do
    readings = MeterReading.limit(100)
    
    times = readings.map do |r|
      Benchmark.realtime { AnomalyDetectionService.new.detect([r]) } * 1000
    end
    
    p95 = times.sort[(times.size * 0.95).to_i]
    assert p95 < 100, "P95 latency #{p95.round}ms exceeds 100ms target"
  end
end
```

---

## 10. Phase 7: Production Deployment (Weeks 15-18)

### 10.1 Rollout Plan

| Week | Stage | Traffic | Actions |
|------|-------|---------|---------|
| 15 | Shadow Mode | 10% | Compare predictions vs actuals |
| 16 | Pilot | 25% | Enable alerting, 5K customers in DR |
| 17 | Expanded | 75% | Enable automated actions |
| 18 | Full Production | 100% | All features live |

### 10.2 Production Checklist

#### Infrastructure
- [ ] Production resource group created
- [ ] PostgreSQL HA enabled
- [ ] Automated backups verified
- [ ] SSL certificates installed

#### Application
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Health checks responding
- [ ] Sidekiq workers running

#### ML Models
- [ ] Models deployed to Azure ML endpoints
- [ ] Inference latency validated (<100ms)
- [ ] Model monitoring configured

#### Monitoring
- [ ] Grafana dashboards deployed
- [ ] Alert routing configured
- [ ] PagerDuty integration tested

---

## 11. Database Architecture

### Complete Schema

```sql
-- METERS --
CREATE TABLE smart_meters (
  id BIGSERIAL PRIMARY KEY,
  meter_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id BIGINT REFERENCES customers(id),
  transformer_id BIGINT REFERENCES transformers(id),
  meter_type VARCHAR(30),
  status VARCHAR(20) DEFAULT 'active',
  installed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- READINGS (TimescaleDB hypertable) --
CREATE TABLE meter_readings (
  meter_id BIGINT NOT NULL,
  reading_time TIMESTAMPTZ NOT NULL,
  consumption_kwh DECIMAL(12,4),
  demand_kw DECIMAL(10,4),
  voltage DECIMAL(8,2),
  current_amps DECIMAL(8,2),
  power_factor DECIMAL(5,4),
  quality_flag VARCHAR(10),
  PRIMARY KEY (meter_id, reading_time)
);
SELECT create_hypertable('meter_readings', 'reading_time');

-- GRID INFRASTRUCTURE --
CREATE TABLE transformers (
  id BIGSERIAL PRIMARY KEY,
  transformer_number VARCHAR(50) UNIQUE NOT NULL,
  substation_id BIGINT REFERENCES substations(id),
  capacity_kva DECIMAL(10,2),
  current_load_kva DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'operational',
  age_years DECIMAL(4,1),
  last_maintenance_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE substations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity_mva DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'operational',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CUSTOMERS --
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  customer_hash VARCHAR(64) UNIQUE NOT NULL,
  segment_id VARCHAR(30),
  tariff_type VARCHAR(30),
  solar_installed BOOLEAN DEFAULT FALSE,
  ev_charging BOOLEAN DEFAULT FALSE,
  demand_response_opted_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customer_recommendations (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id),
  recommendation_type VARCHAR(50),
  title VARCHAR(200),
  description TEXT,
  estimated_monthly_savings DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ML PREDICTIONS --
CREATE TABLE predictions (
  id BIGSERIAL PRIMARY KEY,
  asset_type VARCHAR(50) NOT NULL,
  asset_id BIGINT NOT NULL,
  prediction_type VARCHAR(50) NOT NULL,
  probability DECIMAL(5,4),
  confidence DECIMAL(5,2),
  predicted_at TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE demand_forecasts (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  predicted_demand_mw DECIMAL(10,2),
  confidence_lower DECIMAL(10,2),
  confidence_upper DECIMAL(10,2),
  actual_demand_mw DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALERTS --
CREATE TABLE alerts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  severity VARCHAR(20) NOT NULL,
  source VARCHAR(50),
  confidence INTEGER,
  asset_type VARCHAR(50),
  asset_id BIGINT,
  detected_at TIMESTAMPTZ,
  notified_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DEMAND RESPONSE --
CREATE TABLE demand_response_events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  target_reduction_mw DECIMAL(10,2),
  actual_reduction_mw DECIMAL(10,2),
  customers_participated INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES --
CREATE INDEX idx_readings_meter_time ON meter_readings (meter_id, reading_time DESC);
CREATE INDEX idx_customers_segment ON customers (segment_id);
CREATE INDEX idx_alerts_severity ON alerts (severity, created_at DESC);
CREATE INDEX idx_predictions_asset ON predictions (asset_type, asset_id);
```

---

## 12. API Design

### Endpoints (LEAN routes per PRINCIPLES.md)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **Meters** | | |
| GET | `/api/v1/meters` | List meters |
| GET | `/api/v1/meters/:id` | Get meter |
| GET | `/api/v1/meters/:id/readings` | Get readings |
| **Predictions** | | |
| GET | `/api/v1/predictions` | List predictions |
| POST | `/api/v1/transformers/:id/predict` | Trigger prediction |
| **Alerts** | | |
| GET | `/api/v1/alerts` | List alerts |
| PUT | `/api/v1/alerts/:id/resolve` | Resolve alert |
| **Customers** | | |
| GET | `/api/v1/customers/:hash` | Get customer |
| GET | `/api/v1/customers/:hash/recommendations` | Get recommendations |
| **Analytics** | | |
| GET | `/api/v1/analytics/grid-health` | Grid metrics |
| GET | `/api/v1/analytics/demand-forecast` | Demand forecast |
| GET | `/api/v1/analytics/segments` | Segment distribution |

---

## 13. ML Model Specifications

| Model | Algorithm | Training Data | Accuracy | Latency | Retrain |
|-------|-----------|---------------|----------|---------|---------|
| **Anomaly Detection** | Isolation Forest + LSTM | 12mo readings | 88% | <100ms | Weekly |
| **Failure Prediction** | XGBoost | 12mo + failures | 87% | <200ms | Monthly |
| **Customer Segmentation** | K-means | 90 days usage | 94% | <500ms | Monthly |
| **Demand Forecasting** | Prophet + LSTM | 24mo demand | 96% | <1s | Daily |

---

## 14. Security & Compliance

### Data Classification

| Data Type | Classification | Access |
|-----------|---------------|--------|
| Meter readings | Internal | Grid Operations |
| Customer PII | Confidential | Authorized only |
| ML predictions | Internal | Operations + Analytics |

### AEMO Compliance
- Automated reliability reporting
- 24-month data retention
- Complete audit trail

---

## 15. Cost Estimates

### Monthly Operating Costs (AUD)

| Category | Service | Cost |
|----------|---------|------|
| **Compute** | Container Apps | $150 |
| **Database** | PostgreSQL D4s | $350 |
| **Cache** | Redis Standard | $100 |
| **Streaming** | Event Hubs + Stream Analytics | $150 |
| **ML** | Azure ML (training + inference) | $400 |
| **Storage** | Blob Storage | $50 |
| **Monitoring** | Log Analytics + App Insights | $80 |
| **Other** | Key Vault, networking | $20 |
| **TOTAL** | | **$1,300/month** |

### Annual Summary

| Item | Cost |
|------|------|
| Platform Infrastructure | $15,600 |
| Grafana Enterprise (optional) | $15,000 |
| **Total Investment** | **~$30,600** |
| **Annual Benefit** | **$23,840,000** |
| **ROI** | **77,908%** |

---

## 16. Success Criteria

### Grid Reliability

| Metric | Baseline | Target |
|--------|----------|--------|
| Unplanned outages | 12/month | <4/month |
| MTTR | 4.5 hours | <2.2 hours |
| Prediction accuracy | 0% | >85% |
| Early warning time | 0 hours | 48-72 hours |

### Customer Engagement

| Metric | Baseline | Target |
|--------|----------|--------|
| Recommendation engagement | 2% | >25% |
| Demand response participation | 0% | >20% |
| Peak demand reduction | 0% | >15% |

### Financial

| Metric | Target |
|--------|--------|
| Outage cost savings | >$10M/year |
| Peak demand savings | >$6M/year |
| Net annual benefit | >$20M/year |

---

## Appendix: Key Differences from RAG Architecture

| Aspect | RAG Architecture (Marcom) | This Project (Meters) |
|--------|---------------------------|------------------------|
| **ML Type** | Retrieval-Augmented Generation | Traditional ML |
| **Data** | Text documents | Numerical time-series |
| **Models** | LLM (GPT-4) + Embeddings | Isolation Forest, XGBoost, K-means, Prophet |
| **Azure OpenAI** | Required | Not required |
| **Azure AI Search** | Required (vector search) | Not required |
| **Monthly Cost** | ~$4,500 | ~$1,300 |

---

**Document Version:** 2.0  
**Last Updated:** November 26, 2025
