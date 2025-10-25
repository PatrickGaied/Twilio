# Customer Messaging & Data Analytics Platform

A comprehensive platform combining Kaggle e-commerce data processing with a Twilio-like customer messaging MVP.

## 🚀 Quick Start

```bash
# Make the run script executable (if needed)
chmod +x run.sh

# Run the interactive menu
./run.sh
```

## 📁 Project Structure

```
.
├── run.sh              # Main interactive script
├── .env                # Environment variables
├── venv/               # Python virtual environment
├── kaggle_tools/       # E-commerce data processing
│   ├── load_ecommerce_to_sqlite.py
│   ├── upload_sample_to_supabase.py
│   ├── query_supabase.py
│   └── customer_insights_for_messaging.py
└── segmind/            # MVP Messaging Platform
    ├── backend/        # FastAPI backend
    ├── frontend/       # Next.js dashboard
    ├── sdk/            # JavaScript SDK
    └── scripts/        # Demo data tools
```

## 🎯 Features

### Segmind MVP (Customer Messaging Platform)
- **Customer Segmentation**: 5 predefined segments (High Converters, Cart Abandoners, etc.)
- **Multi-channel Messaging**: SMS, Email, WhatsApp, Push notifications
- **Real-time Analytics**: Engagement rates, ROI tracking, revenue attribution
- **Interactive Dashboard**: Customer insights with charts and metrics
- **JavaScript SDK**: Easy integration for e-commerce tracking

### Kaggle Data Tools
- **Data Processing**: Load 67M+ e-commerce events from Kaggle
- **Supabase Integration**: Upload and query customer data
- **Customer Insights**: Extract actionable segmentation data
- **Analytics**: Cart abandonment, conversion rates, engagement patterns

## 🛠️ Available Commands

### Interactive Menu (`./run.sh`)
```
📊 KAGGLE TOOLS:
  1) Load Kaggle CSV to SQLite
  2) Upload sample to Supabase
  3) Query Supabase data
  4) Generate customer insights

🎯 SEGMIND MVP:
  5) Start backend only
  6) Start frontend only
  7) Start full application
  8) Seed demo data
  9) Install frontend dependencies

🛠️ UTILITIES:
  10) Setup environment
  11) Check system status
  12) Clean up
  13) Show help
```

## 📊 Customer Segments

1. **High Converters** (6.5%) - Premium customers with >10% conversion rate
2. **Cart Abandoners** (20.3%) - $339 average cart value recovery opportunity
3. **Window Shoppers** (35.4%) - High engagement, low conversion
4. **Loyal Customers** (9.7%) - VIP treatment and retention focus
5. **At Risk** (28.1%) - Re-engagement campaign targets

## 🔧 Environment Setup

The script will automatically:
1. Create Python virtual environment
2. Install all dependencies
3. Set up environment variables template
4. Install frontend Node.js packages

## 🌐 URLs

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📈 Key Metrics Tracked

- **Messages Sent**: 156K+ total messages
- **Revenue Attribution**: $2.8M+ tracked revenue
- **Engagement Rate**: 24.7% average across channels
- **ROI by Channel**: SMS (12.1%), Email (15.6%), WhatsApp (22.3%)

## 🎮 Demo Workflow

1. **Setup**: `./run.sh` → Option 10 (Setup environment)
2. **Start**: Option 7 (Start full application)
3. **Seed Data**: Option 8 (Seed demo data)
4. **Explore**: Visit http://localhost:3000
5. **Analytics**: View customer segments and messaging performance

## 💡 Use Cases

- **E-commerce Platforms**: Cart abandonment recovery, customer lifecycle messaging
- **SaaS Companies**: User onboarding, engagement campaigns
- **Marketing Teams**: Customer segmentation, campaign performance tracking
- **Developers**: Twilio alternative with advanced analytics

## 🔄 Data Flow

1. **Kaggle Data** → SQLite → Supabase
2. **Customer Events** → Segmentation Engine → Targeted Campaigns
3. **Message Delivery** → Analytics → Performance Insights
4. **ROI Tracking** → Revenue Attribution → Business Intelligence

Start with `./run.sh` and follow the interactive menu!