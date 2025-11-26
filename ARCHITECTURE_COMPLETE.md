# Complete Architecture & Implementation Blueprint
**Red Energy Marcom Agent - Reference Architecture**

> **Purpose:** This document provides a complete, tried-and-true architecture blueprint for building enterprise RAG-based applications with Ruby/Sinatra backend, React frontend, and Azure cloud infrastructure.

**Last Updated:** November 26, 2025  
**Status:** Production-Ready Reference Architecture  
**Technology Stack:** Ruby 3.2, Sinatra 4.0, React 19, PostgreSQL 14, Azure Cloud Services

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Application Stack Architecture](#application-stack-architecture)
3. [Azure Landing Zone & Cloud Services](#azure-landing-zone--cloud-services)
4. [Local Development Environment](#local-development-environment)
5. [Database Architecture](#database-architecture)
6. [API Design & Structure](#api-design--structure)
7. [Frontend Architecture](#frontend-architecture)
8. [Deployment Procedures](#deployment-procedures)
9. [Architectural Principles](#architectural-principles)
10. [Security & Compliance](#security--compliance)
11. [Monitoring & Operations](#monitoring--operations)
12. [Cost Management](#cost-management)
13. [Step-by-Step Materialization Guide](#step-by-step-materialization-guide)

---

## Executive Summary

This architecture represents a **battle-tested, production-ready stack** for building modern RAG (Retrieval-Augmented Generation) applications. It combines:

- **Backend:** Ruby/Sinatra for rapid API development with ActiveRecord ORM
- **Frontend:** React 19 with Vite for blazing-fast development and modern UI
- **Database:** PostgreSQL 14+ with pgvector extension for embeddings
- **Cloud:** Azure services (Container Apps, OpenAI, AI Search, PostgreSQL)
- **AI:** Azure OpenAI (GPT-4) and Azure AI Search for RAG capabilities
- **IaC:** Bicep templates for reproducible infrastructure deployment
- **CI/CD:** GitHub Actions for automated builds and deployments

### Key Characteristics

✅ **Proven in Production** - Currently running Red Energy Marcom Agent  
✅ **Rapid Development** - New features in hours, not days  
✅ **Cost-Effective** - ~$545-1,075 AUD/month for dev environment  
✅ **Scalable** - Container Apps auto-scale with demand  
✅ **Maintainable** - Clear separation of concerns, DRY principles  
✅ **Secure** - Azure Key Vault, managed identities, RBAC  
✅ **Observable** - Application Insights, Log Analytics, complete audit trails

---

## Application Stack Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT TIER                              │
│                  React 19 + Vite + Tailwind                  │
│                 (Azure Container Apps - Frontend)            │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS (JSON REST API)
┌────────────────────────┴────────────────────────────────────┐
│                     APPLICATION TIER                         │
│               Ruby/Sinatra + ActiveRecord 7.2                │
│                (Azure Container Apps - API)                  │
│                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │   Routes     │ │   Services   │ │   Models     │       │
│  │ (5-10 lines) │ │ (Business    │ │ (Domain      │       │
│  │              │ │  Logic)      │ │  Logic)      │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
└────────────┬────────────┬──────────────┬──────────────────┘
             │            │              │
    ┌────────┴────┐  ┌───┴───────┐  ┌──┴───────────┐
    │ PostgreSQL  │  │  Azure    │  │Azure AI      │
    │ (Cloud DB)  │  │  OpenAI   │  │Search (RAG)  │
    │ + pgvector  │  │  (GPT-4)  │  │+ Embeddings  │
    └─────────────┘  └───────────┘  └──────────────┘
```

### Technology Stack Details

#### Backend Stack
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Sinatra | 4.0+ | Lightweight web framework for APIs |
| **ORM** | ActiveRecord | 7.2+ | Database abstraction and migrations |
| **Web Server** | Puma | 6.4+ | Multi-threaded Ruby web server |
| **Background Jobs** | Sidekiq + Redis | 7.3+ / 5.3+ | Async task processing |
| **HTTP Client** | HTTParty | 0.22+ | External API calls |
| **JSON Parser** | Oj | 3.16+ | Fast JSON parsing |
| **Web Scraping** | Nokogiri | 1.16+ | HTML/XML parsing for crawler |

#### Frontend Stack
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | React | 19.0+ | UI component library |
| **Build Tool** | Vite | 6.0+ | Fast dev server and bundler |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first CSS framework |
| **Icons** | Lucide React | 0.460+ | Beautiful, consistent icons |
| **HTTP Client** | Fetch API | Native | API communication |

#### Database & Storage
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Primary Database** | PostgreSQL 14+ | Relational data, submissions, approvals |
| **Vector Extension** | pgvector | Semantic similarity search |
| **Cache/Queue** | Redis 5+ | Session cache, job queue |
| **Object Storage** | Azure Blob Storage | Raw content, PDFs, backups |

#### Development Tools
| Tool | Purpose |
|------|---------|
| **rbenv** | Ruby version management (3.2.0) |
| **Bundler** | Gem dependency management |
| **npm** | Node package management |
| **RSpec** | Unit and integration testing |
| **Rubocop** | Ruby linting and style checking |
| **ESLint** | JavaScript/React linting |

---

## Azure Landing Zone & Cloud Services

### Azure Service Mapping (GCP Equivalents)

| Azure Service | GCP Equivalent | Purpose | Rationale |
|--------------|----------------|---------|-----------|
| **Azure OpenAI Service** | Vertex AI (Gemini Pro) | LLM for content analysis | Industry-standard GPT-4 models |
| **Azure OpenAI Embeddings** | Vertex AI Embeddings | Text vectorization | Ada-002 embeddings (1536 dimensions) |
| **Azure AI Search** | Vertex AI Search | Vector database + semantic search | Integrated semantic search capabilities |
| **Azure Container Apps** | Cloud Run | Serverless containers | Auto-scaling, cost-effective |
| **Azure Database for PostgreSQL** | Cloud SQL PostgreSQL | Managed PostgreSQL | pgvector support, automatic backups |
| **Azure Blob Storage** | Cloud Storage | Object storage | Cost-effective, unlimited scale |
| **Azure Key Vault** | Secret Manager | Encrypted secrets storage | RBAC integration |
| **Azure Logic Apps** | Cloud Scheduler | Scheduled tasks/workflows | No-code workflow orchestration |
| **Azure Container Registry** | Artifact Registry | Container image storage | Private registry, geo-replication |
| **Azure Monitor** | Cloud Monitoring | Metrics and alerts | Application Insights integration |
| **Log Analytics** | Cloud Logging | Centralized logs | KQL queries, dashboards |

### Azure Resource Hierarchy

```
Azure Subscription
  └── Resource Group: rg-redenergy-marcom-agent-dev
      ├── Networking
      │   ├── Virtual Network (10.0.0.0/16)
      │   │   ├── subnet-containerApps (10.0.0.0/23)
      │   │   ├── subnet-database (10.0.2.0/24)
      │   │   └── subnet-privateEndpoints (10.0.3.0/24)
      │   └── Private DNS Zone (postgres.database.azure.com)
      │
      ├── Compute
      │   ├── Container Apps Environment
      │   │   ├── API Container App (Sinatra)
      │   │   └── Frontend Container App (React)
      │   └── Container Registry (ACR)
      │
      ├── AI & Search
      │   ├── Azure OpenAI Service
      │   │   ├── GPT-4 Deployment (10 TPM capacity)
      │   │   └── text-embedding-ada-002 Deployment
      │   └── Azure AI Search (Standard tier)
      │       └── Semantic search enabled
      │
      ├── Data & Storage
      │   ├── PostgreSQL Flexible Server (B2s)
      │   │   ├── Database: red_energy_marcom
      │   │   └── Extension: pgvector
      │   └── Storage Account
      │       ├── Container: crawled-content
      │       ├── Container: pdfs
      │       └── Container: backups
      │
      ├── Security
      │   └── Key Vault
      │       ├── Secret: postgres-connection-string
      │       ├── Secret: openai-api-key
      │       ├── Secret: ai-search-admin-key
      │       ├── Secret: storage-connection-string
      │       └── Secret: wordpress-credentials
      │
      ├── Monitoring
      │   ├── Log Analytics Workspace
      │   └── Application Insights
      │
      └── Automation
          ├── Logic App: Weekly Crawler (Sundays 2 AM)
          └── Logic App: Daily Embeddings (Daily 3 AM)
```

### Resource Naming Convention

**Pattern:** `{resource-type-abbreviation}-{company}-{project}-{environment}-{unique-suffix}`

| Resource Type | Abbreviation | Example |
|--------------|--------------|---------|
| Resource Group | rg- | `rg-redenergy-marcom-agent-dev` |
| Virtual Network | vnet- | `vnet-redenergy-marcom-agent-dev` |
| Container App | ca- | `ca-redenergy-marcom-agent-dev-api` |
| Container App Environment | cae- | `cae-redenergy-marcom-agent-dev` |
| Container Registry | cr | `crredenergymarcomagentdev` (no hyphens) |
| PostgreSQL Server | psql- | `psql-redenergy-marcom-agent-dev-abc123` |
| Storage Account | st | `stredenergymarcomagentdev` (no hyphens) |
| Key Vault | kv- | `kv-redenergy-marcom-agent-dev-abc123` |
| OpenAI Service | openai- | `openai-redenergy-marcom-agent-dev-abc123` |
| AI Search | srch- | `srch-redenergy-marcom-agent-dev-abc123` |
| Logic App | logic- | `logic-redenergy-marcom-agent-dev-crawler` |
| Log Analytics | log- | `log-redenergy-marcom-agent-dev` |
| App Insights | appi- | `appi-redenergy-marcom-agent-dev` |

---

## Local Development Environment

### Prerequisites

#### Required Software

```bash
# macOS (using Homebrew)
brew install rbenv ruby-build   # Ruby version manager
brew install postgresql@14      # PostgreSQL database
brew install redis              # Cache and job queue
brew install node@20            # Node.js for frontend
brew install azure-cli          # Azure command-line interface
brew install gh                 # GitHub CLI

# Initialize rbenv
rbenv init

# Install Ruby 3.2.0
rbenv install 3.2.0
rbenv global 3.2.0

# Verify installations
ruby --version    # Should show 3.2.x
node --version    # Should show 20.x
psql --version    # Should show 14.x
az --version      # Azure CLI
gh --version      # GitHub CLI
```

#### Azure Access Requirements
- Azure subscription with Owner or Contributor role
- Azure OpenAI Service access (requires application: https://aka.ms/oai/access)
- Ability to create service principals

### Project Structure

```
RedEnergyCommunicationsTone/
├── app/
│   ├── helpers/              # Request/response helpers
│   │   ├── api_helpers.rb
│   │   └── response_helpers.rb
│   ├── middleware/           # Rack middleware
│   │   └── error_handler.rb
│   ├── models/               # ActiveRecord models (domain logic)
│   │   ├── application_record.rb
│   │   ├── content_submission.rb
│   │   ├── content_analysis.rb
│   │   ├── content_approval.rb
│   │   ├── crawled_content.rb
│   │   ├── brand_pattern.rb
│   │   └── ... (12 models total)
│   ├── routes/               # API route modules (LEAN - 5-10 lines)
│   │   ├── submissions_routes.rb
│   │   ├── analyses_routes.rb
│   │   ├── approvals_routes.rb
│   │   ├── config_routes.rb
│   │   ├── publishing_routes.rb
│   │   └── policy_routes.rb
│   └── services/             # Business logic services
│       ├── content_analyzer_service.rb
│       ├── embedding_service.rb
│       ├── wordpress_publisher.rb
│       └── openai_service_factory.rb
├── config/
│   ├── database.rb           # ActiveRecord connection setup
│   ├── database.yml          # Database configuration
│   └── corporate_policy.yml  # Business rules configuration
├── db/
│   ├── migrate/              # Database migrations (12 files)
│   └── seeds.rb              # Sample data for development
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SubmissionsView.jsx
│   │   │   ├── SubmissionForm.jsx
│   │   │   ├── AnalysisResults.jsx
│   │   │   └── SlideOutPanel.jsx
│   │   ├── services/
│   │   │   └── api.js        # API client (all endpoints)
│   │   ├── App.jsx           # Main application
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Tailwind + custom styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── infrastructure/           # Azure Infrastructure as Code
│   ├── main.bicep            # Main deployment template
│   ├── modules/
│   │   └── infrastructure.bicep  # All Azure resources
│   ├── parameters.dev.json   # Dev environment parameters
│   ├── deploy.rb             # Ruby deployment script
│   └── README.md             # Infrastructure documentation
├── script/                   # Development scripts
│   ├── start_api.rb          # Start backend server
│   ├── reset_database.rb     # Reset and reseed database
│   └── test_api.rb           # API smoke tests
├── test/                     # Test suites
│   └── results/              # Test result logs
├── app.rb                    # Main Sinatra application
├── config.ru                 # Rack configuration
├── Gemfile                   # Ruby dependencies
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment template
└── README.md                 # Project documentation
```

### Local Setup (Step-by-Step)

#### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone https://github.com/yourusername/RedEnergyCommunicationsTone.git
cd RedEnergyCommunicationsTone

# Install Ruby dependencies
bundle install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

#### 2. Setup Local Database

```bash
# Start PostgreSQL service
brew services start postgresql@14

# Create database user (if needed)
createuser -s marcomadmin

# Create database
createdb red_energy_marcom -O marcomadmin

# Verify connection
psql -d red_energy_marcom -U marcomadmin -c "SELECT version();"
```

#### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your credentials
cat > .env << EOF
# Database
DATABASE_URL=postgresql://marcomadmin:password@localhost:5432/red_energy_marcom

# Azure OpenAI (from Azure Portal after deployment)
AZURE_OPENAI_KEY=your-openai-key-here
AZURE_OPENAI_ENDPOINT=https://your-openai-service.openai.azure.com/

# Azure AI Search (from Azure Portal after deployment)
AZURE_SEARCH_KEY=your-search-key-here
AZURE_SEARCH_ENDPOINT=https://your-search-service.search.windows.net

# Azure Storage (from Azure Portal after deployment)
AZURE_STORAGE_CONNECTION=DefaultEndpointsProtocol=https;AccountName=...

# Application
RACK_ENV=development
CORS_ORIGIN=http://localhost:5173
EOF
```

#### 4. Run Database Migrations

```bash
# Run migrations
bundle exec rake db:migrate

# Load seed data (optional)
bundle exec rake db:seed

# Verify schema
psql -d red_energy_marcom -c "\dt"
```

#### 5. Start Development Servers

**Terminal 1 - Backend API:**
```bash
# Start Sinatra API server
ruby script/start_api.rb

# Or manually:
bundle exec rackup -p 4567

# API available at: http://localhost:4567
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Frontend available at: http://localhost:5173
```

**Terminal 3 - Background Jobs (optional):**
```bash
# Start Redis
brew services start redis

# Start Sidekiq
bundle exec sidekiq
```

#### 6. Verify Installation

```bash
# Test API health
curl http://localhost:4567/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2025-11-26T...",
#   "services": {
#     "database": {"status": "healthy", "connected": true},
#     "openai": {"status": "configured", ...}
#   }
# }

# Open browser
open http://localhost:5173
```

---

## Database Architecture

### Schema Overview

The database follows a **domain-driven design** with clear boundaries between operational data, knowledge base, and audit trails.

#### Entity Relationship Diagram

```
┌─────────────────────┐
│ content_submissions │ (Marketing team creates content)
│  - id               │
│  - title            │
│  - body_content     │
│  - submission_type  │
│  - status           │
│  - submitted_by     │
│  - submitted_at     │
└──────────┬──────────┘
           │ 1
           │
           │ 1:1
           ↓
┌─────────────────────┐
│  content_analyses   │ (AI analysis results)
│  - id               │
│  - submission_id ───┘
│  - overall_score    │
│  - tone_score       │
│  - compliance_score │
│  - analysis_result  │ (JSONB)
│  - analyzed_at      │
└──────────┬──────────┘
           │
           │ 1:N
           ↓
┌─────────────────────┐
│ applied_suggestions │ (Which suggestions user applied)
│  - analysis_id      │
│  - suggestion_text  │
│  - original_text    │
│  - applied_by       │
└─────────────────────┘

┌─────────────────────┐
│ content_approvals   │ (Approval workflow)
│  - id               │
│  - submission_id    │
│  - approved_by      │
│  - decision         │ (approved/rejected)
│  - comments         │
│  - approved_at      │
└──────────┬──────────┘
           │
           │ If approved
           ↓
┌─────────────────────────┐
│ wordpress_publications  │ (Publishing to CMS)
│  - id                   │
│  - submission_id        │
│  - wordpress_post_id    │
│  - published_at         │
│  - published_by         │
└─────────────────────────┘

┌─────────────────────┐
│  crawled_content    │ (Website scraper output)
│  - id               │
│  - source_url       │
│  - content_type     │ (html/pdf)
│  - raw_content      │
│  - crawled_at       │
└──────────┬──────────┘
           │
           │ 1:N
           ↓
┌─────────────────────┐
│   content_chunks    │ (Semantic segments + embeddings)
│  - id               │
│  - crawled_id ──────┘
│  - chunk_text       │
│  - chunk_index      │
│  - embedding        │ (vector - 1536 dimensions)
│  - indexed_at       │
└─────────────────────┘

┌─────────────────────┐
│   brand_patterns    │ (Extracted from approved content)
│  - id               │
│  - pattern_type     │ (tone/terminology/structure)
│  - pattern_name     │
│  - pattern_value    │ (JSONB)
│  - examples         │ (JSONB array)
│  - confidence       │
└─────────────────────┘

┌─────────────────────┐
│  compliance_rules   │ (Regulatory requirements)
│  - id               │
│  - rule_type        │
│  - rule_name        │
│  - description      │
│  - severity         │ (error/warning/info)
│  - validation_logic │ (JSONB)
│  - is_active        │
└─────────────────────┘

┌───────────────────────────┐
│ approved_content_index    │ (RAG knowledge base)
│  - id                     │
│  - submission_id          │
│  - indexed_content        │
│  - content_embedding      │ (vector)
│  - metadata               │ (JSONB)
│  - indexed_at             │
└───────────────────────────┘
```

### Key Tables Explained

#### 1. content_submissions
**Purpose:** Core table for all marketing content submissions

```sql
CREATE TABLE content_submissions (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  body_content TEXT NOT NULL,
  submission_type VARCHAR(50) NOT NULL, 
    -- 'email', 'blog_post', 'social_media', 'web_content'
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
    -- 'draft', 'analyzing', 'pending_review', 'approved', 'rejected'
  submitted_by VARCHAR(255) NOT NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  metadata JSONB, -- Flexible additional fields
  
  CHECK (char_length(body_content) > 0),
  CHECK (char_length(body_content) <= 50000)
);

CREATE INDEX idx_submissions_status ON content_submissions(status);
CREATE INDEX idx_submissions_submitted_by ON content_submissions(submitted_by);
CREATE INDEX idx_submissions_submitted_at ON content_submissions(submitted_at DESC);
```

#### 2. content_analyses
**Purpose:** Stores AI analysis results and suggestions

```sql
CREATE TABLE content_analyses (
  id BIGSERIAL PRIMARY KEY,
  content_submission_id BIGINT NOT NULL REFERENCES content_submissions(id) ON DELETE CASCADE,
  overall_score DECIMAL(5,2) CHECK (overall_score BETWEEN 0 AND 100),
  tone_score DECIMAL(5,2),
  clarity_score DECIMAL(5,2),
  compliance_score DECIMAL(5,2),
  brand_voice_score DECIMAL(5,2),
  
  -- Detailed analysis results (JSON)
  analysis_result JSONB NOT NULL,
  -- Structure: {
  --   "issues": [{"type": "...", "severity": "...", "message": "..."}],
  --   "suggestions": [{"original": "...", "suggested": "...", "reason": "..."}],
  --   "compliance_checks": [{"rule": "...", "passed": true/false}]
  -- }
  
  analyzed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(content_submission_id) -- One analysis per submission
);

CREATE INDEX idx_analyses_score ON content_analyses(overall_score DESC);
```

#### 3. content_chunks (RAG Foundation)
**Purpose:** Semantic text segments with vector embeddings for similarity search

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE content_chunks (
  id BIGSERIAL PRIMARY KEY,
  crawled_content_id BIGINT NOT NULL REFERENCES crawled_content(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL, -- Order within source document
  
  -- Vector embedding (1536 dimensions for Ada-002)
  embedding vector(1536),
  
  -- Metadata for filtering
  chunk_type VARCHAR(50), -- 'paragraph', 'heading', 'list_item'
  word_count INTEGER,
  
  indexed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CHECK (char_length(chunk_text) > 0)
);

-- Vector similarity search index (HNSW algorithm)
CREATE INDEX idx_chunks_embedding ON content_chunks 
  USING ivfflat (embedding vector_cosine_ops) 
  WITH (lists = 100);

CREATE INDEX idx_chunks_crawled_id ON content_chunks(crawled_content_id);
```

#### 4. compliance_rules (Runtime Configurable)
**Purpose:** Business rules configurable via UI (no code deployment needed)

```sql
CREATE TABLE compliance_rules (
  id BIGSERIAL PRIMARY KEY,
  rule_type VARCHAR(50) NOT NULL,
    -- 'required_disclaimer', 'prohibited_term', 'tone_requirement'
  rule_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  severity VARCHAR(20) NOT NULL DEFAULT 'warning',
    -- 'error' (blocks approval), 'warning' (shows alert), 'info' (advisory)
  
  -- Flexible validation logic (evaluated at runtime)
  validation_logic JSONB NOT NULL,
  -- Examples:
  -- {"pattern": "renewable energy", "must_include": true}
  -- {"prohibited_terms": ["guarantee", "promise"]}
  -- {"max_sentence_length": 25}
  
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

CREATE INDEX idx_compliance_rules_active ON compliance_rules(is_active) WHERE is_active = true;
```

### Database Migrations

All schema changes are version-controlled as ActiveRecord migrations:

```ruby
# db/migrate/20251126000005_create_content_submissions.rb
class CreateContentSubmissions < ActiveRecord::Migration[7.2]
  def change
    create_table :content_submissions do |t|
      t.string :title, null: false, limit: 500
      t.text :body_content, null: false
      t.string :submission_type, null: false, limit: 50
      t.string :status, null: false, default: 'draft', limit: 50
      t.string :submitted_by, null: false
      t.timestamp :submitted_at, null: false, default: -> { 'NOW()' }
      t.jsonb :metadata
      
      t.timestamps
      
      t.index :status
      t.index :submitted_by
      t.index [:submitted_at, :desc]
    end
  end
end
```

**Run migrations:**
```bash
bundle exec rake db:migrate
bundle exec rake db:migrate:status  # Check status
bundle exec rake db:rollback         # Undo last migration
```

---

## API Design & Structure

### API Architecture Principles

**GOLDEN RULE: Routes are LEAN (5-10 lines maximum)**

Routes handle HTTP concerns ONLY:
- Parse request parameters
- Call model/service methods
- Return JSON responses
- Handle HTTP errors

ALL business logic lives in:
- **Models:** Domain logic, validations, state management
- **Service Objects:** Complex multi-model operations
- **NEVER in routes**

### API Structure

```ruby
# app.rb - Main Sinatra application
class RedEnergyMarcomAPI < Sinatra::Base
  # Register route modules
  register Routes::SubmissionsRoutes
  register Routes::AnalysesRoutes
  register Routes::ApprovalsRoutes
  register Routes::ConfigRoutes
  register Routes::PublishingRoutes
  
  # Middleware
  use Rack::Cors do
    allow do
      origins ENV.fetch('CORS_ORIGIN', 'http://localhost:5173')
      resource '/api/*', 
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options]
    end
  end
  
  use Middleware::ErrorHandler # Centralized error handling
end
```

### API Endpoints

**Base URL:** `http://localhost:4567` (dev) or `https://api.yourdomain.com` (prod)  
**API Version:** `/api/v1`

#### Submissions API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/submissions` | List all submissions (paginated) |
| POST | `/api/v1/submissions` | Create new submission |
| GET | `/api/v1/submissions/:id` | Get submission details |
| PUT | `/api/v1/submissions/:id` | Update submission |
| DELETE | `/api/v1/submissions/:id` | Delete submission |

#### Analysis API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/submissions/:id/analyze` | Trigger AI analysis |
| GET | `/api/v1/submissions/:id/analysis` | Get analysis results |

#### Approval API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/submissions/:id/approve` | Approve submission |
| POST | `/api/v1/submissions/:id/reject` | Reject submission |
| GET | `/api/v1/approvals/pending` | List pending approvals |

#### Publishing API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/submissions/:id/publish` | Publish to WordPress |
| GET | `/api/v1/publications` | List published content |

#### Configuration API (Admin)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/admin/compliance-rules` | List compliance rules |
| POST | `/api/v1/admin/compliance-rules` | Create new rule |
| PUT | `/api/v1/admin/compliance-rules/:id` | Update rule |
| DELETE | `/api/v1/admin/compliance-rules/:id` | Delete rule |
| GET | `/api/v1/admin/brand-patterns` | List brand patterns |
| GET | `/api/v1/admin/statistics` | System statistics |

### Example: LEAN Route Implementation

**GOOD - Lean route (5 lines):**
```ruby
# app/routes/submissions_routes.rb
module Routes
  module SubmissionsRoutes
    def self.registered(app)
      # Create new submission
      app.post '/api/v1/submissions' do
        submission = ContentSubmission.create_from_api!(request_body, current_user_id)
        status 201
        json submission.to_api_response
      end
      
      # Get submission details
      app.get '/api/v1/submissions/:id' do
        submission = ContentSubmission.find(params[:id])
        json submission.to_api_response
      end
    end
  end
end
```

**Business logic in model:**
```ruby
# app/models/content_submission.rb
class ContentSubmission < ApplicationRecord
  # Validations
  validates :title, presence: true, length: { maximum: 500 }
  validates :body_content, presence: true, length: { maximum: 50000 }
  validates :submission_type, inclusion: { 
    in: %w[email blog_post social_media web_content] 
  }
  
  # State machine
  state_machine :status, initial: :draft do
    state :draft, :analyzing, :pending_review, :approved, :rejected
    
    event :submit_for_analysis do
      transition draft: :analyzing
    end
    
    event :complete_analysis do
      transition analyzing: :pending_review
    end
    
    event :approve do
      transition pending_review: :approved
    end
  end
  
  # Business logic (FAT model)
  def self.create_from_api!(params, user_id)
    transaction do
      submission = create!(
        title: params[:title],
        body_content: params[:body_content],
        submission_type: params[:submission_type],
        submitted_by: user_id,
        submitted_at: Time.current
      )
      
      # Trigger analysis asynchronously
      AnalyzeContentJob.perform_later(submission.id)
      
      submission
    end
  end
  
  def to_api_response
    {
      id: id,
      title: title,
      body_content: body_content,
      submission_type: submission_type,
      status: status,
      submitted_by: submitted_by,
      submitted_at: submitted_at.iso8601,
      analysis: content_analysis&.to_api_response,
      approval: content_approval&.to_api_response
    }
  end
end
```

### Error Handling Middleware

Centralized error handling ensures consistent responses:

```ruby
# app/middleware/error_handler.rb
module Middleware
  class ErrorHandler
    def initialize(app)
      @app = app
    end
    
    def call(env)
      @app.call(env)
    rescue ActiveRecord::RecordNotFound => e
      [404, {'Content-Type' => 'application/json'}, 
       [{ error: 'Record not found', code: 'NOT_FOUND' }.to_json]]
       
    rescue ActiveRecord::RecordInvalid => e
      [422, {'Content-Type' => 'application/json'}, 
       [{ error: 'Validation failed', 
          code: 'VALIDATION_ERROR',
          details: e.record.errors.messages }.to_json]]
       
    rescue StandardError => e
      Rails.logger.error "#{e.class}: #{e.message}\n#{e.backtrace.first(10).join("\n")}"
      [500, {'Content-Type' => 'application/json'}, 
       [{ error: 'Internal server error', code: 'INTERNAL_ERROR' }.to_json]]
    end
  end
end
```

---

## Frontend Architecture

### Technology Stack

- **React 19:** Latest React with concurrent rendering
- **Vite 6:** Lightning-fast dev server and build tool
- **Tailwind CSS 3.4:** Utility-first styling
- **Lucide React:** Beautiful, consistent icon library
- **Native Fetch API:** HTTP requests (no axios needed)

### Component Architecture

```
src/
├── App.jsx                   # Main app layout
├── main.jsx                  # Entry point, mounts React
├── index.css                 # Global styles, Tailwind imports
├── components/
│   ├── Sidebar.jsx           # Fixed left navigation (Nordic pattern)
│   ├── Dashboard.jsx         # Statistics dashboard
│   ├── SubmissionsView.jsx   # Content list with filters
│   ├── SubmissionForm.jsx    # Create/edit form
│   ├── SubmissionDetail.jsx  # View submission + analysis
│   ├── AnalysisResults.jsx   # AI suggestions display
│   └── SlideOutPanel.jsx     # Reusable slide-out panel
└── services/
    └── api.js                # All API calls centralized
```

### Design System (Nordic/Scandinavian)

**Color Palette (Tailwind config):**
```javascript
// frontend/tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // Nordic color palette
        'nordic-blue': '#4A5C6A',      // Primary navigation
        'nordic-light': '#9BA8AB',     // Secondary elements
        'nordic-cream': '#F1EEDC',     // Backgrounds
        'nordic-dark': '#2C3639',      // Text
        
        // Accent colors
        'nordic-green': '#7FA282',     // Success
        'nordic-red': '#C9585B',       // Error
        'nordic-yellow': '#E8B44F',    // Warning
        'nordic-teal': '#5B9FA0',      // Info
      }
    }
  }
}
```

### API Client Service

Centralized API calls with error handling:

```javascript
// frontend/src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4567';

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  const response = await fetch(url, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new APIError(
      data.error || 'API request failed',
      response.status,
      data
    );
  }
  
  return data;
}

// API methods
export const api = {
  // Submissions
  getSubmissions: () => fetchAPI('/api/v1/submissions'),
  
  getSubmission: (id) => fetchAPI(`/api/v1/submissions/${id}`),
  
  createSubmission: (data) => fetchAPI('/api/v1/submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateSubmission: (id, data) => fetchAPI(`/api/v1/submissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  deleteSubmission: (id) => fetchAPI(`/api/v1/submissions/${id}`, {
    method: 'DELETE',
  }),
  
  // Analysis
  analyzeSubmission: (id) => fetchAPI(`/api/v1/submissions/${id}/analyze`, {
    method: 'POST',
  }),
  
  // Approval
  approveSubmission: (id, comments) => fetchAPI(`/api/v1/submissions/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ comments }),
  }),
  
  // Statistics
  getStatistics: () => fetchAPI('/api/v1/admin/statistics'),
};
```

### Example Component: SubmissionsView

```jsx
// frontend/src/components/SubmissionsView.jsx
import { useState, useEffect } from 'react';
import { FileText, Plus, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import SlideOutPanel from './SlideOutPanel';
import SubmissionForm from './SubmissionForm';

export default function SubmissionsView() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    loadSubmissions();
  }, []);
  
  async function loadSubmissions() {
    try {
      setLoading(true);
      const data = await api.getSubmissions();
      setSubmissions(data.submissions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-nordic-red">{error}</div>;
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-nordic-dark">Content Submissions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-nordic-blue text-white rounded hover:bg-opacity-90"
        >
          <Plus size={20} />
          New Submission
        </button>
      </div>
      
      <div className="grid gap-4">
        {submissions.map(submission => (
          <div key={submission.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-nordic-dark">{submission.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{submission.submission_type}</p>
              </div>
              <StatusBadge status={submission.status} />
            </div>
          </div>
        ))}
      </div>
      
      {showForm && (
        <SlideOutPanel
          title="New Submission"
          onClose={() => setShowForm(false)}
        >
          <SubmissionForm
            onSuccess={() => {
              setShowForm(false);
              loadSubmissions();
            }}
            onCancel={() => setShowForm(false)}
          />
        </SlideOutPanel>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    draft: 'bg-gray-200 text-gray-700',
    analyzing: 'bg-nordic-yellow bg-opacity-20 text-nordic-yellow',
    pending_review: 'bg-nordic-teal bg-opacity-20 text-nordic-teal',
    approved: 'bg-nordic-green bg-opacity-20 text-nordic-green',
    rejected: 'bg-nordic-red bg-opacity-20 text-nordic-red',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
```

---

## Deployment Procedures

### Azure Infrastructure Deployment

#### Prerequisites

1. **Azure Subscription** with required permissions
2. **Azure CLI** installed and authenticated
3. **Service Principal** created for GitHub Actions (optional for CI/CD)
4. **Azure OpenAI access** approved

#### Step 1: Prepare Environment Variables

```bash
# Set required variables
export POSTGRES_ADMIN_PASSWORD="SecurePassword123!"
export ADMIN_EMAIL="admin@yourdomain.com"
export SUBSCRIPTION_ID="your-subscription-id"
export LOCATION="australiaeast"  # or eastasia, eastus2
export ENVIRONMENT="dev"  # or staging, prod
```

#### Step 2: Deploy Infrastructure with Bicep

```bash
cd infrastructure/

# Validate template
az deployment sub validate \
  --location $LOCATION \
  --template-file main.bicep \
  --parameters parameters.dev.json \
  --parameters postgresAdminPassword="$POSTGRES_ADMIN_PASSWORD" \
  --parameters adminEmail="$ADMIN_EMAIL"

# Deploy infrastructure
DEPLOYMENT_NAME="redenergy-marcom-$(date +%Y%m%d-%H%M%S)"

az deployment sub create \
  --name "$DEPLOYMENT_NAME" \
  --location $LOCATION \
  --template-file main.bicep \
  --parameters parameters.dev.json \
  --parameters postgresAdminPassword="$POSTGRES_ADMIN_PASSWORD" \
  --parameters adminEmail="$ADMIN_EMAIL"

# Watch deployment (takes 10-15 minutes)
az deployment sub show \
  --name "$DEPLOYMENT_NAME" \
  --query properties.provisioningState

# Get outputs
az deployment sub show \
  --name "$DEPLOYMENT_NAME" \
  --query properties.outputs --output json > deployment-outputs.json
```

**What gets deployed:**
- ✅ Resource Group
- ✅ Virtual Network with 3 subnets
- ✅ Azure OpenAI Service (GPT-4 + Embeddings)
- ✅ Azure AI Search (Standard tier)
- ✅ PostgreSQL Flexible Server (B2s)
- ✅ Blob Storage (3 containers)
- ✅ Container Registry
- ✅ Container Apps Environment
- ✅ 2 Container Apps (API + Frontend)
- ✅ Key Vault with secrets
- ✅ Log Analytics + Application Insights
- ✅ 2 Logic Apps (scheduled tasks)

#### Step 3: Build and Push Container Images

```bash
# Extract ACR login server from outputs
ACR_SERVER=$(jq -r '.containerRegistryLoginServer.value' deployment-outputs.json)
RESOURCE_GROUP="rg-redenergy-marcom-agent-dev"

# Login to Azure Container Registry
az acr login --name ${ACR_SERVER%%.*}

# Build API image (MUST use GitHub Actions for ARM64 compatibility)
docker build -f Dockerfile.api -t $ACR_SERVER/marcom-api:latest .
docker push $ACR_SERVER/marcom-api:latest

# Build Frontend image
docker build -f Dockerfile.frontend -t $ACR_SERVER/marcom-frontend:latest ./frontend
docker push $ACR_SERVER/marcom-frontend:latest

# Update Container Apps to use new images
az containerapp update \
  --name ca-redenergy-marcom-agent-dev-api \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_SERVER/marcom-api:latest

az containerapp update \
  --name ca-redenergy-marcom-agent-dev-frontend \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_SERVER/marcom-frontend:latest
```

#### Step 4: Initialize Database

```bash
# Get PostgreSQL connection string from Key Vault
KV_NAME=$(jq -r '.keyVaultUri.value' deployment-outputs.json | sed 's|https://||' | sed 's|/||')

POSTGRES_HOST=$(az keyvault secret show \
  --vault-name $KV_NAME \
  --name postgres-connection-string \
  --query value -o tsv | grep -oP 'Host=\K[^;]+')

# Run migrations via Container App exec
az containerapp exec \
  --name ca-redenergy-marcom-agent-dev-api \
  --resource-group $RESOURCE_GROUP \
  --command "bundle exec rake db:migrate"

# Seed database (optional)
az containerapp exec \
  --name ca-redenergy-marcom-agent-dev-api \
  --resource-group $RESOURCE_GROUP \
  --command "bundle exec rake db:seed"
```

#### Step 5: Verify Deployment

```bash
# Get application URLs
API_URL=$(jq -r '.apiUrl.value' deployment-outputs.json)
FRONTEND_URL=$(jq -r '.frontendUrl.value' deployment-outputs.json)

# Test API health
curl $API_URL/health

# Open frontend
open $FRONTEND_URL
```

### GitHub Actions CI/CD (Recommended)

**Setup GitHub Secrets:**

1. Create Service Principal:
```bash
az ad sp create-for-rbac \
  --name "github-redenergy-marcom" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID \
  --sdk-auth > azure-credentials.json
```

2. Add GitHub Secrets (Settings → Secrets and variables → Actions):
   - `AZURE_CREDENTIALS`: Content of `azure-credentials.json`
   - `POSTGRES_ADMIN_PASSWORD`: PostgreSQL password
   - `ADMIN_EMAIL`: Admin email

3. Create workflow file:

```yaml
# .github/workflows/deploy-azure.yml
name: Deploy to Azure

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'dev'
        type: choice
        options:
          - dev
          - staging
          - prod

jobs:
  deploy-infrastructure:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Deploy Bicep
        run: |
          az deployment sub create \
            --name "marcom-$(date +%Y%m%d-%H%M%S)" \
            --location australiaeast \
            --template-file infrastructure/main.bicep \
            --parameters infrastructure/parameters.dev.json \
            --parameters postgresAdminPassword="${{ secrets.POSTGRES_ADMIN_PASSWORD }}" \
            --parameters adminEmail="${{ secrets.ADMIN_EMAIL }}"
  
  build-and-push:
    needs: deploy-infrastructure
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build and Push Docker Images
        run: |
          az acr login --name ${{ env.ACR_NAME }}
          docker build -f Dockerfile.api -t ${{ env.ACR_SERVER }}/marcom-api:${{ github.sha }} .
          docker push ${{ env.ACR_SERVER }}/marcom-api:${{ github.sha }}
```

---

## Architectural Principles

### Core Principles (from PRINCIPLES.md)

#### 1. API Design: Lean Endpoints, Fat Models ⭐ CRITICAL

**GOLDEN RULE: API endpoints must be LEAN (5-10 lines max)**

Routes/controllers should ONLY:
- Parse HTTP requests
- Validate parameters  
- Call model/service methods
- Return JSON responses

ALL business logic belongs in:
- **Models:** Domain logic, workflows, state management
- **Service Objects:** Complex operations spanning multiple models
- **NEVER in routes/controllers**

#### 2. DRY (Don't Repeat Yourself)

- **Delegate to superclass:** Common patterns in base class
- **Use factories:** Centralize object creation logic
- **Service objects:** Extract complex business logic
- **Template method pattern:** Define algorithm structure once
- **Metaprogramming over case statements:** Eliminate repetitive patterns

#### 3. Fail Fast - No Silent Failures

- **NO fallback logic:** Operations must succeed or fail clearly
- **High integrity results:** AI must work or raise error
- **Never use keyword matching as fallback:** If AI fails, fail the request
- **Clear error messages:** Always indicate what failed and why

#### 4. Real AI in All Environments

- **CRITICAL:** Always use real AI APIs, even in sandbox/simulation
- **No mock responses:** AI intelligence cannot be simulated
- **Use factories:** `AiServiceFactory.default_service` - never instantiate directly
- **RAG-based:** Use real content as reference, not generic AI

#### 5. Runtime Mutability

- **Users modify settings via UI:** No code deployment for config changes
- **Store in database:** Compliance rules, brand patterns, configurations
- **Fix data, not logic:** Never modify business logic to accommodate bad data

#### 6. Complete Audit Trail

- Track who changed what and when
- `created_by` / `updated_by` on all resources
- Immutable approval records
- Publishing history with WordPress post IDs

#### 7. Human-Readable Interfaces

- Never ask users for IDs
- Always show names, titles, descriptions
- Use dropdown menus with descriptions
- Clear error messages with remediation steps

#### 8. Testing Requirements

- **80% code coverage minimum**
- Test at reasonable increments after each major component
- **NEVER commit with linter errors or test failures**
- **Save all test results to files** for analysis

#### 9. Ruby Scripts Over Shell Scripts

- Prefer `.rb` files over `.sh`
- Better error handling and cross-platform compatibility
- Consistent with project language
- Organize in `script/` directory

#### 10. Use GitHub CLI Over Git

- Better integration with GitHub features
- More user-friendly output
- Handles authentication seamlessly
- Examples: `gh pr create`, `gh workflow run`

---

## Security & Compliance

### Azure Security Architecture

#### 1. Network Security

**Virtual Network Isolation:**
```
VNet: 10.0.0.0/16
  ├── subnet-containerApps (10.0.0.0/23)  # Container Apps
  ├── subnet-database (10.0.2.0/24)        # PostgreSQL (delegated)
  └── subnet-privateEndpoints (10.0.3.0/24) # Private endpoints
```

**Network Security Rules:**
- PostgreSQL accessible only from Container Apps subnet
- No public access to database
- Storage can use private endpoints (optional)
- Container Apps use HTTPS only

#### 2. Identity & Access Management

**Managed Identities:**
```bicep
resource apiApp 'Microsoft.App/containerApps@2023-05-01' = {
  identity: {
    type: 'SystemAssigned'  // No passwords/keys needed
  }
  // ...
}

// Grant Key Vault access to Container App identity
resource apiAppKeyVaultRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: keyVault
  properties: {
    roleDefinitionId: keyVaultSecretsUserRole
    principalId: apiApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}
```

**Benefits:**
- No credentials in code or environment variables
- Automatic credential rotation
- Azure AD integration
- Principle of least privilege

#### 3. Secrets Management

**Azure Key Vault:**
```bash
# All secrets stored in Key Vault
- postgres-connection-string
- openai-api-key
- ai-search-admin-key
- storage-connection-string
- wordpress-username
- wordpress-password

# Container Apps reference secrets from Key Vault
env:
  - name: AZURE_OPENAI_KEY
    secretRef: openai-key

secrets:
  - name: openai-key
    keyVaultUrl: https://kv-name.vault.azure.net/secrets/openai-api-key
    identity: system  # Use managed identity
```

**Security Features:**
- Soft delete enabled (90 day retention)
- RBAC authorization (no access policies)
- Audit logging enabled
- No secrets in code or git

#### 4. Database Security

**PostgreSQL Security:**
```bicep
resource postgresql 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  properties: {
    network: {
      delegatedSubnetResourceId: vnet.properties.subnets[1].id  // VNet integration
      privateDnsZoneArmResourceId: postgresPrivateDnsZone.id
    }
    // No publicNetworkAccess property = private only
  }
}
```

**Features:**
- VNet integration (no public access)
- SSL/TLS required
- Automatic backups (7 days retention)
- Point-in-time restore
- Encrypted at rest (Azure Storage Service Encryption)
- Encrypted in transit (TLS 1.2)

#### 5. Application Security

**API Security:**
```ruby
# CORS configuration
use Rack::Cors do
  allow do
    origins ENV.fetch('CORS_ORIGIN', 'http://localhost:5173')
    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options],
      credentials: true
  end
end

# Authentication middleware (implement as needed)
use Rack::Auth::Basic do |username, password|
  # Authenticate against Azure AD or database
end

# Input validation
validates :body_content, length: { maximum: 50000 }
validates :submission_type, inclusion: { in: VALID_TYPES }
```

#### 6. Compliance & Audit

**Audit Trail:**
```ruby
class ContentSubmission < ApplicationRecord
  # Automatic timestamping
  # created_at, updated_at tracked by ActiveRecord
  
  # Track user actions
  belongs_to :submitted_by, class_name: 'User'
  
  # Audit changes
  has_many :audits, as: :auditable
  after_update :log_audit
  
  private
  
  def log_audit
    Audit.create!(
      auditable: self,
      user_id: Current.user_id,
      action: 'update',
      changes: saved_changes,
      ip_address: Current.ip_address,
      user_agent: Current.user_agent
    )
  end
end
```

**Logging & Monitoring:**
- All API requests logged to Application Insights
- Database queries logged (dev only)
- Failed authentication attempts tracked
- Sensitive data never logged (PII, credentials)

---

## Monitoring & Operations

### Application Insights Integration

**Automatic Telemetry:**
- HTTP requests (status, duration, errors)
- Database queries (execution time, errors)
- External API calls (OpenAI, AI Search)
- Exceptions with stack traces
- Custom events and metrics

**Configuration:**
```ruby
# app.rb
configure do
  # Application Insights automatically enabled via environment variable
  # APPLICATIONINSIGHTS_CONNECTION_STRING set by Container Apps
end

# Custom tracking
def analyze_content(submission)
  start_time = Time.now
  
  result = ContentAnalyzerService.new(submission).analyze
  
  # Track custom metric
  AppInsights.track_metric(
    'content_analysis_duration',
    Time.now - start_time,
    properties: {
      submission_type: submission.submission_type,
      content_length: submission.body_content.length
    }
  )
  
  result
end
```

### Log Analytics Queries (KQL)

**Example queries for monitoring:**

```kusto
// Request errors (last 24 hours)
requests
| where timestamp > ago(24h)
| where success == false
| summarize count() by resultCode, name
| order by count_ desc

// Slow API requests (p95 > 2 seconds)
requests
| where timestamp > ago(1h)
| summarize percentile(duration, 95) by name
| where percentile_duration_95 > 2000
| order by percentile_duration_95 desc

// OpenAI API errors
dependencies
| where timestamp > ago(24h)
| where target contains "openai.azure.com"
| where success == false
| summarize count() by resultCode, name

// Content analysis metrics
customMetrics
| where name == "content_analysis_duration"
| summarize avg(value), percentile(value, 95) by bin(timestamp, 1h)
```

### Alerting

**Critical Alerts (PagerDuty/Email):**
- API error rate > 5% (5 minute window)
- Database connection failures
- OpenAI API rate limit exceeded
- Container App unhealthy

**Warning Alerts (Email):**
- API response time p95 > 10 seconds
- Database query time p95 > 1 second
- Storage usage > 80%
- Weekly crawler failed

### Health Checks

```ruby
# app.rb
get '/health' do
  health_data = {
    status: 'healthy',
    timestamp: Time.now.utc.iso8601,
    services: {
      database: check_database_health,
      openai: check_openai_health,
      search: check_search_health,
      storage: check_storage_health
    },
    version: ENV['APP_VERSION']
  }
  
  # Return 503 if any critical service is down
  if health_data[:services].any? { |_, s| s[:status] == 'unhealthy' }
    status 503
  end
  
  json health_data
end

private

def check_database_health
  ActiveRecord::Base.connection.execute('SELECT 1')
  { status: 'healthy', response_time_ms: 5 }
rescue => e
  { status: 'unhealthy', error: e.message }
end
```

### Backup & Disaster Recovery

**Automated Backups:**
- **PostgreSQL:** Daily automated backups (7 day retention)
- **Blob Storage:** Soft delete enabled (14 days)
- **Key Vault:** Soft delete enabled (90 days)

**Manual Backups:**
```bash
# Backup database
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
pg_dump $DATABASE_URL | gzip > backups/db-backup-$TIMESTAMP.sql.gz

# Upload to Azure Blob Storage
az storage blob upload \
  --account-name $STORAGE_ACCOUNT \
  --container-name backups \
  --name db-backup-$TIMESTAMP.sql.gz \
  --file backups/db-backup-$TIMESTAMP.sql.gz
```

**Restore Procedure:**
```bash
# Download backup
az storage blob download \
  --account-name $STORAGE_ACCOUNT \
  --container-name backups \
  --name db-backup-TIMESTAMP.sql.gz \
  --file restore.sql.gz

# Restore database
gunzip restore.sql.gz
psql $DATABASE_URL < restore.sql
```

---

## Cost Management

### Monthly Cost Estimates (AUD)

#### Development Environment

| Service | SKU | Quantity | Monthly Cost |
|---------|-----|----------|--------------|
| Azure OpenAI | S0 Standard | Usage-based | $100-500 |
| Azure AI Search | Standard | 1 instance | $280 |
| PostgreSQL Flexible | B2s Burstable | 1 server | $65 |
| Container Apps | Consumption | 2 apps | $50-150 |
| Blob Storage | Standard LRS | ~100 GB | $20 |
| Container Registry | Basic | 1 registry | $7 |
| Log Analytics | Pay-as-you-go | ~10 GB/month | $20-50 |
| Key Vault | Standard | 1 vault | $5 |
| Logic Apps | Consumption | ~100 runs/month | $5 |
| **TOTAL** | | | **$545-1,075/month** |

#### Production Environment

| Service | SKU | Quantity | Monthly Cost |
|---------|-----|----------|--------------|
| Azure OpenAI | S0 Standard | Usage-based | $500-2,000 |
| Azure AI Search | Standard | 3 replicas | $840 |
| PostgreSQL Flexible | D4s General Purpose | 1 server (HA) | $450 |
| Container Apps | Consumption | 2 apps (3-10 replicas) | $300-600 |
| Blob Storage | Standard GRS | ~500 GB | $100 |
| Container Registry | Standard | 1 registry | $27 |
| Log Analytics | Pay-as-you-go | ~100 GB/month | $150-300 |
| Key Vault | Standard | 1 vault | $5 |
| Logic Apps | Consumption | ~500 runs/month | $10 |
| **TOTAL** | | | **$2,382-4,332/month** |

### Cost Optimization Tips

1. **Use Consumption Tier:** Container Apps scale to zero when idle
2. **Right-size Database:** Start with Burstable tier, upgrade when needed
3. **Lifecycle Policies:** Auto-delete old blobs after 90 days
4. **Log Retention:** Keep logs for 90 days max
5. **Dev Environment:** Shut down nights/weekends with automation
6. **OpenAI Caching:** Cache embeddings and common analyses
7. **AI Search:** Use Standard tier only (skip Premium unless needed)

**Automated Dev Environment Shutdown:**
```bash
# Stop dev environment (nights/weekends)
az containerapp update \
  --name ca-redenergy-marcom-agent-dev-api \
  --resource-group rg-redenergy-marcom-agent-dev \
  --min-replicas 0

# Stop PostgreSQL (saves ~$45/month)
az postgres flexible-server stop \
  --name psql-redenergy-marcom-agent-dev-XXXXX \
  --resource-group rg-redenergy-marcom-agent-dev

# Start again Monday morning (automated with Logic App)
```

---

## Step-by-Step Materialization Guide

This section provides **exact commands** to materialize this entire architecture from scratch for a new project.

### Phase 1: Local Development Setup (Day 1)

#### Step 1: Install Prerequisites

```bash
# macOS - Install all required tools
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install rbenv ruby-build postgresql@14 redis node@20 azure-cli gh

# Initialize rbenv
echo 'eval "$(rbenv init -)"' >> ~/.zshrc
source ~/.zshrc

# Install Ruby 3.2.0
rbenv install 3.2.0
rbenv global 3.2.0

# Verify
ruby --version  # Should be 3.2.0
```

#### Step 2: Create Project Structure

```bash
# Create project directory
mkdir my-rag-app
cd my-rag-app

# Initialize Git
git init
gh repo create my-rag-app --private --source=. --remote=origin

# Create directory structure
mkdir -p app/{helpers,middleware,models,routes,services}
mkdir -p config
mkdir -p db/migrate
mkdir -p frontend/src/{components,services}
mkdir -p infrastructure/modules
mkdir -p script
mkdir -p test/results

# Create .gitignore
cat > .gitignore << 'EOF'
.env
.env.local
*.log
tmp/
node_modules/
.DS_Store
test/results/*.txt
deployment-*.json
EOF
```

#### Step 3: Initialize Ruby Application

```bash
# Create Gemfile
cat > Gemfile << 'EOF'
source 'https://rubygems.org'
ruby '~> 3.2'

gem 'sinatra', '~> 4.0'
gem 'sinatra-contrib', '~> 4.0'
gem 'puma', '~> 6.4'
gem 'activerecord', '~> 7.2'
gem 'pg', '~> 1.5'
gem 'rake', '~> 13.2'
gem 'dotenv', '~> 3.1'
gem 'httparty', '~> 0.22'
gem 'oj', '~> 3.16'
gem 'nokogiri', '~> 1.16'

group :development, :test do
  gem 'rspec', '~> 3.13'
  gem 'rubocop', '~> 1.69'
  gem 'pry', '~> 0.14'
end

group :test do
  gem 'rack-test', '~> 2.1'
end
EOF

# Install gems
bundle install

# Create Rakefile
cat > Rakefile << 'EOF'
require 'active_record'
require 'dotenv/load'
require_relative 'config/database'

namespace :db do
  desc 'Run database migrations'
  task :migrate do
    Database.establish_connection
    ActiveRecord::MigrationContext.new('db/migrate').migrate
    puts "✅ Migrations complete"
  end
  
  desc 'Create database'
  task :create do
    Database.create_database
  end
  
  desc 'Drop database'
  task :drop do
    Database.drop_database
  end
end
EOF
```

#### Step 4: Create Database Configuration

```bash
# Create database.rb
cat > config/database.rb << 'EOF'
require 'active_record'
require 'dotenv/load'

module Database
  def self.establish_connection
    database_url = ENV.fetch('DATABASE_URL') do
      raise 'DATABASE_URL not found. Check your .env file.'
    end
    
    ActiveRecord::Base.establish_connection(database_url)
    ActiveRecord::Base.logger = Logger.new($stdout) if ENV['RACK_ENV'] == 'development'
    
    puts "✅ Connected to PostgreSQL"
  end
  
  def self.create_database
    uri = URI.parse(ENV['DATABASE_URL'])
    db_name = uri.path[1..]
    
    base_url = ENV['DATABASE_URL'].gsub(/\/[^\/]+$/, '/postgres')
    ActiveRecord::Base.establish_connection(base_url)
    ActiveRecord::Base.connection.create_database(db_name)
    
    puts "✅ Database '#{db_name}' created"
  rescue ActiveRecord::DatabaseAlreadyExists
    puts "ℹ️  Database already exists"
  end
end
EOF

# Create database.yml
cat > config/database.yml << 'EOF'
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>

development:
  <<: *default
  url: <%= ENV['DATABASE_URL'] %>

test:
  <<: *default
  url: <%= ENV['DATABASE_URL'] %>

production:
  <<: *default
  url: <%= ENV['DATABASE_URL'] %>
EOF
```

#### Step 5: Create Main Sinatra Application

```bash
# Create app.rb
cat > app.rb << 'EOF'
require 'sinatra/base'
require 'sinatra/json'
require 'active_record'
require 'dotenv/load'
require 'rack/cors'

require_relative 'config/database'

Dir[File.join(__dir__, 'app', 'models', '**', '*.rb')].each { |file| require file }
Dir[File.join(__dir__, 'app', 'services', '**', '*.rb')].each { |file| require file }

class MyRagAPI < Sinatra::Base
  configure do
    set :show_exceptions, :after_handler
    set :raise_errors, false
    enable :logging
    set :default_content_type, 'application/json'
  end
  
  use Rack::Cors do
    allow do
      origins ENV.fetch('CORS_ORIGIN', 'http://localhost:5173')
      resource '/api/*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options]
    end
  end
  
  before do
    Database.establish_connection unless ActiveRecord::Base.connected?
  end
  
  get '/' do
    json({ 
      name: 'My RAG API',
      version: '1.0.0',
      status: 'operational'
    })
  end
  
  get '/health' do
    json({
      status: 'healthy',
      timestamp: Time.now.utc.iso8601,
      database: check_database_health
    })
  end
  
  private
  
  def check_database_health
    ActiveRecord::Base.connection.execute('SELECT 1')
    { status: 'healthy' }
  rescue => e
    { status: 'unhealthy', error: e.message }
  end
end
EOF

# Create config.ru
cat > config.ru << 'EOF'
require_relative 'app'
run MyRagAPI
EOF
```

#### Step 6: Create Environment File

```bash
# Create .env.example
cat > .env.example << 'EOF'
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/my_rag_app_dev

# Azure OpenAI
AZURE_OPENAI_KEY=your-key-here
AZURE_OPENAI_ENDPOINT=https://your-service.openai.azure.com/

# Azure AI Search
AZURE_SEARCH_KEY=your-key-here
AZURE_SEARCH_ENDPOINT=https://your-service.search.windows.net

# Application
RACK_ENV=development
CORS_ORIGIN=http://localhost:5173
EOF

# Create actual .env (edit values)
cp .env.example .env

# Setup local database
createdb my_rag_app_dev
echo "DATABASE_URL=postgresql://$(whoami)@localhost:5432/my_rag_app_dev" > .env
```

#### Step 7: Create First Migration

```bash
# Create content_submissions table
cat > db/migrate/20251126000001_create_content_submissions.rb << 'EOF'
class CreateContentSubmissions < ActiveRecord::Migration[7.2]
  def change
    create_table :content_submissions do |t|
      t.string :title, null: false, limit: 500
      t.text :body_content, null: false
      t.string :submission_type, null: false, limit: 50
      t.string :status, null: false, default: 'draft', limit: 50
      t.string :submitted_by, null: false
      t.timestamp :submitted_at, null: false, default: -> { 'NOW()' }
      t.jsonb :metadata
      
      t.timestamps
      
      t.index :status
      t.index :submitted_by
      t.index :submitted_at, order: { submitted_at: :desc }
    end
  end
end
EOF

# Run migration
bundle exec rake db:migrate
```

#### Step 8: Test Local Backend

```bash
# Start server
bundle exec rackup -p 4567 &

# Test health endpoint
curl http://localhost:4567/health

# Should return: {"status":"healthy","timestamp":"...","database":{"status":"healthy"}}
```

### Phase 2: Frontend Setup (Day 1-2)

#### Step 1: Initialize React Application

```bash
cd frontend

# Create package.json
cat > package.json << 'EOF'
{
  "name": "my-rag-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.460.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^6.0.5"
  }
}
EOF

# Install dependencies
npm install
```

#### Step 2: Configure Build Tools

```bash
# Create vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4567',
        changeOrigin: true
      }
    }
  }
})
EOF

# Create tailwind.config.js
cat > tailwind.config.js << 'EOF'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nordic-blue': '#4A5C6A',
        'nordic-light': '#9BA8AB',
        'nordic-cream': '#F1EEDC',
        'nordic-dark': '#2C3639',
        'nordic-green': '#7FA282',
        'nordic-red': '#C9585B',
      }
    }
  }
}
EOF

# Create postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
EOF
```

#### Step 3: Create React Application

```bash
# Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My RAG App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# Create src/main.jsx
mkdir -p src
cat > src/main.jsx << 'EOF'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
EOF

# Create src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
EOF

# Create src/App.jsx
cat > src/App.jsx << 'EOF'
import { useState } from 'react'
import { FileText } from 'lucide-react'

export default function App() {
  const [data, setData] = useState(null)
  
  async function testAPI() {
    const response = await fetch('http://localhost:4567/health')
    const json = await response.json()
    setData(json)
  }
  
  return (
    <div className="min-h-screen bg-nordic-cream">
      <div className="container mx-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <FileText size={40} className="text-nordic-blue" />
          <h1 className="text-4xl font-bold text-nordic-dark">My RAG App</h1>
        </div>
        
        <button
          onClick={testAPI}
          className="px-6 py-3 bg-nordic-blue text-white rounded-lg hover:bg-opacity-90"
        >
          Test API Connection
        </button>
        
        {data && (
          <pre className="mt-4 p-4 bg-white rounded shadow">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
EOF

# Start dev server
npm run dev &
```

#### Step 4: Test Frontend

```bash
# Open browser
open http://localhost:5173

# Click "Test API Connection" button
# Should display health check response
```

### Phase 3: Azure Infrastructure (Day 2-3)

#### Step 1: Create Bicep Templates

Copy the complete Bicep templates from `infrastructure/` directory in this project:

```bash
cd ..
mkdir -p infrastructure/modules

# Copy main.bicep and modules/infrastructure.bicep from this project
# Or create minimal versions for your specific needs

# Create parameters file
cat > infrastructure/parameters.dev.json << 'EOF'
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "environment": {
      "value": "dev"
    },
    "location": {
      "value": "australiaeast"
    },
    "companyName": {
      "value": "mycompany"
    },
    "projectName": {
      "value": "myragapp"
    }
  }
}
EOF
```

#### Step 2: Deploy to Azure

```bash
# Login to Azure
az login
az account set --subscription "Your Subscription"

# Set environment variables
export POSTGRES_ADMIN_PASSWORD="SecurePassword123!"
export ADMIN_EMAIL="admin@yourdomain.com"

# Deploy infrastructure
cd infrastructure
az deployment sub create \
  --name "myragapp-$(date +%Y%m%d-%H%M%S)" \
  --location australiaeast \
  --template-file main.bicep \
  --parameters parameters.dev.json \
  --parameters postgresAdminPassword="$POSTGRES_ADMIN_PASSWORD" \
  --parameters adminEmail="$ADMIN_EMAIL"

# Wait 10-15 minutes for deployment to complete
```

#### Step 3: Get Deployment Outputs

```bash
# Save outputs
az deployment sub show \
  --name "myragapp-YYYYMMDD-HHMMSS" \
  --query properties.outputs --output json > ../deployment-outputs.json

# Extract values
cd ..
cat deployment-outputs.json | jq -r '.apiUrl.value'
cat deployment-outputs.json | jq -r '.frontendUrl.value'
cat deployment-outputs.json | jq -r '.postgresqlFqdn.value'
```

### Phase 4: Deploy Application (Day 3)

#### Step 1: Create Dockerfiles

```bash
# Create Dockerfile.api
cat > Dockerfile.api << 'EOF'
FROM ruby:3.2-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install --without development test

COPY . .

EXPOSE 9292

CMD ["bundle", "exec", "rackup", "-p", "9292", "-o", "0.0.0.0"]
EOF

# Create Dockerfile.frontend
cat > frontend/Dockerfile.frontend << 'EOF'
FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create nginx.conf for frontend
cat > frontend/nginx.conf << 'EOF'
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
```

#### Step 2: Build and Push Images

```bash
# Get ACR details from deployment outputs
ACR_SERVER=$(jq -r '.containerRegistryLoginServer.value' deployment-outputs.json)
RESOURCE_GROUP=$(jq -r '.resourceGroupName.value' deployment-outputs.json)

# Login to ACR
az acr login --name ${ACR_SERVER%%.*}

# Build and push API
docker build -f Dockerfile.api -t $ACR_SERVER/myragapp-api:latest .
docker push $ACR_SERVER/myragapp-api:latest

# Build and push Frontend
docker build -f frontend/Dockerfile.frontend -t $ACR_SERVER/myragapp-frontend:latest ./frontend
docker push $ACR_SERVER/myragapp-frontend:latest
```

#### Step 3: Update Container Apps

```bash
# Update API Container App
az containerapp update \
  --name ca-mycompany-myragapp-dev-api \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_SERVER/myragapp-api:latest

# Update Frontend Container App
az containerapp update \
  --name ca-mycompany-myragapp-dev-frontend \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_SERVER/myragapp-frontend:latest
```

#### Step 4: Run Database Migrations

```bash
# Run migrations on Azure
az containerapp exec \
  --name ca-mycompany-myragapp-dev-api \
  --resource-group $RESOURCE_GROUP \
  --command "bundle exec rake db:migrate"
```

#### Step 5: Verify Deployment

```bash
# Get URLs
API_URL=$(jq -r '.apiUrl.value' deployment-outputs.json)
FRONTEND_URL=$(jq -r '.frontendUrl.value' deployment-outputs.json)

# Test API
curl $API_URL/health

# Open frontend
open $FRONTEND_URL
```

### Phase 5: CI/CD Setup (Day 4)

#### Step 1: Create GitHub Actions Workflow

```bash
mkdir -p .github/workflows

cat > .github/workflows/deploy-azure.yml << 'EOF'
name: Deploy to Azure

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Build and Push Docker Images
        run: |
          az acr login --name ${{ secrets.ACR_NAME }}
          
          docker build -f Dockerfile.api -t ${{ secrets.ACR_SERVER }}/myragapp-api:${{ github.sha }} .
          docker push ${{ secrets.ACR_SERVER }}/myragapp-api:${{ github.sha }}
          
          docker build -f frontend/Dockerfile.frontend -t ${{ secrets.ACR_SERVER }}/myragapp-frontend:${{ github.sha }} ./frontend
          docker push ${{ secrets.ACR_SERVER }}/myragapp-frontend:${{ github.sha }}
      
      - name: Deploy to Container Apps
        run: |
          az containerapp update \
            --name ca-mycompany-myragapp-dev-api \
            --resource-group ${{ secrets.RESOURCE_GROUP }} \
            --image ${{ secrets.ACR_SERVER }}/myragapp-api:${{ github.sha }}
          
          az containerapp update \
            --name ca-mycompany-myragapp-dev-frontend \
            --resource-group ${{ secrets.RESOURCE_GROUP }} \
            --image ${{ secrets.ACR_SERVER }}/myragapp-frontend:${{ github.sha }}
EOF
```

#### Step 2: Configure GitHub Secrets

```bash
# Create service principal
az ad sp create-for-rbac \
  --name "github-myragapp" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID \
  --sdk-auth > azure-credentials.json

# Add secrets to GitHub
gh secret set AZURE_CREDENTIALS < azure-credentials.json
gh secret set ACR_NAME --body "${ACR_SERVER%%.*}"
gh secret set ACR_SERVER --body "$ACR_SERVER"
gh secret set RESOURCE_GROUP --body "$RESOURCE_GROUP"

# Clean up local file
rm azure-credentials.json
```

#### Step 3: Test CI/CD

```bash
# Commit and push
git add .
git commit -m "Initial setup complete"
git push origin main

# Watch deployment
gh workflow view deploy-azure.yml --web
```

---

## Conclusion

This architecture document provides a **complete, battle-tested blueprint** for building modern RAG applications with:

✅ **Ruby/Sinatra backend** with ActiveRecord ORM  
✅ **React 19 frontend** with Vite and Tailwind CSS  
✅ **PostgreSQL database** with pgvector for embeddings  
✅ **Azure cloud infrastructure** with Bicep IaC  
✅ **Azure OpenAI integration** for GPT-4 and embeddings  
✅ **Azure AI Search** for vector similarity search  
✅ **Complete CI/CD pipeline** with GitHub Actions  
✅ **Production-ready security** with Key Vault and managed identities  
✅ **Comprehensive monitoring** with Application Insights  
✅ **Cost-effective scaling** with Container Apps

**Time to Production:** 3-4 days for experienced developers  
**Monthly Cost (Dev):** $545-1,075 AUD  
**Monthly Cost (Prod):** $2,382-4,332 AUD

**This architecture is proven in production** with the Red Energy Marcom Agent and ready to be replicated for new projects.

---

**Questions?** Refer to:
- `PRINCIPLES.md` - Detailed architectural principles
- `infrastructure/README.md` - Azure deployment guide
- `frontend/README.md` - Frontend development guide
- `README.md` - Project overview

**Support:** This architecture is maintained and used in production. All patterns are actively supported.

