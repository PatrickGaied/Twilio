from fastapi import APIRouter
from datetime import datetime, timedelta
from typing import Dict, List

from core.utils.schemas import AnalyticsMetrics

router = APIRouter()

@router.get("/overview")
async def get_analytics_overview():
    """Get high-level analytics overview"""
    return {
        "total_messages_sent": 156789,
        "total_customers": 44054,
        "active_campaigns": 3,
        "revenue_attributed": 2847593.45,
        "avg_engagement_rate": 24.7,
        "top_performing_channel": "SMS",
        "monthly_growth": 18.5
    }

@router.get("/engagement", response_model=AnalyticsMetrics)
async def get_engagement_metrics():
    """Get message engagement metrics"""
    return AnalyticsMetrics(
        total_messages=156789,
        delivery_rate=97.2,
        open_rate=24.7,
        click_rate=5.8,
        conversion_rate=2.1,
        revenue_attributed=2847593.45,
        cost_per_message=0.0075,
        roi=8.2
    )

@router.get("/channels")
async def get_channel_performance():
    """Get performance by channel"""
    return {
        "channels": [
            {
                "name": "SMS",
                "messages_sent": 89456,
                "delivery_rate": 98.9,
                "open_rate": 89.2,
                "click_rate": 12.4,
                "conversion_rate": 3.2,
                "cost_per_message": 0.0075,
                "roi": 12.1
            },
            {
                "name": "Email",
                "messages_sent": 45678,
                "delivery_rate": 96.8,
                "open_rate": 18.5,
                "click_rate": 4.2,
                "conversion_rate": 1.8,
                "cost_per_message": 0.002,
                "roi": 15.6
            },
            {
                "name": "WhatsApp",
                "messages_sent": 12345,
                "delivery_rate": 99.1,
                "open_rate": 95.6,
                "click_rate": 18.9,
                "conversion_rate": 4.1,
                "cost_per_message": 0.01,
                "roi": 22.3
            },
            {
                "name": "Push",
                "messages_sent": 9310,
                "delivery_rate": 94.2,
                "open_rate": 12.8,
                "click_rate": 2.1,
                "conversion_rate": 0.9,
                "cost_per_message": 0.001,
                "roi": 8.7
            }
        ]
    }

@router.get("/segments/performance")
async def get_segment_performance():
    """Get performance metrics by customer segment"""
    return {
        "segments": [
            {
                "name": "High Converters",
                "customer_count": 2847,
                "messages_sent": 8541,
                "avg_response_rate": 34.8,
                "avg_conversion_rate": 12.1,
                "revenue_per_customer": 2450.00,
                "roi": 18.9
            },
            {
                "name": "Cart Abandoners",
                "customer_count": 8941,
                "messages_sent": 26823,
                "avg_response_rate": 21.9,
                "avg_conversion_rate": 6.8,
                "revenue_per_customer": 339.06,
                "roi": 14.2
            },
            {
                "name": "Window Shoppers",
                "customer_count": 15623,
                "messages_sent": 46869,
                "avg_response_rate": 12.4,
                "avg_conversion_rate": 2.1,
                "revenue_per_customer": 85.50,
                "roi": 6.8
            },
            {
                "name": "Loyal Customers",
                "customer_count": 4256,
                "messages_sent": 17024,
                "avg_response_rate": 42.6,
                "avg_conversion_rate": 18.7,
                "revenue_per_customer": 1890.75,
                "roi": 25.4
            },
            {
                "name": "At Risk",
                "customer_count": 12387,
                "messages_sent": 37161,
                "avg_response_rate": 8.9,
                "avg_conversion_rate": 1.2,
                "revenue_per_customer": 67.25,
                "roi": 3.1
            }
        ]
    }

@router.get("/revenue")
async def get_revenue_analytics():
    """Get revenue attribution metrics"""
    return {
        "total_revenue_attributed": 2847593.45,
        "revenue_by_channel": {
            "SMS": 1423796.73,
            "Email": 854279.04,
            "WhatsApp": 398362.83,
            "Push": 171154.85
        },
        "revenue_by_segment": {
            "High Converters": 1247850.50,
            "Loyal Customers": 804512.75,
            "Cart Abandoners": 482678.90,
            "Window Shoppers": 234567.80,
            "At Risk": 77983.50
        },
        "monthly_trend": [
            {"month": "Jan", "revenue": 189456.78},
            {"month": "Feb", "revenue": 234567.89},
            {"month": "Mar", "revenue": 278901.23},
            {"month": "Apr", "revenue": 312345.67},
            {"month": "May", "revenue": 345678.90},
            {"month": "Jun", "revenue": 389012.34}
        ]
    }

