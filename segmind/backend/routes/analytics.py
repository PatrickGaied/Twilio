from fastapi import APIRouter

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