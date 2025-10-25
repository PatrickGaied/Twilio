# Segmind - Customer Messaging & Analytics Platform

A Twilio-like messaging platform with advanced customer segmentation and analytics capabilities.

## Features

- 🎯 **Customer Segmentation**: Identify high-value customers, cart abandoners, and window shoppers
- 📊 **Real-time Analytics**: Track messaging performance and customer engagement
- 💬 **Multi-channel Messaging**: SMS, email, and push notifications
- 🔄 **Automated Workflows**: Cart abandonment recovery, lifecycle campaigns
- 📈 **Revenue Insights**: Track conversion rates and messaging ROI

## Quick Start

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   cd frontend && npm install
   ```

2. **Start the backend**:
   ```bash
   ./run.sh backend
   ```

3. **Start the frontend**:
   ```bash
   ./run.sh frontend
   ```

4. **Seed demo data**:
   ```bash
   python scripts/seed_demo.py
   ```

## API Endpoints

### Customer Segmentation
- `GET /segments` - List all customer segments
- `POST /segments/create` - Create new segment
- `GET /segments/{id}/customers` - Get customers in segment

### Messaging
- `POST /messages/send` - Send single message
- `POST /campaigns/broadcast` - Send bulk messages
- `POST /automations/cart-recovery` - Set up cart abandonment workflow

### Analytics
- `GET /analytics/engagement` - Message engagement metrics
- `GET /analytics/revenue` - Revenue attribution
- `GET /analytics/segments` - Segment performance

## Architecture

- **Backend**: FastAPI with async/await support
- **Frontend**: Next.js with TypeScript
- **Database**: PostgreSQL with analytics queries
- **Messaging**: Multi-provider abstraction (Twilio, SendGrid, etc.)
- **Analytics**: Real-time event tracking and aggregation

## Customer Segments

1. **High Converters** (>10% conversion rate)
2. **Window Shoppers** (high views, no purchases)
3. **Cart Abandoners** (items in cart, no checkout)
4. **Loyal Customers** (repeat purchases)
5. **At-Risk** (declining engagement)

## Demo Data

The platform includes realistic e-commerce customer data with:
- 67M+ customer events
- Cart abandonment scenarios
- Purchase patterns
- Engagement metrics