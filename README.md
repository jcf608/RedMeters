# Red Energy Smart Meter Analytics Platform

A budget-friendly ML analytics platform for electric smart meter data. Runs locally on your Mac with Azure data services (PostgreSQL and Blob Storage).

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR MAC (Free)                          │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  Sinatra API    │  │  React Frontend │                  │
│  │  localhost:4567 │  │  localhost:5173 │                  │
│  └────────┬────────┘  └─────────────────┘                  │
│           │                                                 │
│  ┌────────┴────────┐                                       │
│  │  ML Models      │                                       │
│  │  (Python)       │                                       │
│  └─────────────────┘                                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                 AZURE (East Asia Region)                    │
│  PostgreSQL Flexible Server + Blob Storage                  │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

```bash
# Install required tools (macOS)
brew install rbenv ruby-build node@20 python@3.11 postgresql@14

# Install Ruby 3.2
rbenv install 3.2.0
rbenv global 3.2.0
```

### Setup

```bash
# 1. Install Ruby dependencies
bundle install

# 2. Copy environment template and configure
cp env.example.template .env
# Edit .env with your Azure PostgreSQL credentials

# 3. Create database and run migrations
bundle exec rake db:create
bundle exec rake db:migrate

# 4. (Optional) Load seed data
bundle exec rake db:seed

# 5. Start the API server
bundle exec rackup -p 4567
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/meters` | List meters |
| GET | `/api/v1/meters/:id` | Get meter details |
| GET | `/api/v1/meters/:id/readings` | Get meter readings |
| GET | `/api/v1/predictions` | List predictions |
| POST | `/api/v1/predictions/anomalies` | Run anomaly detection |
| GET | `/api/v1/customers` | List customers |
| GET | `/api/v1/analytics/overview` | Dashboard stats |
| GET | `/api/v1/analytics/grid-health` | Grid health metrics |
| GET | `/api/v1/alerts` | List alerts |

## ML Models

The platform includes 4 ML models (trained with Python):

1. **Anomaly Detection** - Isolation Forest for detecting unusual meter readings
2. **Failure Prediction** - XGBoost for predicting transformer failures
3. **Customer Segmentation** - K-means for classifying customer usage patterns
4. **Demand Forecasting** - Prophet for predicting future energy demand

### Training Models

```bash
cd ml
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Generate sample data
python src/generate_sample_data.py

# Train all models
python src/train_all_models.py
```

## Project Structure

```
RedMeters/
├── app/
│   ├── models/          # ActiveRecord models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   └── jobs/            # Background jobs
├── config/              # Configuration
├── db/
│   └── migrate/         # Database migrations
├── frontend/            # React application (Phase 4)
├── ml/                  # Python ML code
│   ├── notebooks/       # Jupyter notebooks
│   ├── src/             # Training scripts
│   └── models/          # Saved model files
├── data/                # Local data files
├── app.rb               # Main Sinatra application
├── Gemfile              # Ruby dependencies
└── Rakefile             # Rake tasks
```

## Azure Cost Estimate

| Service | Monthly Cost (AUD) |
|---------|-------------------|
| PostgreSQL Flexible (B1ms) | ~$30 |
| Blob Storage | ~$2 |
| **TOTAL** | **~$32** |

## Development

```bash
# Start console
bundle exec rake console

# Run specific migration
bundle exec rake db:migrate

# Rollback migration
bundle exec rake db:rollback

# Check migration status
bundle exec rake db:status
```

## License

Proprietary - Kyndryl