@router.get("/campaigns/performance")
async def get_campaign_performance():
    """Get campaign performance metrics"""
    return {
        "campaigns": [
            {
                "name": "Cart Recovery - Electronics",
                "segment": "Cart Abandoners",
                "channel": "SMS",
                "sent": 1247,
                "delivered": 1198,
                "opened": 456,
                "clicked": 89,
                "converted": 27,
                "revenue": 9063.62,
                "roi": 12.1
            },
            {
                "name": "Welcome Series - New Users",
                "segment": "Window Shoppers",
                "channel": "Email",
                "sent": 892,
                "delivered": 887,
                "opened": 334,
                "clicked": 67,
                "converted": 12,
                "revenue": 1026.00,
                "roi": 8.9
            },
            {
                "name": "VIP Loyalty Rewards",
                "segment": "Loyal Customers",
                "channel": "Push",
                "sent": 4256,
                "delivered": 4201,
                "opened": 2100,
                "clicked": 567,
                "converted": 234,
                "revenue": 45678.90,
                "roi": 24.7
            }
        ]
    }

@router.get("/products/top")
async def get_top_products():
    """Get top selling products by category and segment"""
    return {
        "top_products": [
            {
                "product_id": "prod_1001",
                "name": "iPhone 15 Pro",
                "category": "electronics.smartphone",
                "brand": "apple",
                "total_sales": 2847,
                "revenue": 2567340.00,
                "avg_price": 1199.99,
                "top_segment": "High Converters",
                "segment_distribution": {
                    "high_converters": 45.2,
                    "loyal_customers": 32.1,
                    "window_shoppers": 15.7,
                    "cart_abandoners": 5.8,
                    "at_risk": 1.2
                }
            },
            {
                "product_id": "prod_1002",
                "name": "Samsung Galaxy S24",
                "category": "electronics.smartphone",
                "brand": "samsung",
                "total_sales": 1923,
                "revenue": 1634550.00,
                "avg_price": 999.99,
                "top_segment": "Loyal Customers",
                "segment_distribution": {
                    "loyal_customers": 38.4,
                    "high_converters": 28.9,
                    "window_shoppers": 18.2,
                    "cart_abandoners": 12.1,
                    "at_risk": 2.4
                }
            },
            {
                "product_id": "prod_1003",
                "name": "MacBook Air M3",
                "category": "electronics.laptop",
                "brand": "apple",
                "total_sales": 856,
                "revenue": 1198400.00,
                "avg_price": 1399.99,
                "top_segment": "High Converters",
                "segment_distribution": {
                    "high_converters": 52.1,
                    "loyal_customers": 31.8,
                    "window_shoppers": 12.4,
                    "cart_abandoners": 3.2,
                    "at_risk": 0.5
                }
            },
            {
                "product_id": "prod_1004",
                "name": "Sony WH-1000XM5",
                "category": "electronics.audio.headphone",
                "brand": "sony",
                "total_sales": 1234,
                "revenue": 370200.00,
                "avg_price": 299.99,
                "top_segment": "Window Shoppers",
                "segment_distribution": {
                    "window_shoppers": 42.3,
                    "loyal_customers": 25.7,
                    "high_converters": 18.9,
                    "cart_abandoners": 10.8,
                    "at_risk": 2.3
                }
            },
            {
                "product_id": "prod_1005",
                "name": "Nintendo Switch OLED",
                "category": "electronics.gaming",
                "brand": "nintendo",
                "total_sales": 987,
                "revenue": 346545.00,
                "avg_price": 349.99,
                "top_segment": "Cart Abandoners",
                "segment_distribution": {
                    "cart_abandoners": 35.6,
                    "window_shoppers": 28.4,
                    "loyal_customers": 21.2,
                    "high_converters": 12.1,
                    "at_risk": 2.7
                }
            }
        ],
        "category_performance": [
            {
                "category": "electronics.smartphone",
                "total_sales": 4770,
                "revenue": 4201890.00,
                "avg_conversion_rate": 8.4,
                "top_segment": "High Converters",
                "messaging_opportunity": "Premium smartphone campaigns for high-value customers"
            },
            {
                "category": "electronics.laptop",
                "total_sales": 1245,
                "revenue": 1987600.00,
                "avg_conversion_rate": 6.2,
                "top_segment": "High Converters",
                "messaging_opportunity": "Professional/productivity focused messaging"
            },
            {
                "category": "electronics.audio.headphone",
                "total_sales": 2156,
                "revenue": 647200.00,
                "avg_conversion_rate": 12.7,
                "top_segment": "Window Shoppers",
                "messaging_opportunity": "Audio quality demos and reviews"
            },
            {
                "category": "electronics.gaming",
                "total_sales": 1876,
                "revenue": 658600.00,
                "avg_conversion_rate": 5.3,
                "top_segment": "Cart Abandoners",
                "messaging_opportunity": "Gaming bundle offers and limited-time deals"
            },
            {
                "category": "electronics.tv",
                "total_sales": 743,
                "revenue": 1114500.00,
                "avg_conversion_rate": 4.1,
                "top_segment": "Loyal Customers",
                "messaging_opportunity": "Home entertainment upgrade campaigns"
            }
        ],
        "electronics_insights": {
            "total_electronics_revenue": 8610790.00,
            "electronics_percentage_of_total": 68.4,
            "avg_electronics_order_value": 789.50,
            "top_electronics_segment": "High Converters",
            "cart_abandonment_rate_electronics": 23.7,
            "recommended_campaigns": [
                "iPhone 15 launch campaign for High Converters",
                "Samsung vs Apple comparison for Loyal Customers",
                "Headphone trial program for Window Shoppers",
                "Gaming bundle flash sales for Cart Abandoners"
            ]
        }
    }

