from fastapi import APIRouter
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/channels")
def analytics_channels():
    """Returns channel performance metrics"""
    return {
        "channels": [
            {"name": "SMS", "messages_sent": 89456, "delivery_rate": 98.9, "open_rate": 89.2, "click_rate": 12.4, "roi": 12.1},
            {"name": "Email", "messages_sent": 45678, "delivery_rate": 96.8, "open_rate": 18.5, "click_rate": 4.2, "roi": 15.6},
            {"name": "WhatsApp", "messages_sent": 12345, "delivery_rate": 99.1, "open_rate": 95.6, "click_rate": 18.9, "roi": 22.3},
            {"name": "Push", "messages_sent": 9310, "delivery_rate": 94.2, "open_rate": 12.8, "click_rate": 2.1, "roi": 8.7}
        ]
    }

@router.get("/overview")
def analytics_overview():
    """Returns overall analytics metrics"""
    return {
        "total_messages_sent": 156789,
        "total_customers": 44054,
        "active_campaigns": 3,
        "revenue_attributed": 2847593.45,
        "avg_engagement_rate": 24.7,
        "monthly_growth": 18.5
    }

@router.get("/realtime")
def analytics_realtime():
    """Returns real-time metrics for today"""
    return {
        "messages_sent_today": 4567,
        "revenue_today": 12456.78,
        "recent_conversions": 23,
        "top_selling_product_today": "iPhone 15 Pro",
        "electronics_sales_today": 8934,
        "live_metrics": {
            "messages_per_minute": 12,
            "delivery_rate_today": 97.8,
            "engagement_rate_today": 26.3
        }
    }

@router.get("/engagement")
def analytics_engagement():
    """Returns engagement analytics data"""
    # Generate time series data for the last 30 days
    base_date = datetime.now() - timedelta(days=30)
    daily_data = []

    for i in range(30):
        date = base_date + timedelta(days=i)
        daily_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "opens": random.randint(800, 1200),
            "clicks": random.randint(200, 400),
            "conversions": random.randint(20, 80),
            "engagement_rate": round(random.uniform(15, 35), 1),
            "bounce_rate": round(random.uniform(5, 15), 1)
        })

    return {
        "daily_engagement": daily_data,
        "total_opens": sum(d["opens"] for d in daily_data),
        "total_clicks": sum(d["clicks"] for d in daily_data),
        "total_conversions": sum(d["conversions"] for d in daily_data),
        "avg_engagement_rate": round(sum(d["engagement_rate"] for d in daily_data) / len(daily_data), 1),
        "avg_bounce_rate": round(sum(d["bounce_rate"] for d in daily_data) / len(daily_data), 1),
        "top_performing_campaigns": [
            {"name": "iPhone 15 Pro Campaign", "engagement_rate": 45.2, "clicks": 3420},
            {"name": "Black Friday Sale", "engagement_rate": 38.7, "clicks": 2890},
            {"name": "Welcome Series", "engagement_rate": 32.1, "clicks": 2340}
        ]
    }

@router.get("/segments/performance")
def analytics_segments_performance():
    """Returns segment performance data"""
    return {
        "segments": [
            {
                "id": "seg_001",
                "name": "High Value Customers",
                "size": 2340,
                "avg_order_value": 847.50,
                "conversion_rate": 12.4,
                "engagement_rate": 45.2,
                "revenue": 1982580,
                "growth": 15.6
            },
            {
                "id": "seg_002",
                "name": "Window Shoppers",
                "size": 8920,
                "avg_order_value": 234.80,
                "conversion_rate": 3.2,
                "engagement_rate": 18.7,
                "revenue": 324560,
                "growth": -2.3
            },
            {
                "id": "seg_003",
                "name": "Repeat Buyers",
                "size": 5680,
                "avg_order_value": 567.30,
                "conversion_rate": 8.9,
                "engagement_rate": 34.5,
                "revenue": 856740,
                "growth": 22.1
            },
            {
                "id": "seg_004",
                "name": "Mobile Users",
                "size": 12450,
                "avg_order_value": 189.60,
                "conversion_rate": 5.7,
                "engagement_rate": 28.3,
                "revenue": 567890,
                "growth": 8.4
            }
        ],
        "total_segments": 4,
        "total_customers_segmented": 29390,
        "best_performing_segment": "High Value Customers",
        "segment_distribution": [
            {"name": "High Value", "value": 2340, "percentage": 8.0},
            {"name": "Window Shoppers", "value": 8920, "percentage": 30.3},
            {"name": "Repeat Buyers", "value": 5680, "percentage": 19.3},
            {"name": "Mobile Users", "value": 12450, "percentage": 42.4}
        ]
    }

@router.get("/revenue")
def analytics_revenue():
    """Returns revenue analytics data"""
    # Generate monthly revenue data
    base_date = datetime.now() - timedelta(days=365)
    monthly_data = []

    for i in range(12):
        date = base_date + timedelta(days=i*30)
        monthly_data.append({
            "month": date.strftime("%b %Y"),
            "revenue": random.randint(180000, 320000),
            "orders": random.randint(800, 1500),
            "avg_order_value": round(random.uniform(180, 280), 2)
        })

    # Generate daily revenue for last 30 days
    daily_revenue = []
    for i in range(30):
        date = (datetime.now() - timedelta(days=29-i))
        daily_revenue.append({
            "date": date.strftime("%Y-%m-%d"),
            "revenue": random.randint(8000, 15000),
            "orders": random.randint(40, 80)
        })

    return {
        "monthly_revenue": monthly_data,
        "daily_revenue": daily_revenue,
        "total_revenue_this_month": sum(d["revenue"] for d in daily_revenue),
        "total_orders_this_month": sum(d["orders"] for d in daily_revenue),
        "revenue_growth": 18.5,
        "top_products": [
            {"name": "iPhone 15 Pro", "revenue": 456789, "units": 543, "growth": 23.4},
            {"name": "Samsung Galaxy S24", "revenue": 234567, "units": 321, "growth": 12.1},
            {"name": "MacBook Pro M3", "revenue": 345678, "units": 178, "growth": 45.6},
            {"name": "AirPods Pro", "revenue": 123456, "units": 892, "growth": 8.9}
        ],
        "revenue_by_channel": [
            {"channel": "Website", "revenue": 1234567, "percentage": 45.2},
            {"channel": "Mobile App", "revenue": 987654, "percentage": 36.1},
            {"channel": "Social Media", "revenue": 345678, "percentage": 12.6},
            {"channel": "Email Campaign", "revenue": 167890, "percentage": 6.1}
        ]
    }