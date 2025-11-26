# Red Energy Smart Meter Analytics Platform
## Complete Implementation Plan

**Project:** Red Energy Electric Meter Data Processing & ML Platform  
**Version:** 1.0  
**Date:** November 26, 2025  
**Owner:** Kyndryl Agentic AI Platform Team

---

## Executive Summary

This implementation plan details the complete build-out of Red Energy's Smart Meter Analytics Platform - a machine learning-powered system that transforms raw electricity consumption data from 1.2 million customers into actionable business intelligence.

### Business Outcomes
- **$23.84M** net annual benefit
- **627%** ROI with 1.8-month payback
- **70%** reduction in unplanned outages
- **25%** customer engagement (vs 2% baseline)
- **15%** peak demand reduction

### Three Core Workflows
1. **Observability Platform** - Real-time grid monitoring with AI-powered dashboards
2. **Predictive Maintenance AI** - 48-72 hour early warning for equipment failures
3. **Customer Intelligence AI** - Personalized recommendations and demand forecasting

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Project Timeline Overview](#2-project-timeline-overview)
3. [Phase 1: Foundation Infrastructure](#3-phase-1-foundation-infrastructure-weeks-1-4)
4. [Phase 2: Data Pipeline & Ingestion](#4-phase-2-data-pipeline--ingestion-weeks-3-6)
5. [Phase 3: Observability Platform](#5-phase-3-observability-platform-weeks-4-7)
6. [Phase 4: Predictive Maintenance AI](#6-phase-4-predictive-maintenance-ai-weeks-5-10)
7. [Phase 5: Customer Intelligence AI](#7-phase-5-customer-intelligence-ai-weeks-8-14)
8. [Phase 6: Integration & Testing](#8-phase-6-integration--testing-weeks-12-16)
9. [Phase 7: Production Deployment](#9-phase-7-production-deployment-weeks-15-18)
10. [Database Architecture](#10-database-architecture)
11. [API Design](#11-api-design)
12. [ML Model Specifications](#12-ml-model-specifications)
13. [Security & Compliance](#13-security--compliance)
14. [Monitoring & Operations](#14-monitoring--operations)
15. [Cost Estimates](#15-cost-estimates)
16. [Risk Management](#16-risk-management)
17. [Success Criteria](#17-success-criteria)

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
| **ML Client** | google-cloud-ai_platform | 1.0+ | Vertex AI integration |

### Frontend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | React | 19.0+ | UI components |
| **Build Tool** | Vite | 6.0+ | Fast dev/build |
| **Styling** | Tailwind CSS | 3.4+ | Nordic/Scandinavian palette |
| **Icons** | Lucide React | 0.460+ | Consistent iconography |
| **Charts** | Recharts | 2.12+ | Data visualization |
| **Real-time** | Socket.io | 4.7+ | Live data streams |

### Data & ML Platform (Azure)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Primary Database** | Azure PostgreSQL 14+ | Time-series data, customer data |
| **Vector Extension** | pgvector | Embeddings for similarity search |
| **Time-Series** | TimescaleDB extension | Optimized meter data storage |
| **Cache/Queue** | Azure Redis | Real-time data, job queues |
| **Object Storage** | Azure Blob Storage | Raw data, model artifacts |
| **ML Training** | Azure ML Studio | Model training infrastructure |
| **LLM Services** | Azure OpenAI (GPT-4) | Natural language insights |
| **Embeddings** | Azure OpenAI (Ada-002) | Customer segment similarity |
| **Search** | Azure AI Search | RAG for operational knowledge |

### External Integrations

| System | Purpose | Protocol |
|--------|---------|----------|
| **Grafana** | Data collection & visualization | REST API / Prometheus |
| **IBM Bridge** | Enterprise correlation & AI | REST API |
| **Smart Meters** | 1.2M endpoint data sources | MQTT / REST |
| **AEMO** | Regulatory reporting | REST API |
| **ServiceNow** | Incident management | REST API |
| **Teams/Slack** | Alert notifications | Webhooks |

---

## 2. Project Timeline Overview

```
Week:  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18
       ├──┴──┴──┴──┤                                          Foundation
          ├──┴──┴──┴──┤                                       Data Pipeline
             ├──┴──┴──┴──┤                                    Observability
                ├──┴──┴──┴──┴──┴──┤                           Predictive AI
                      ├──┴──┴──┴──┴──┴──┴──┤                  Customer AI
                               ├──┴──┴──┴──┴──┤               Integration
                                        ├──┴──┴──┴──┤         Production
```

### Phase Breakdown

| Phase | Description | Weeks | Team |
|-------|-------------|-------|------|
| **Phase 1** | Foundation Infrastructure | 1-4 | DevOps, Backend |
| **Phase 2** | Data Pipeline & Ingestion | 3-6 | Data Engineering |
| **Phase 3** | Observability Platform | 4-7 | Full Stack |
| **Phase 4** | Predictive Maintenance AI | 5-10 | ML, Backend |
| **Phase 5** | Customer Intelligence AI | 8-14 | ML, Backend, Frontend |
| **Phase 6** | Integration & Testing | 12-16 | QA, Full Stack |
| **Phase 7** | Production Deployment | 15-18 | DevOps, All |

---

## 3. Phase 1: Foundation Infrastructure (Weeks 1-4)

### 3.1 Week 1: Azure Landing Zone

#### Tasks
- [ ] Create Azure subscription and resource groups
- [ ] Deploy Virtual Network with subnets
- [ ] Configure Azure Key Vault for secrets
- [ ] Set up Azure Container Registry
- [ ] Deploy Log Analytics workspace
- [ ] Configure Application Insights

#### Infrastructure as Code (Bicep)

```
infrastructure/
├── main.bicep
├── modules/
│   ├── networking.bicep       # VNet, subnets, NSGs
│   ├── compute.bicep          # Container Apps Environment
│   ├── database.bicep         # PostgreSQL Flexible Server
│   ├── storage.bicep          # Blob Storage accounts
│   ├── ai-services.bicep      # OpenAI, ML Studio
│   ├── monitoring.bicep       # Log Analytics, App Insights
│   └── security.bicep         # Key Vault, managed identities
├── parameters.dev.json
├── parameters.staging.json
├── parameters.prod.json
└── deploy.rb                  # Ruby deployment script
```

#### Azure Resource Naming Convention

```
Pattern: {resource}-redenergy-meters-{env}-{region}

Examples:
- rg-redenergy-meters-dev-aue         # Resource Group
- vnet-redenergy-meters-dev-aue       # Virtual Network
- psql-redenergy-meters-dev-aue       # PostgreSQL
- acr-redenergymetersdevaue           # Container Registry (no hyphens)
- kv-redenergy-meters-dev-aue         # Key Vault
- openai-redenergy-meters-dev-aue     # Azure OpenAI
```

#### Deliverables
- ✅ Resource Group created
- ✅ VNet with 4 subnets (apps, database, ML, endpoints)
- ✅ Key Vault with RBAC
- ✅ Container Registry
- ✅ Log Analytics + App Insights
- ✅ All infrastructure in Bicep (IaC)

### 3.2 Week 2: Database Infrastructure

#### PostgreSQL Schema Design

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS vector;          -- pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS timescaledb;     -- Time-series optimization
CREATE EXTENSION IF NOT EXISTS pg_trgm;         -- Text search

-- Schema organization
CREATE SCHEMA meters;        -- Smart meter data
CREATE SCHEMA customers;     -- Customer profiles
CREATE SCHEMA grid;          -- Grid infrastructure
CREATE SCHEMA ml;            -- ML models and predictions
CREATE SCHEMA analytics;     -- Aggregated analytics
CREATE SCHEMA audit;         -- Audit trails
```

#### Core Tables (Initial Migration)

```ruby
# db/migrate/20251126000001_create_foundation_tables.rb
class CreateFoundationTables < ActiveRecord::Migration[7.2]
  def change
    # Smart meter readings (time-series, hypertable)
    create_table :meter_readings, id: false do |t|
      t.bigint :meter_id, null: false
      t.timestamp :reading_time, null: false
      t.decimal :consumption_kwh, precision: 12, scale: 4
      t.decimal :demand_kw, precision: 10, scale: 4
      t.decimal :voltage, precision: 8, scale: 2
      t.decimal :current_amps, precision: 8, scale: 2
      t.decimal :power_factor, precision: 5, scale: 4
      t.string :quality_flag, limit: 10
      
      t.index [:meter_id, :reading_time], unique: true
    end
    
    # Convert to TimescaleDB hypertable
    execute <<-SQL
      SELECT create_hypertable('meter_readings', 'reading_time',
        chunk_time_interval => INTERVAL '1 day',
        if_not_exists => TRUE
      );
    SQL
    
    # Smart meters registry
    create_table :smart_meters do |t|
      t.string :meter_number, null: false, limit: 50
      t.bigint :customer_id
      t.bigint :transformer_id
      t.string :meter_type, limit: 30          # residential, commercial, industrial
      t.string :status, limit: 20, default: 'active'
      t.timestamp :installed_at
      t.timestamp :last_reading_at
      t.jsonb :metadata
      
      t.timestamps
      
      t.index :meter_number, unique: true
      t.index :customer_id
      t.index :transformer_id
      t.index :status
    end
    
    # Customers (anonymized for analytics)
    create_table :customers do |t|
      t.string :customer_hash, null: false, limit: 64  # SHA-256 of customer ID
      t.string :segment_id, limit: 30
      t.string :tariff_type, limit: 30
      t.string :connection_type, limit: 30      # single_phase, three_phase
      t.boolean :solar_installed, default: false
      t.boolean :battery_installed, default: false
      t.boolean :ev_charging, default: false
      t.boolean :demand_response_opted_in, default: false
      t.timestamp :consent_given_at
      t.jsonb :preferences
      
      t.timestamps
      
      t.index :customer_hash, unique: true
      t.index :segment_id
    end
  end
end
```

#### Deliverables
- ✅ PostgreSQL Flexible Server deployed
- ✅ TimescaleDB extension enabled
- ✅ pgvector extension enabled
- ✅ Foundation tables created
- ✅ Database backup configured (7-day retention)
- ✅ Connection pooling (PgBouncer)

### 3.3 Week 3: Application Foundation

#### Project Structure

```
RedEnergyMeters/
├── app/
│   ├── models/
│   │   ├── application_record.rb
│   │   ├── concerns/
│   │   │   ├── auditable.rb           # created_by, updated_by tracking
│   │   │   ├── segmentable.rb         # Customer segmentation logic
│   │   │   └── predictable.rb         # ML prediction interface
│   │   ├── smart_meter.rb
│   │   ├── meter_reading.rb
│   │   ├── customer.rb
│   │   ├── customer_segment.rb
│   │   ├── transformer.rb
│   │   ├── substation.rb
│   │   ├── prediction.rb
│   │   ├── alert.rb
│   │   └── demand_response_event.rb
│   ├── routes/
│   │   ├── meters_routes.rb           # LEAN: 5-10 lines per endpoint
│   │   ├── customers_routes.rb
│   │   ├── predictions_routes.rb
│   │   ├── alerts_routes.rb
│   │   ├── analytics_routes.rb
│   │   └── admin_routes.rb
│   ├── services/
│   │   ├── ai_service_factory.rb      # CRITICAL: All AI via factory
│   │   ├── meter_data_ingestion_service.rb
│   │   ├── anomaly_detection_service.rb
│   │   ├── failure_prediction_service.rb
│   │   ├── customer_segmentation_service.rb
│   │   ├── demand_forecasting_service.rb
│   │   ├── recommendation_engine_service.rb
│   │   └── alert_notification_service.rb
│   ├── jobs/
│   │   ├── ingest_meter_data_job.rb
│   │   ├── run_anomaly_detection_job.rb
│   │   ├── update_predictions_job.rb
│   │   ├── segment_customers_job.rb
│   │   └── send_demand_response_alerts_job.rb
│   └── middleware/
│       ├── error_handler.rb           # Centralized error handling
│       └── request_logger.rb
├── config/
│   ├── database.rb
│   ├── database.yml
│   ├── sidekiq.yml
│   └── ml_models.yml                  # ML model configurations
├── db/
│   ├── migrate/
│   └── seeds.rb
├── frontend/                          # React application
├── infrastructure/                    # Bicep templates
├── ml/                                # ML training notebooks
│   ├── notebooks/
│   │   ├── anomaly_detection.ipynb
│   │   ├── failure_prediction.ipynb
│   │   ├── customer_segmentation.ipynb
│   │   └── demand_forecasting.ipynb
│   ├── models/                        # Exported model artifacts
│   └── training/                      # Training scripts
├── script/
│   ├── utilities/
│   │   ├── db_reset.rb
│   │   ├── seed_sample_data.rb
│   │   └── backfill_predictions.rb
│   ├── manual_tests/
│   │   ├── test_ml_pipeline.rb
│   │   └── test_grafana_integration.rb
│   └── examples/
│       └── demo_workflows.rb
├── test/
│   ├── models/
│   ├── services/
│   ├── routes/
│   └── results/                       # MANDATORY: Save all test results
├── app.rb                             # Main Sinatra application
├── config.ru
├── Gemfile
├── Dockerfile.api
├── docker-compose.yml
├── .env.example
├── PRINCIPLES.md
├── IMPLEMENTATION_PLAN.md
└── README.md
```

#### AI Service Factory (CRITICAL per PRINCIPLES.md)

```ruby
# app/services/ai_service_factory.rb
class AiServiceFactory
  class << self
    # MANDATORY: Always use factory methods, never instantiate directly
    
    def default_service
      mode = EnvironmentMode.current_mode
      provider = SystemSetting.get("ai_provider") || :azure_openai
      
      case mode
      when :sandbox then Sandbox::AzureOpenAIService.new
      when :simulation then Simulation::MockAzureOpenAIService.new
      when :production then production_service(provider)
      end
    end
    
    def for_anomaly_detection
      # Specialized for anomaly detection - uses specific model
      service = default_service
      service.configure(model: ml_config[:anomaly_detection][:model])
      service
    end
    
    def for_demand_forecasting
      service = default_service
      service.configure(model: ml_config[:demand_forecasting][:model])
      service
    end
    
    def for_customer_insights
      # Uses GPT-4 for natural language insights
      azure_openai_service(model: 'gpt-4')
    end
    
    private
    
    def production_service(provider)
      case provider
      when :azure_openai then Real::AzureOpenAIService.new
      when :azure_ml then Real::AzureMLService.new
      else raise ArgumentError, "Unknown provider: #{provider}"
      end
    end
    
    def ml_config
      @ml_config ||= YAML.load_file('config/ml_models.yml').deep_symbolize_keys
    end
  end
end
```

#### Deliverables
- ✅ Project structure created
- ✅ Gemfile with all dependencies
- ✅ Base models with concerns
- ✅ AiServiceFactory implemented
- ✅ Error handling middleware
- ✅ Basic API health endpoint working

### 3.4 Week 4: CI/CD Pipeline

#### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Red Energy Meters Platform

on:
  push:
    branches: [main, staging]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'dev'
        type: choice
        options: [dev, staging, prod]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: timescale/timescaledb:latest-pg14
        env:
          POSTGRES_PASSWORD: testpassword
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
      
      - name: Run Tests
        run: |
          bundle exec rake db:create db:migrate
          bundle exec rake test > test/results/test_$(date +%Y%m%d_%H%M%S).txt 2>&1
          
      - name: Upload Test Results
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test/results/

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Build and Push Docker Images
        run: |
          az acr login --name ${{ secrets.ACR_NAME }}
          
          docker build -f Dockerfile.api \
            -t ${{ secrets.ACR_SERVER }}/meters-api:${{ github.sha }} .
          docker push ${{ secrets.ACR_SERVER }}/meters-api:${{ github.sha }}
          
      - name: Deploy to Container Apps
        run: |
          az containerapp update \
            --name ca-redenergy-meters-${{ inputs.environment }}-api \
            --resource-group rg-redenergy-meters-${{ inputs.environment }} \
            --image ${{ secrets.ACR_SERVER }}/meters-api:${{ github.sha }}
```

#### Deliverables
- ✅ GitHub Actions workflow for test/build/deploy
- ✅ Docker images building correctly
- ✅ Container Apps deployment automated
- ✅ Test results saved to artifacts
- ✅ Staging environment operational

---

## 4. Phase 2: Data Pipeline & Ingestion (Weeks 3-6)

### 4.1 Smart Meter Data Ingestion

#### Data Flow Architecture

```
Smart Meters (1.2M)
    │
    ▼ MQTT / REST (15-30 min intervals)
┌───────────────────────────────────────┐
│         Data Ingestion Layer          │
│  ┌─────────────────────────────────┐  │
│  │     Azure Event Hubs            │  │
│  │   (10,000+ events/second)       │  │
│  └─────────────┬───────────────────┘  │
│                │                      │
│  ┌─────────────▼───────────────────┐  │
│  │     Stream Processing           │  │
│  │   (Azure Stream Analytics)      │  │
│  │   - Data validation             │  │
│  │   - Quality flagging            │  │
│  │   - Real-time aggregation       │  │
│  └─────────────┬───────────────────┘  │
└────────────────│──────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌─────────────────┐   ┌─────────────────┐
│   PostgreSQL    │   │   Redis Cache   │
│  (TimescaleDB)  │   │  (Real-time)    │
│  - Raw readings │   │  - Latest values│
│  - 24mo history │   │  - Aggregates   │
└─────────────────┘   └─────────────────┘
```

#### Ingestion Service

```ruby
# app/services/meter_data_ingestion_service.rb
class MeterDataIngestionService
  BATCH_SIZE = 1000
  
  def initialize
    @ai_service = AiServiceFactory.default_service
    @redis = Redis.new(url: ENV['REDIS_URL'])
  end
  
  def process_batch(readings)
    validated_readings = validate_readings(readings)
    
    ActiveRecord::Base.transaction do
      # Bulk insert to TimescaleDB
      MeterReading.insert_all(validated_readings.map(&:to_db_hash))
      
      # Update real-time cache
      update_redis_cache(validated_readings)
      
      # Queue anomaly detection for suspicious readings
      queue_anomaly_checks(validated_readings)
    end
    
    log_ingestion_stats(readings.size, validated_readings.size)
    
    { success: true, processed: validated_readings.size, rejected: readings.size - validated_readings.size }
  end
  
  private
  
  def validate_readings(readings)
    readings.select do |reading|
      reading.voltage.between?(200, 260) &&
      reading.power_factor.between?(0, 1) &&
      reading.consumption_kwh >= 0
    end.each { |r| r.quality_flag = determine_quality_flag(r) }
  end
  
  def determine_quality_flag(reading)
    if reading.voltage < 210 || reading.voltage > 250
      'warning'
    elsif reading.consumption_kwh > reading.meter.average_daily * 3
      'anomaly'
    else
      'normal'
    end
  end
  
  def queue_anomaly_checks(readings)
    anomalies = readings.select { |r| r.quality_flag == 'anomaly' }
    return if anomalies.empty?
    
    RunAnomalyDetectionJob.perform_later(anomalies.map(&:id))
  end
  
  def update_redis_cache(readings)
    readings.each do |reading|
      key = "meter:#{reading.meter_id}:latest"
      @redis.setex(key, 3600, reading.to_json)
    end
  end
end
```

### 4.2 Grafana Integration

#### Grafana Data Source Configuration

```ruby
# app/services/grafana_integration_service.rb
class GrafanaIntegrationService
  BASE_URL = ENV['GRAFANA_URL']
  
  def initialize
    @api_key = Rails.application.credentials.dig(:grafana, :api_key)
  end
  
  def create_dashboard(dashboard_config)
    response = HTTParty.post(
      "#{BASE_URL}/api/dashboards/db",
      headers: { 
        'Authorization' => "Bearer #{@api_key}",
        'Content-Type' => 'application/json'
      },
      body: {
        dashboard: dashboard_config,
        overwrite: true
      }.to_json
    )
    
    raise "Grafana API error: #{response.body}" unless response.success?
    
    response.parsed_response
  end
  
  def generate_grid_dashboard
    {
      title: "Red Energy Grid Overview",
      panels: [
        voltage_panel,
        load_panel,
        anomaly_count_panel,
        transformer_health_panel
      ],
      refresh: "30s",
      time: { from: "now-6h", to: "now" }
    }
  end
  
  private
  
  def voltage_panel
    {
      type: "timeseries",
      title: "Grid Voltage Distribution",
      targets: [{
        rawSql: "SELECT time_bucket('5 minutes', reading_time) AS time, 
                        avg(voltage) as avg_voltage,
                        min(voltage) as min_voltage,
                        max(voltage) as max_voltage
                 FROM meter_readings 
                 WHERE reading_time > NOW() - INTERVAL '6 hours'
                 GROUP BY 1 ORDER BY 1",
        format: "time_series"
      }],
      fieldConfig: {
        defaults: {
          unit: "V",
          thresholds: {
            steps: [
              { value: 210, color: "red" },
              { value: 220, color: "yellow" },
              { value: 230, color: "green" },
              { value: 250, color: "yellow" },
              { value: 260, color: "red" }
            ]
          }
        }
      }
    }
  end
end
```

### 4.3 IBM Bridge Integration

```ruby
# app/services/ibm_bridge_integration_service.rb
class IbmBridgeIntegrationService
  def initialize
    @endpoint = ENV['IBM_BRIDGE_ENDPOINT']
    @api_key = Rails.application.credentials.dig(:ibm_bridge, :api_key)
  end
  
  def send_correlation_event(event)
    response = HTTParty.post(
      "#{@endpoint}/v1/events",
      headers: auth_headers,
      body: {
        source: 'red-energy-meters',
        event_type: event[:type],
        severity: event[:severity],
        timestamp: Time.current.iso8601,
        data: event[:data],
        correlation_id: event[:correlation_id]
      }.to_json
    )
    
    raise "IBM Bridge error: #{response.body}" unless response.success?
    
    response.parsed_response
  end
  
  def get_correlated_insights(asset_id, timeframe: '24h')
    response = HTTParty.get(
      "#{@endpoint}/v1/insights",
      headers: auth_headers,
      query: {
        asset_id: asset_id,
        timeframe: timeframe
      }
    )
    
    raise "IBM Bridge error: #{response.body}" unless response.success?
    
    response.parsed_response
  end
  
  private
  
  def auth_headers
    {
      'Authorization' => "Bearer #{@api_key}",
      'Content-Type' => 'application/json'
    }
  end
end
```

### Deliverables
- ✅ Data ingestion service processing 10K+ events/sec
- ✅ TimescaleDB hypertables with compression
- ✅ Redis real-time cache operational
- ✅ Grafana integration with 15+ dashboards
- ✅ IBM Bridge correlation events flowing
- ✅ Data quality validation pipeline

---

## 5. Phase 3: Observability Platform (Weeks 4-7)

### 5.1 Dashboard Generation

#### Auto-Generated Dashboards

| Dashboard | Purpose | Update Frequency |
|-----------|---------|------------------|
| **Grid Overview** | Network-wide health metrics | 30 seconds |
| **Substation Status** | Per-substation capacity & alerts | 1 minute |
| **Transformer Health** | Thermal, load, efficiency | 1 minute |
| **Power Quality** | Voltage, frequency, power factor | 30 seconds |
| **Customer Impact** | Customers affected by issues | 1 minute |
| **Demand Forecast** | 24-72 hour demand prediction | 15 minutes |
| **Anomaly Tracker** | Active anomalies and trends | 30 seconds |

### 5.2 Multi-Tier Alerting

```ruby
# app/services/alert_notification_service.rb
class AlertNotificationService
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
      # Log but don't fail - try other channels
      Rails.logger.error("Failed to notify via #{channel}: #{e.message}")
      escalate_notification_failure(alert, channel, e)
    end
    
    alert.update!(notified_at: Time.current, notification_channels: channels)
  end
  
  private
  
  def notify_teams(alert)
    TeamsWebhookClient.new.send_adaptive_card(
      title: "[#{alert.severity.upcase}] #{alert.title}",
      body: alert.description,
      facts: [
        { title: "Asset", value: alert.asset_name },
        { title: "Location", value: alert.location },
        { title: "Time", value: alert.detected_at.strftime("%Y-%m-%d %H:%M:%S") },
        { title: "Confidence", value: "#{alert.confidence}%" }
      ],
      actions: [
        { type: "OpenUrl", title: "View in Dashboard", url: alert.dashboard_url },
        { type: "OpenUrl", title: "Create Ticket", url: alert.servicenow_url }
      ]
    )
  end
  
  def notify_pagerduty(alert)
    PagerDutyClient.new.trigger_incident(
      routing_key: ENV['PAGERDUTY_ROUTING_KEY'],
      summary: alert.title,
      severity: alert.severity,
      source: "red-energy-meters",
      custom_details: alert.details
    )
  end
  
  def notify_email(alert)
    AlertMailer.alert_notification(alert).deliver_later
  end
  
  def escalate_notification_failure(alert, channel, error)
    Alert.create!(
      title: "Notification Failure: #{channel}",
      description: "Failed to send #{alert.id} via #{channel}: #{error.message}",
      severity: 'warning',
      source: 'notification_system'
    )
  end
end
```

### 5.3 ServiceNow Integration

```ruby
# app/services/servicenow_integration_service.rb
class ServiceNowIntegrationService
  def create_incident(alert)
    response = HTTParty.post(
      "#{base_url}/api/now/table/incident",
      headers: auth_headers,
      body: {
        short_description: alert.title,
        description: build_incident_description(alert),
        urgency: severity_to_urgency(alert.severity),
        impact: calculate_impact(alert),
        category: 'Network',
        subcategory: 'Grid Infrastructure',
        assignment_group: 'Grid Operations',
        caller_id: 'red-energy-meters-platform',
        correlation_id: alert.id.to_s
      }.to_json
    )
    
    raise "ServiceNow error: #{response.body}" unless response.success?
    
    ticket_number = response.parsed_response.dig('result', 'number')
    alert.update!(servicenow_ticket: ticket_number)
    
    ticket_number
  end
  
  private
  
  def build_incident_description(alert)
    <<~DESCRIPTION
      Alert ID: #{alert.id}
      Detected: #{alert.detected_at}
      Asset: #{alert.asset_name} (#{alert.asset_type})
      Location: #{alert.location}
      
      Description:
      #{alert.description}
      
      ML Confidence: #{alert.confidence}%
      Recommended Action: #{alert.recommended_action}
      
      Dashboard: #{alert.dashboard_url}
    DESCRIPTION
  end
  
  def severity_to_urgency(severity)
    { critical: 1, warning: 2, info: 3 }[severity.to_sym] || 3
  end
  
  def calculate_impact(alert)
    case alert.customers_affected
    when 0..100 then 3       # Low
    when 101..1000 then 2    # Medium
    else 1                   # High
    end
  end
end
```

### Deliverables
- ✅ 15+ auto-generated Grafana dashboards
- ✅ Multi-tier alerting (PagerDuty, Teams, Email)
- ✅ ServiceNow incident creation
- ✅ Alert de-duplication logic
- ✅ Real-time customer impact tracking
- ✅ Operations runbooks

---

## 6. Phase 4: Predictive Maintenance AI (Weeks 5-10)

### 6.1 Anomaly Detection Model

#### Model Specification

| Attribute | Value |
|-----------|-------|
| **Algorithm** | Isolation Forest + LSTM Ensemble |
| **Input Features** | voltage, current, power_factor, temperature, load_pct, time_features |
| **Output** | anomaly_score (0-1), is_anomaly (boolean) |
| **Training Data** | 12 months historical, ~4.2TB |
| **Retraining** | Weekly |
| **Inference Latency** | <100ms per reading |
| **Confidence Threshold** | 85% for alerting |

#### Training Pipeline

```python
# ml/training/anomaly_detection_training.py
import pandas as pd
from sklearn.ensemble import IsolationForest
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import mlflow

def train_anomaly_model(training_data_path: str) -> str:
    """Train ensemble anomaly detection model."""
    
    mlflow.start_run(run_name="anomaly_detection_training")
    
    # Load and preprocess data
    df = pd.read_parquet(training_data_path)
    features = engineer_features(df)
    
    # Train Isolation Forest for statistical anomalies
    iso_forest = IsolationForest(
        contamination=0.01,
        n_estimators=200,
        max_samples='auto',
        random_state=42
    )
    iso_forest.fit(features)
    
    # Train LSTM for temporal anomalies
    lstm_model = build_lstm_model(features.shape[1])
    lstm_model.fit(
        prepare_sequences(features),
        epochs=50,
        batch_size=256,
        validation_split=0.2
    )
    
    # Log metrics
    mlflow.log_metrics({
        "iso_forest_threshold": iso_forest.threshold_,
        "lstm_val_loss": lstm_model.history.history['val_loss'][-1]
    })
    
    # Save models
    model_path = save_ensemble_model(iso_forest, lstm_model)
    mlflow.log_artifact(model_path)
    
    mlflow.end_run()
    return model_path

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Engineer features for anomaly detection."""
    df['hour'] = df['reading_time'].dt.hour
    df['day_of_week'] = df['reading_time'].dt.dayofweek
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    df['voltage_deviation'] = abs(df['voltage'] - 230) / 230
    df['load_change_rate'] = df.groupby('meter_id')['consumption_kwh'].pct_change()
    df['rolling_mean_24h'] = df.groupby('meter_id')['consumption_kwh'].transform(
        lambda x: x.rolling(window=96, min_periods=1).mean()
    )
    df['deviation_from_rolling'] = abs(df['consumption_kwh'] - df['rolling_mean_24h']) / df['rolling_mean_24h']
    
    return df[FEATURE_COLUMNS].fillna(0)
```

#### Inference Service

```ruby
# app/services/anomaly_detection_service.rb
class AnomalyDetectionService
  CONFIDENCE_THRESHOLD = 0.85
  
  def initialize
    @ai_service = AiServiceFactory.for_anomaly_detection
  end
  
  def detect_anomalies(readings)
    return [] if readings.empty?
    
    # Prepare features
    features = prepare_features(readings)
    
    # Call ML model
    predictions = @ai_service.predict(
      model_name: 'anomaly-detection-ensemble',
      instances: features
    )
    
    # Process results
    anomalies = []
    readings.each_with_index do |reading, idx|
      score = predictions[idx]['anomaly_score']
      
      if score >= CONFIDENCE_THRESHOLD
        anomalies << create_anomaly_alert(reading, score, predictions[idx])
      elsif score >= 0.7
        # Monitor but don't alert yet
        reading.update!(quality_flag: 'monitoring')
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
        voltage_deviation: (r.voltage - 230).abs / 230.0,
        load_change_rate: calculate_load_change(r)
      }
    end
  end
  
  def create_anomaly_alert(reading, score, prediction)
    Alert.create!(
      title: "Anomaly Detected: #{prediction['anomaly_type']}",
      description: generate_description(reading, prediction),
      severity: score >= 0.95 ? 'critical' : 'warning',
      source: 'anomaly_detection_ml',
      confidence: (score * 100).round,
      asset_type: 'smart_meter',
      asset_id: reading.meter_id,
      asset_name: reading.smart_meter.meter_number,
      detected_at: Time.current,
      reading_data: reading.attributes,
      ml_prediction: prediction
    )
  end
end
```

### 6.2 Failure Prediction Model

#### Model Specification

| Attribute | Value |
|-----------|-------|
| **Algorithm** | Gradient Boosting + Time Series (Prophet) |
| **Prediction Window** | 48-72 hours ahead |
| **Target** | equipment_failure (binary), failure_time (continuous) |
| **Training Data** | 12 months + historical failure logs |
| **Accuracy Target** | 88% (validated in shadow mode) |

#### Prediction Service

```ruby
# app/services/failure_prediction_service.rb
class FailurePredictionService
  PREDICTION_HORIZON_HOURS = 72
  HIGH_RISK_THRESHOLD = 0.85
  
  def initialize
    @ai_service = AiServiceFactory.for_failure_prediction
  end
  
  def predict_failures(transformers)
    predictions = []
    
    transformers.each do |transformer|
      features = extract_transformer_features(transformer)
      
      prediction = @ai_service.predict(
        model_name: 'failure-prediction-gbm',
        instances: [features]
      ).first
      
      if prediction['failure_probability'] >= HIGH_RISK_THRESHOLD
        predictions << create_failure_prediction(transformer, prediction)
      end
    end
    
    # Auto-actions for very high confidence predictions
    predictions.select { |p| p.confidence >= 91 }.each do |prediction|
      trigger_automated_response(prediction)
    end
    
    predictions
  end
  
  def predict_for_asset(asset)
    # Single asset prediction with detailed breakdown
    features = extract_features_for_asset(asset)
    
    prediction = @ai_service.predict(
      model_name: 'failure-prediction-gbm',
      instances: [features],
      explain: true  # Return feature importance
    ).first
    
    Prediction.create!(
      asset: asset,
      prediction_type: 'equipment_failure',
      probability: prediction['failure_probability'],
      predicted_time: Time.current + prediction['time_to_failure_hours'].hours,
      confidence: prediction['confidence'],
      contributing_factors: prediction['feature_importance'],
      valid_until: Time.current + 24.hours
    )
  end
  
  private
  
  def trigger_automated_response(prediction)
    transformer = prediction.asset
    
    # Only auto-act if backup is available
    backup = transformer.backup_transformer
    return unless backup&.available?
    
    ActiveRecord::Base.transaction do
      # Shift load to backup
      LoadShiftingService.new.shift_to_backup(transformer, backup)
      
      # Create maintenance ticket
      ServiceNowIntegrationService.new.create_incident(
        Alert.create!(
          title: "Predicted Failure: #{transformer.name}",
          description: "ML prediction #{prediction.confidence}% confidence. Auto-shifted load to backup.",
          severity: 'critical',
          source: 'failure_prediction_ml',
          asset: transformer,
          recommended_action: 'Schedule proactive maintenance within 24 hours'
        )
      )
      
      # Update prediction with action taken
      prediction.update!(
        auto_action_taken: true,
        action_description: "Load shifted to #{backup.name}"
      )
    end
  end
  
  def extract_transformer_features(transformer)
    recent_readings = transformer.meter_readings.where(
      reading_time: 7.days.ago..Time.current
    )
    
    {
      age_years: transformer.age_years,
      load_utilization_avg: recent_readings.average(:load_pct),
      load_utilization_max: recent_readings.maximum(:load_pct),
      temperature_avg: recent_readings.average(:temperature),
      temperature_max: recent_readings.maximum(:temperature),
      anomaly_count_7d: transformer.anomalies.where(created_at: 7.days.ago..).count,
      maintenance_days_since: transformer.last_maintenance_days,
      efficiency_trend: calculate_efficiency_trend(transformer)
    }
  end
end
```

### 6.3 Automated Remediation

```ruby
# app/services/load_shifting_service.rb
class LoadShiftingService
  def shift_to_backup(primary_transformer, backup_transformer)
    raise "Backup not available" unless backup_transformer.available?
    raise "Backup capacity insufficient" unless backup_transformer.remaining_capacity >= primary_transformer.current_load
    
    # Record the shift
    LoadShiftEvent.create!(
      primary_transformer: primary_transformer,
      backup_transformer: backup_transformer,
      load_shifted_kw: primary_transformer.current_load,
      reason: 'predicted_failure',
      initiated_by: 'automated_ml_response'
    )
    
    # Send command to SCADA system
    ScadaIntegrationService.new.execute_load_shift(
      from: primary_transformer.scada_id,
      to: backup_transformer.scada_id
    )
    
    # Update transformer statuses
    primary_transformer.update!(status: 'maintenance_pending', current_load: 0)
    backup_transformer.update!(current_load: backup_transformer.current_load + primary_transformer.current_load)
    
    { success: true, load_shifted: primary_transformer.current_load }
  end
end
```

### Deliverables
- ✅ Anomaly detection model trained (88% accuracy)
- ✅ Failure prediction model trained (87% accuracy)
- ✅ Real-time inference service (<100ms latency)
- ✅ Automated load shifting for high-confidence predictions
- ✅ Shadow mode validation complete
- ✅ Human approval gates for critical actions

---

## 7. Phase 5: Customer Intelligence AI (Weeks 8-14)

### 7.1 Customer Segmentation

#### The 12 Customer Segments

```ruby
# app/models/customer_segment.rb
class CustomerSegment < ApplicationRecord
  SEGMENTS = {
    early_morning_industrial: {
      description: "Peak usage 4am-8am, high base load",
      peak_hours: (4..8).to_a,
      percentage: 3,
      opportunity: "Off-peak incentives"
    },
    business_hours_commercial: {
      description: "Peak usage 9am-5pm, weekday patterns",
      peak_hours: (9..17).to_a,
      percentage: 8,
      opportunity: "Demand response contracts"
    },
    evening_residential_peak: {
      description: "Peak usage 6pm-10pm, cooking/entertainment",
      peak_hours: (18..22).to_a,
      percentage: 22,
      opportunity: "Time-shift recommendations"
    },
    solar_battery_households: {
      description: "Self-generation day, grid at night",
      percentage: 7,
      opportunity: "Virtual power plant participation"
    },
    ev_charging_households: {
      description: "Evening charging spikes 6pm-11pm",
      percentage: 9,
      opportunity: "Smart charging schedules"
    },
    efficiency_optimizers: {
      description: "Below-average, flat profiles",
      percentage: 5,
      opportunity: "Loyalty rewards, referrals"
    },
    high_consumption_all_day: {
      description: "Medical equipment, home businesses",
      percentage: 6,
      opportunity: "Premium service tiers"
    },
    seasonal_variation_heavy: {
      description: "Summer HVAC, winter heating",
      percentage: 12,
      opportunity: "Seasonal rate plans"
    },
    weekend_shift_users: {
      description: "Higher weekend than weekday",
      percentage: 8,
      opportunity: "Weekend off-peak rates"
    },
    night_owl_households: {
      description: "Late-night usage 10pm-2am",
      percentage: 6,
      opportunity: "Super off-peak incentives"
    },
    retired_home_all_day: {
      description: "Consistent all-day moderate usage",
      percentage: 9,
      opportunity: "Daytime solar plans"
    },
    low_use_minimal: {
      description: "Below 3kWh/day average",
      percentage: 5,
      opportunity: "Low-use discounts"
    }
  }.freeze
  
  def self.segment_customer(customer)
    features = extract_customer_features(customer)
    
    # Use ML model for segmentation
    prediction = AiServiceFactory.for_customer_segmentation.predict(
      model_name: 'customer-segmentation-kmeans',
      instances: [features]
    ).first
    
    segment_key = prediction['cluster_label'].to_sym
    segment = SEGMENTS[segment_key]
    
    customer.update!(
      segment_id: segment_key,
      segment_confidence: prediction['confidence'],
      last_segmented_at: Time.current
    )
    
    segment_key
  end
  
  private
  
  def self.extract_customer_features(customer)
    readings = customer.meter_readings.where(reading_time: 90.days.ago..)
    
    hourly_profile = (0..23).map do |hour|
      readings.where("EXTRACT(HOUR FROM reading_time) = ?", hour).average(:consumption_kwh) || 0
    end
    
    {
      avg_daily_kwh: readings.group("DATE(reading_time)").average(:consumption_kwh).values.mean,
      max_demand_kw: readings.maximum(:demand_kw),
      peak_hour: hourly_profile.each_with_index.max[1],
      weekend_ratio: calculate_weekend_ratio(readings),
      solar_generation: customer.solar_installed?,
      ev_charging: customer.ev_charging?,
      seasonal_variance: calculate_seasonal_variance(readings),
      hourly_profile: hourly_profile
    }
  end
end
```

### 7.2 Demand Forecasting

#### Model Specification

| Attribute | Value |
|-----------|-------|
| **Algorithm** | Prophet + Neural Network Ensemble |
| **Forecast Horizon** | 24-72 hours |
| **Granularity** | 15-minute intervals |
| **Accuracy Target** | 95% within 5% margin |
| **Inputs** | Historical patterns, weather, events, day-of-week |

#### Forecasting Service

```ruby
# app/services/demand_forecasting_service.rb
class DemandForecastingService
  def initialize
    @ai_service = AiServiceFactory.for_demand_forecasting
  end
  
  def forecast_demand(horizon_hours: 72)
    # Gather inputs
    historical_data = get_historical_demand(30.days)
    weather_forecast = WeatherService.new.get_forecast(horizon_hours)
    upcoming_events = Event.where(start_time: Time.current..horizon_hours.hours.from_now)
    
    # Generate forecast
    forecast = @ai_service.predict(
      model_name: 'demand-forecast-ensemble',
      instances: [{
        historical: historical_data,
        weather: weather_forecast,
        events: upcoming_events.map(&:to_forecast_input),
        forecast_start: Time.current.iso8601,
        forecast_end: horizon_hours.hours.from_now.iso8601
      }]
    ).first
    
    # Store predictions
    forecast['predictions'].each do |prediction|
      DemandForecast.create!(
        timestamp: Time.parse(prediction['time']),
        predicted_demand_mw: prediction['demand_mw'],
        confidence_lower: prediction['confidence_interval']['lower'],
        confidence_upper: prediction['confidence_interval']['upper'],
        contributing_factors: prediction['factors']
      )
    end
    
    forecast
  end
  
  def get_peak_demand_forecast(date)
    forecasts = DemandForecast.where(
      timestamp: date.beginning_of_day..date.end_of_day
    )
    
    peak_forecast = forecasts.order(predicted_demand_mw: :desc).first
    
    {
      peak_time: peak_forecast.timestamp,
      peak_demand_mw: peak_forecast.predicted_demand_mw,
      confidence_range: {
        lower: peak_forecast.confidence_lower,
        upper: peak_forecast.confidence_upper
      }
    }
  end
end
```

### 7.3 Personalized Recommendation Engine

```ruby
# app/services/recommendation_engine_service.rb
class RecommendationEngineService
  def initialize
    @ai_service = AiServiceFactory.for_customer_insights
  end
  
  def generate_recommendations(customer)
    segment = CustomerSegment.find_by(key: customer.segment_id)
    usage_patterns = analyze_usage_patterns(customer)
    
    # Generate AI-powered personalized recommendations
    prompt = build_recommendation_prompt(customer, segment, usage_patterns)
    
    ai_response = @ai_service.query(
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 1000
    )
    
    recommendations = parse_recommendations(ai_response)
    
    # Calculate savings for each recommendation
    recommendations.each do |rec|
      rec[:estimated_savings] = calculate_savings(customer, rec)
    end
    
    # Store recommendations
    recommendations.each do |rec|
      CustomerRecommendation.create!(
        customer: customer,
        recommendation_type: rec[:type],
        title: rec[:title],
        description: rec[:description],
        estimated_monthly_savings: rec[:estimated_savings],
        priority: rec[:priority],
        valid_until: 30.days.from_now
      )
    end
    
    recommendations
  end
  
  private
  
  def build_recommendation_prompt(customer, segment, patterns)
    <<~PROMPT
      Generate personalized energy-saving recommendations for this Red Energy customer:
      
      Customer Profile:
      - Segment: #{segment.description}
      - Average daily usage: #{patterns[:avg_daily_kwh]} kWh
      - Peak usage time: #{patterns[:peak_hour]}:00
      - Has solar: #{customer.solar_installed?}
      - Has EV: #{customer.ev_charging?}
      - Current tariff: #{customer.tariff_type}
      
      Usage Patterns:
      - Highest usage appliance window: #{patterns[:high_usage_windows].join(', ')}
      - Weekend vs weekday ratio: #{patterns[:weekend_ratio]}
      - Seasonal variation: #{patterns[:seasonal_variance]}
      
      Generate 3 specific, actionable recommendations with:
      1. Clear action to take
      2. Estimated monthly savings in AUD
      3. Why this works for their profile
      
      Format as JSON array with keys: type, title, description, priority (high/medium/low)
    PROMPT
  end
  
  def calculate_savings(customer, recommendation)
    base_cost = customer.average_monthly_bill
    
    case recommendation[:type]
    when 'time_shift'
      # Calculate savings from shifting to off-peak
      off_peak_rate = 0.15  # $/kWh
      peak_rate = 0.35       # $/kWh
      shiftable_kwh = estimate_shiftable_usage(customer)
      (peak_rate - off_peak_rate) * shiftable_kwh * 30
    when 'demand_response'
      # Average demand response payment
      12.0  # Fixed monthly credit for participation
    when 'tariff_optimization'
      # Compare with optimal tariff
      TariffOptimizationService.new.calculate_savings(customer)
    else
      base_cost * 0.05  # Default 5% savings estimate
    end
  end
end
```

### 7.4 Demand Response Program

```ruby
# app/services/demand_response_service.rb
class DemandResponseService
  def trigger_demand_response_event(forecast)
    return unless forecast.predicted_demand_mw > grid_capacity_threshold
    
    event = DemandResponseEvent.create!(
      event_type: 'critical_peak',
      start_time: forecast.peak_start_time,
      end_time: forecast.peak_end_time,
      target_reduction_mw: forecast.predicted_demand_mw - grid_capacity_threshold,
      status: 'pending'
    )
    
    # Find eligible customers
    eligible_customers = Customer.where(demand_response_opted_in: true)
                                  .joins(:customer_segment)
                                  .where(customer_segments: { key: eligible_segments })
    
    # Generate personalized alerts
    eligible_customers.find_each do |customer|
      alert = generate_personalized_alert(customer, event)
      
      DemandResponseParticipation.create!(
        event: event,
        customer: customer,
        alert_sent_at: Time.current,
        alert_content: alert,
        incentive_amount: calculate_incentive(customer)
      )
      
      # Send notification
      CustomerNotificationService.new.send_demand_response_alert(customer, alert)
    end
    
    event.update!(status: 'active', customers_notified: eligible_customers.count)
    
    event
  end
  
  private
  
  def generate_personalized_alert(customer, event)
    segment = customer.customer_segment
    typical_usage = customer.typical_usage_during(event.start_time, event.end_time)
    
    {
      greeting: "Hi #{customer.first_name}! 👋",
      headline: "Tomorrow will be hot. Help us keep the grid stable and earn $#{calculate_incentive(customer)}!",
      suggestion: segment_specific_suggestion(segment),
      time_window: "#{event.start_time.strftime('%l:%M %p')} - #{event.end_time.strftime('%l:%M %p')}",
      incentive: "$#{calculate_incentive(customer)} bill credit",
      cta_primary: "I'm In!",
      cta_secondary: "Remind Me Later"
    }
  end
  
  def segment_specific_suggestion(segment)
    case segment.key.to_sym
    when :evening_residential_peak
      "Pre-cool your home before 5pm, then raise the thermostat 2°C during peak."
    when :ev_charging_households
      "Delay your EV charging until after 9pm when demand drops."
    when :solar_battery_households
      "Use your battery during peak hours instead of exporting to the grid."
    else
      "Reduce your usage during peak hours by turning off non-essential appliances."
    end
  end
  
  def calculate_incentive(customer)
    base_incentive = 8.0
    multipliers = {
      solar_battery_households: 1.5,  # Can provide grid services
      ev_charging_households: 1.3,    # Flexible load
      high_consumption_all_day: 1.2   # Larger impact potential
    }
    
    multiplier = multipliers[customer.segment_id.to_sym] || 1.0
    (base_incentive * multiplier).round(2)
  end
end
```

### Deliverables
- ✅ Customer segmentation model (12 segments, 94% accuracy)
- ✅ Demand forecasting (96% accuracy within 5% margin)
- ✅ Personalized recommendation engine
- ✅ Demand response program infrastructure
- ✅ Customer notification system (Email, SMS, App)
- ✅ Incentive calculation and tracking

---

## 8. Phase 6: Integration & Testing (Weeks 12-16)

### 8.1 Integration Test Suite

```ruby
# test/integration/full_workflow_test.rb
require 'test_helper'

class FullWorkflowTest < ActiveSupport::TestCase
  def setup
    @transformer = transformers(:transformer_247)
    @customer = customers(:sarah_thompson)
    EnvironmentMode.set_mode(:sandbox)
  end
  
  test "complete anomaly detection to alert workflow" do
    # 1. Ingest anomalous reading
    reading = MeterReading.create!(
      meter_id: @transformer.primary_meter.id,
      reading_time: Time.current,
      voltage: 195,  # Low voltage - anomaly
      consumption_kwh: 150,
      power_factor: 0.92
    )
    
    # 2. Run anomaly detection
    service = AnomalyDetectionService.new
    anomalies = service.detect_anomalies([reading])
    
    assert_equal 1, anomalies.size
    assert anomalies.first.confidence >= 85
    
    # 3. Verify alert created
    alert = Alert.find_by(source: 'anomaly_detection_ml', asset_id: reading.meter_id)
    assert alert.present?
    assert_equal 'warning', alert.severity
    
    # 4. Verify notification sent
    assert alert.notified_at.present?
  end
  
  test "complete failure prediction to automated response workflow" do
    # 1. Create conditions that predict failure
    create_failure_indicators(@transformer)
    
    # 2. Run failure prediction
    service = FailurePredictionService.new
    predictions = service.predict_failures([@transformer])
    
    assert_equal 1, predictions.size
    assert predictions.first.confidence >= 91
    
    # 3. Verify automated load shift
    @transformer.reload
    assert_equal 'maintenance_pending', @transformer.status
    
    # 4. Verify ServiceNow ticket created
    assert @transformer.alerts.last.servicenow_ticket.present?
  end
  
  test "complete customer segmentation to recommendation workflow" do
    # 1. Segment customer
    CustomerSegment.segment_customer(@customer)
    
    assert_equal :evening_residential_peak, @customer.reload.segment_id.to_sym
    
    # 2. Generate recommendations
    service = RecommendationEngineService.new
    recommendations = service.generate_recommendations(@customer)
    
    assert recommendations.size >= 3
    assert recommendations.all? { |r| r[:estimated_savings] > 0 }
    
    # 3. Verify stored
    assert_equal recommendations.size, @customer.customer_recommendations.count
  end
  
  test "demand response event end-to-end" do
    # 1. Create high demand forecast
    forecast = DemandForecast.create!(
      timestamp: 1.day.from_now.change(hour: 18),
      predicted_demand_mw: 2600,  # Above threshold
      confidence_lower: 2500,
      confidence_upper: 2700
    )
    
    # 2. Trigger demand response
    service = DemandResponseService.new
    event = service.trigger_demand_response_event(forecast)
    
    assert event.present?
    assert event.customers_notified > 0
    
    # 3. Verify customer received alert
    participation = DemandResponseParticipation.find_by(
      event: event,
      customer: @customer
    )
    
    assert participation.present?
    assert participation.alert_sent_at.present?
    assert participation.incentive_amount > 0
  end
end
```

### 8.2 Performance Testing

```ruby
# test/performance/load_test.rb
require 'test_helper'
require 'benchmark'

class LoadTest < ActiveSupport::TestCase
  test "ingestion handles 10000 readings per second" do
    readings = 10000.times.map do
      {
        meter_id: rand(1..1_200_000),
        reading_time: Time.current,
        voltage: rand(220..240),
        consumption_kwh: rand(0.1..5.0).round(4),
        power_factor: rand(0.8..1.0).round(4)
      }
    end
    
    time = Benchmark.realtime do
      MeterDataIngestionService.new.process_batch(readings)
    end
    
    throughput = 10000 / time
    assert throughput >= 10000, "Throughput #{throughput.round} is below 10000/sec target"
  end
  
  test "anomaly detection inference under 100ms" do
    readings = MeterReading.order('RANDOM()').limit(100)
    
    times = readings.map do |reading|
      Benchmark.realtime do
        AnomalyDetectionService.new.detect_anomalies([reading])
      end * 1000  # Convert to ms
    end
    
    avg_time = times.sum / times.size
    p95_time = times.sort[(times.size * 0.95).to_i]
    
    assert avg_time < 50, "Average inference time #{avg_time.round}ms exceeds 50ms"
    assert p95_time < 100, "P95 inference time #{p95_time.round}ms exceeds 100ms"
  end
  
  test "dashboard query performance under 500ms" do
    # Test the main dashboard queries
    queries = [
      -> { MeterReading.where(reading_time: 6.hours.ago..).average(:voltage) },
      -> { Alert.where(created_at: 24.hours.ago..).group(:severity).count },
      -> { Transformer.includes(:recent_readings).where(status: 'warning').count }
    ]
    
    queries.each_with_index do |query, idx|
      time = Benchmark.realtime { query.call } * 1000
      assert time < 500, "Query #{idx} took #{time.round}ms, exceeds 500ms target"
    end
  end
end
```

### 8.3 Test Coverage Requirements

Per PRINCIPLES.md:
- **80% code coverage minimum**
- Test results saved to `test/results/`
- Never commit with known test failures

```bash
# Run full test suite with coverage
~/.rbenv/shims/ruby ./bin/rails test > test/results/test_results_$(date +%Y%m%d_%H%M%S).txt 2>&1

# Check coverage
grep "Coverage" test/results/test_results_latest.txt
# Target: 80%+ line coverage
```

### Deliverables
- ✅ Integration tests for all 3 workflows
- ✅ Performance tests meeting targets
- ✅ 80%+ code coverage achieved
- ✅ All test results saved to files
- ✅ No known linter errors or test failures

---

## 9. Phase 7: Production Deployment (Weeks 15-18)

### 9.1 Production Environment Setup

#### Azure Resources (Production Tier)

| Resource | Dev Tier | Production Tier | Monthly Cost |
|----------|----------|-----------------|--------------|
| PostgreSQL | B2s Burstable | D4s General Purpose + HA | $450 |
| Container Apps | Consumption | 3-10 replicas | $400 |
| Azure OpenAI | S0 | S0 (higher TPM) | $1,500 |
| Azure AI Search | Standard | Standard (3 replicas) | $840 |
| Redis Cache | Basic | Standard (6GB) | $150 |
| Storage | LRS | GRS | $100 |
| **Total** | | | **$3,440/month** |

### 9.2 Production Checklist

#### Infrastructure
- [ ] Production resource group created
- [ ] VNet with proper subnet sizing
- [ ] PostgreSQL HA enabled
- [ ] Automated backups verified
- [ ] Key Vault secrets rotated
- [ ] SSL/TLS certificates installed
- [ ] WAF configured (if using App Gateway)

#### Application
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Redis cluster operational
- [ ] Background job workers running
- [ ] Health check endpoints responding
- [ ] Logging to Application Insights

#### Monitoring
- [ ] Dashboard alerts configured
- [ ] PagerDuty integration tested
- [ ] Runbooks documented
- [ ] On-call rotation established

#### Security
- [ ] Penetration testing completed
- [ ] Security review passed
- [ ] AEMO compliance verified
- [ ] Privacy impact assessment done

### 9.3 Rollout Plan

```
Week 15: Shadow Mode (10% traffic)
├── Deploy ML models in shadow mode
├── Compare predictions vs actuals
├── Tune confidence thresholds
└── No automated actions

Week 16: Pilot (25% traffic + select customers)
├── Enable automated alerting
├── Pilot demand response with 5,000 customers
├── Manual approval for automated actions
└── Gather feedback

Week 17: Expanded Rollout (75% traffic)
├── Enable automated load shifting
├── Expand demand response to 30,000 customers
├── Monitor performance metrics
└── Address issues

Week 18: Full Production (100%)
├── All features enabled
├── Continuous monitoring
├── Performance optimization
└── Customer feedback integration
```

### Deliverables
- ✅ Production environment operational
- ✅ Shadow mode validation successful
- ✅ Pilot with 5,000 customers complete
- ✅ Full production deployment
- ✅ Operations team trained

---

## 10. Database Architecture

### Complete Schema

```sql
-- SMART METER DATA --

-- Meter readings (TimescaleDB hypertable)
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

-- Smart meters
CREATE TABLE smart_meters (
  id BIGSERIAL PRIMARY KEY,
  meter_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id BIGINT REFERENCES customers(id),
  transformer_id BIGINT REFERENCES transformers(id),
  meter_type VARCHAR(30),
  status VARCHAR(20) DEFAULT 'active',
  installed_at TIMESTAMPTZ,
  last_reading_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GRID INFRASTRUCTURE --

-- Transformers
CREATE TABLE transformers (
  id BIGSERIAL PRIMARY KEY,
  transformer_number VARCHAR(50) UNIQUE NOT NULL,
  substation_id BIGINT REFERENCES substations(id),
  backup_transformer_id BIGINT REFERENCES transformers(id),
  capacity_kva DECIMAL(10,2),
  current_load_kva DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'operational',
  age_years DECIMAL(4,1),
  last_maintenance_at TIMESTAMPTZ,
  scada_id VARCHAR(50),
  location_lat DECIMAL(10,7),
  location_lng DECIMAL(10,7),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Substations
CREATE TABLE substations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity_mva DECIMAL(10,2),
  current_load_mva DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'operational',
  location_lat DECIMAL(10,7),
  location_lng DECIMAL(10,7),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CUSTOMERS --

-- Customer profiles (anonymized)
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  customer_hash VARCHAR(64) UNIQUE NOT NULL,
  segment_id VARCHAR(30),
  segment_confidence DECIMAL(5,2),
  tariff_type VARCHAR(30),
  connection_type VARCHAR(30),
  solar_installed BOOLEAN DEFAULT FALSE,
  battery_installed BOOLEAN DEFAULT FALSE,
  ev_charging BOOLEAN DEFAULT FALSE,
  demand_response_opted_in BOOLEAN DEFAULT FALSE,
  consent_given_at TIMESTAMPTZ,
  preferences JSONB,
  last_segmented_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer segments reference
CREATE TABLE customer_segments (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  peak_hours INTEGER[],
  percentage DECIMAL(5,2),
  opportunity TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer recommendations
CREATE TABLE customer_recommendations (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id),
  recommendation_type VARCHAR(50),
  title VARCHAR(200),
  description TEXT,
  estimated_monthly_savings DECIMAL(10,2),
  priority VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending',
  acted_on_at TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ML & PREDICTIONS --

-- Predictions
CREATE TABLE predictions (
  id BIGSERIAL PRIMARY KEY,
  asset_type VARCHAR(50) NOT NULL,
  asset_id BIGINT NOT NULL,
  prediction_type VARCHAR(50) NOT NULL,
  probability DECIMAL(5,4),
  predicted_time TIMESTAMPTZ,
  confidence DECIMAL(5,2),
  contributing_factors JSONB,
  auto_action_taken BOOLEAN DEFAULT FALSE,
  action_description TEXT,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demand forecasts
CREATE TABLE demand_forecasts (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  predicted_demand_mw DECIMAL(10,2),
  confidence_lower DECIMAL(10,2),
  confidence_upper DECIMAL(10,2),
  contributing_factors JSONB,
  actual_demand_mw DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALERTS & EVENTS --

-- Alerts
CREATE TABLE alerts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  severity VARCHAR(20) NOT NULL,
  source VARCHAR(50),
  confidence INTEGER,
  asset_type VARCHAR(50),
  asset_id BIGINT,
  asset_name VARCHAR(100),
  detected_at TIMESTAMPTZ,
  notified_at TIMESTAMPTZ,
  notification_channels VARCHAR(50)[],
  resolved_at TIMESTAMPTZ,
  resolved_by VARCHAR(100),
  servicenow_ticket VARCHAR(50),
  reading_data JSONB,
  ml_prediction JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demand response events
CREATE TABLE demand_response_events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  target_reduction_mw DECIMAL(10,2),
  actual_reduction_mw DECIMAL(10,2),
  customers_notified INTEGER,
  customers_participated INTEGER,
  total_incentives_paid DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demand response participation
CREATE TABLE demand_response_participations (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES demand_response_events(id),
  customer_id BIGINT REFERENCES customers(id),
  alert_sent_at TIMESTAMPTZ,
  alert_content JSONB,
  responded_at TIMESTAMPTZ,
  participated BOOLEAN,
  usage_reduction_kwh DECIMAL(10,4),
  incentive_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT --

-- Audit log
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  auditable_type VARCHAR(50),
  auditable_id BIGINT,
  action VARCHAR(20),
  changes JSONB,
  user_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES --

CREATE INDEX idx_readings_meter_time ON meter_readings (meter_id, reading_time DESC);
CREATE INDEX idx_readings_quality ON meter_readings (quality_flag) WHERE quality_flag != 'normal';
CREATE INDEX idx_customers_segment ON customers (segment_id);
CREATE INDEX idx_alerts_severity ON alerts (severity, created_at DESC);
CREATE INDEX idx_alerts_asset ON alerts (asset_type, asset_id);
CREATE INDEX idx_predictions_asset ON predictions (asset_type, asset_id, created_at DESC);
CREATE INDEX idx_forecasts_timestamp ON demand_forecasts (timestamp);
```

---

## 11. API Design

### API Endpoints

Following PRINCIPLES.md: **Routes are LEAN (5-10 lines)**

#### Meters API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/meters` | List meters (paginated) |
| GET | `/api/v1/meters/:id` | Get meter details |
| GET | `/api/v1/meters/:id/readings` | Get meter readings |
| POST | `/api/v1/meters/:id/readings` | Submit reading (batch) |

#### Predictions API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/predictions` | List active predictions |
| GET | `/api/v1/predictions/:id` | Get prediction details |
| POST | `/api/v1/transformers/:id/predict` | Trigger prediction |

#### Alerts API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/alerts` | List alerts (filtered) |
| GET | `/api/v1/alerts/:id` | Get alert details |
| PUT | `/api/v1/alerts/:id/resolve` | Resolve alert |

#### Customers API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/customers/:hash` | Get customer profile |
| GET | `/api/v1/customers/:hash/recommendations` | Get recommendations |
| POST | `/api/v1/customers/:hash/segment` | Trigger segmentation |

#### Demand Response API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/demand-response/events` | List DR events |
| POST | `/api/v1/demand-response/events` | Create DR event |
| POST | `/api/v1/demand-response/events/:id/participate` | Customer participation |

#### Analytics API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/analytics/grid-health` | Grid health metrics |
| GET | `/api/v1/analytics/demand-forecast` | Demand forecast |
| GET | `/api/v1/analytics/segment-distribution` | Customer segments |

---

## 12. ML Model Specifications

### Model Inventory

| Model | Algorithm | Training Data | Accuracy | Latency | Retrain Frequency |
|-------|-----------|---------------|----------|---------|-------------------|
| **Anomaly Detection** | Isolation Forest + LSTM | 12mo readings | 88% | <100ms | Weekly |
| **Failure Prediction** | Gradient Boosting | 12mo + failures | 87% | <200ms | Monthly |
| **Customer Segmentation** | K-means + Hierarchical | 90 days usage | 94% | <500ms | Monthly |
| **Demand Forecasting** | Prophet + Neural Network | 24mo demand | 96% | <1s | Daily |
| **Recommendation Engine** | Collaborative Filtering | Approvals | N/A | <500ms | Weekly |

### Model Deployment

```yaml
# config/ml_models.yml
anomaly_detection:
  model_name: "anomaly-detection-ensemble"
  version: "1.2.0"
  endpoint: "https://ml-redenergy-meters.azureml.net/score"
  confidence_threshold: 0.85
  features:
    - voltage
    - current
    - power_factor
    - consumption
    - hour
    - day_of_week
    - voltage_deviation
    - load_change_rate

failure_prediction:
  model_name: "failure-prediction-gbm"
  version: "1.0.3"
  endpoint: "https://ml-redenergy-meters.azureml.net/score"
  high_risk_threshold: 0.85
  prediction_horizon_hours: 72

customer_segmentation:
  model_name: "customer-segmentation-kmeans"
  version: "2.1.0"
  endpoint: "https://ml-redenergy-meters.azureml.net/score"
  n_clusters: 12
  min_data_points: 1000

demand_forecasting:
  model_name: "demand-forecast-ensemble"
  version: "1.5.0"
  endpoint: "https://ml-redenergy-meters.azureml.net/score"
  forecast_horizons: [24, 48, 72]
  granularity_minutes: 15
```

---

## 13. Security & Compliance

### Security Architecture

#### Data Classification

| Data Type | Classification | Encryption | Access |
|-----------|---------------|------------|--------|
| Meter readings | Internal | At rest + Transit | Grid Operations |
| Customer PII | Confidential | At rest + Transit | Authorized only |
| ML predictions | Internal | Transit | Operations + Analytics |
| API keys | Secret | Key Vault | Service principals only |

#### Authentication & Authorization

```ruby
# app/middleware/authentication.rb
module Middleware
  class Authentication
    def initialize(app)
      @app = app
    end
    
    def call(env)
      request = Rack::Request.new(env)
      
      # Skip auth for health checks
      return @app.call(env) if request.path == '/health'
      
      token = extract_token(request)
      raise AuthenticationError, "Missing token" unless token
      
      claims = validate_azure_ad_token(token)
      env['current_user'] = claims
      
      @app.call(env)
    rescue AuthenticationError => e
      [401, {'Content-Type' => 'application/json'}, 
       [{ error: 'Unauthorized', message: e.message }.to_json]]
    end
    
    private
    
    def validate_azure_ad_token(token)
      # Validate against Azure AD
      AzureAdValidator.new.validate(token)
    end
  end
end
```

#### AEMO Compliance

- **Reliability Standards:** Automated reporting of outage metrics
- **Demand Response:** Compliance with AEMO guidelines
- **Data Retention:** 24 months as required
- **Audit Trail:** Complete logging of all grid operations

---

## 14. Monitoring & Operations

### Key Metrics Dashboard

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Data ingestion rate | 10,000/sec | <8,000/sec |
| Anomaly detection latency | <100ms | >200ms |
| Prediction accuracy | >85% | <80% |
| API response time (p95) | <500ms | >1s |
| System uptime | 99.9% | <99.5% |
| Alert notification latency | <30s | >60s |

### Runbooks

#### Runbook: High Anomaly Volume

```markdown
## Trigger
Anomaly count > 100 in 5 minutes

## Investigation
1. Check Grafana dashboard for patterns
2. Query: SELECT meter_id, COUNT(*) FROM alerts WHERE created_at > NOW() - INTERVAL '5 min' GROUP BY 1 ORDER BY 2 DESC LIMIT 10
3. Identify affected substation/transformer

## Actions
- If localized: Likely equipment issue → Create ServiceNow ticket
- If widespread: Likely data quality issue → Check ingestion pipeline
- If weather-related: Expected → Adjust thresholds temporarily

## Escalation
If > 500 anomalies or customer impact: Page Grid Operations Manager
```

---

## 15. Cost Estimates

### Monthly Operating Costs (Production)

| Category | Service | Monthly Cost (AUD) |
|----------|---------|-------------------|
| **Compute** | Container Apps (API + Workers) | $400 |
| **Database** | PostgreSQL Flexible (D4s + HA) | $450 |
| **Cache** | Redis Standard | $150 |
| **AI/ML** | Azure OpenAI (GPT-4 + Embeddings) | $1,500 |
| **AI/ML** | Azure ML (Training + Inference) | $800 |
| **Search** | Azure AI Search (Standard) | $840 |
| **Storage** | Blob Storage (GRS) | $100 |
| **Monitoring** | Log Analytics + App Insights | $200 |
| **Networking** | Egress + Private Endpoints | $100 |
| **Backup** | Database + Storage | $50 |
| **TOTAL** | | **$4,590/month** |

### Annual Cost Summary

| Item | Annual Cost |
|------|-------------|
| Platform Infrastructure | $55,080 |
| Software Licenses (Grafana, etc.) | $15,000 |
| Personnel (allocated) | $400,000 |
| **Total Investment** | **$470,080** |
| **Annual Benefit** | **$23,840,000** |
| **ROI** | **5,072%** |

---

## 16. Risk Management

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| ML model accuracy degradation | Medium | High | Continuous monitoring, automated retraining |
| Data pipeline failure | Low | High | Multi-region redundancy, circuit breakers |
| Azure service outage | Low | High | Multi-region deployment, local caching |
| Smart meter data quality | Medium | Medium | Validation pipeline, anomaly flagging |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Customer privacy concerns | Medium | High | Anonymization, opt-in model, transparency |
| Regulatory changes (AEMO) | Medium | Medium | Flexible platform, compliance monitoring |
| False positive predictions | Medium | Medium | High confidence thresholds, human approval |
| Staff resistance to automation | Low | Medium | Training, change management, demonstrate value |

---

## 17. Success Criteria

### Grid Reliability

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Unplanned outages | 12/month | <4/month | Monthly count |
| MTTR | 4.5 hours | <2.2 hours | Average per incident |
| Prediction accuracy | 0% | >85% | Predicted vs actual |
| Early warning time | 0 hours | 48-72 hours | Time before failure |

### Customer Engagement

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Recommendation engagement | 2% | >25% | Click-through rate |
| Demand response participation | 0% | >20% | Event participation |
| Customer satisfaction | N/A | >90% | Survey response |
| Peak demand reduction | 0% | >15% | MW reduction |

### Financial

| Metric | Target | Measurement |
|--------|--------|-------------|
| Outage cost savings | >$10M/year | Avoided compensation |
| Peak demand savings | >$6M/year | Wholesale cost reduction |
| Net annual benefit | >$20M/year | Total savings - costs |
| ROI | >400% | Benefit / Investment |

---

## Appendix A: Team Structure

### Recommended Team

| Role | Count | Responsibilities |
|------|-------|------------------|
| **Tech Lead** | 1 | Architecture, code review, technical decisions |
| **Backend Engineers** | 2 | API development, integrations, services |
| **ML Engineers** | 2 | Model training, deployment, monitoring |
| **Data Engineers** | 1 | Pipeline development, data quality |
| **Frontend Engineers** | 1 | React dashboard, customer portal |
| **DevOps Engineers** | 1 | Infrastructure, CI/CD, monitoring |
| **QA Engineer** | 1 | Testing, quality assurance |
| **Total** | 9 | |

---

## Appendix B: Key Contacts

| Role | Name | Email |
|------|------|-------|
| Project Lead | Jim Freeman | jim.freeman@kyndryl.com |
| Red Energy Sponsor | TBD | TBD |
| AEMO Liaison | TBD | TBD |

---

## Appendix C: Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 26, 2025 | Jim Freeman | Initial implementation plan |

---

**End of Implementation Plan**