@router.get("/products/segments")
async def get_product_segment_analysis():
    """Detailed analysis of how products perform across segments"""
    return {
        "segment_preferences": {
            "high_converters": {
                "top_categories": ["electronics.smartphone", "electronics.laptop", "electronics.tablet"],
                "avg_order_value": 1247.80,
                "preferred_brands": ["apple", "samsung", "sony"],
                "conversion_triggers": ["premium features", "latest models", "brand prestige"],
                "messaging_strategy": "Focus on premium features and exclusivity"
            },
            "loyal_customers": {
                "top_categories": ["electronics.smartphone", "electronics.tv", "electronics.audio"],
                "avg_order_value": 892.40,
                "preferred_brands": ["samsung", "lg", "sony"],
                "conversion_triggers": ["loyalty rewards", "upgrades", "bundles"],
                "messaging_strategy": "VIP treatment and early access to new products"
            },
            "window_shoppers": {
                "top_categories": ["electronics.audio.headphone", "electronics.gaming", "electronics.accessories"],
                "avg_order_value": 234.60,
                "preferred_brands": ["sony", "nintendo", "xiaomi"],
                "conversion_triggers": ["reviews", "demos", "price drops"],
                "messaging_strategy": "Product education and social proof"
            },
            "cart_abandoners": {
                "top_categories": ["electronics.gaming", "electronics.smartphone", "electronics.tablet"],
                "avg_order_value": 456.80,
                "preferred_brands": ["nintendo", "xiaomi", "hp"],
                "conversion_triggers": ["discounts", "limited time offers", "free shipping"],
                "messaging_strategy": "Urgency and discount-focused campaigns"
            },
            "at_risk": {
                "top_categories": ["electronics.accessories", "electronics.audio", "electronics.gaming"],
                "avg_order_value": 127.30,
                "preferred_brands": ["xiaomi", "anker", "logitech"],
                "conversion_triggers": ["win-back offers", "nostalgia", "simplicity"],
                "messaging_strategy": "Simple re-engagement with strong incentives"
            }
        },
        "cross_sell_opportunities": [
            {
                "primary_product": "iPhone 15 Pro",
                "recommended_accessories": ["AirPods Pro", "iPhone Case", "MagSafe Charger"],
                "cross_sell_rate": 34.7,
                "revenue_uplift": 289.50
            },
            {
                "primary_product": "MacBook Air M3",
                "recommended_accessories": ["Magic Mouse", "USB-C Hub", "Laptop Sleeve"],
                "cross_sell_rate": 42.1,
                "revenue_uplift": 156.80
            },
            {
                "primary_product": "Nintendo Switch OLED",
                "recommended_accessories": ["Pro Controller", "Screen Protector", "Carrying Case"],
                "cross_sell_rate": 67.8,
                "revenue_uplift": 89.95
            }
        ]
    }

@router.get("/realtime")
async def get_realtime_metrics():
    """Get real-time metrics for the dashboard"""
    now = datetime.now()
    return {
        "timestamp": now.isoformat(),
        "messages_sent_today": 4567,
        "active_campaigns": 3,
        "revenue_today": 12456.78,
        "top_performing_segment": "Loyal Customers",
        "recent_conversions": 23,
        "top_selling_product_today": "iPhone 15 Pro",
        "electronics_sales_today": 8934.50,
        "live_metrics": {
            "messages_per_minute": 12,
            "delivery_rate_today": 97.8,
            "engagement_rate_today": 26.3
        }
    }