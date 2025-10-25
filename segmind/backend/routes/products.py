from fastapi import APIRouter

router = APIRouter(prefix="/api/products", tags=["products"])
analytics_router = APIRouter(prefix="/api/analytics/products", tags=["products-analytics"])

@router.get("/")
def get_products():
    """Returns product analytics data"""
    return [
        {
            "id": "prod_001",
            "name": "iPhone 15 Pro",
            "category": "Electronics",
            "price": 999.99,
            "sales": 8934,
            "revenue": 8930066.00,
            "conversion_rate": 12.4,
            "avg_rating": 4.8,
            "inventory": 245,
            "clicks": 72000,
            "views": 125000,
            "cart_adds": 15600,
            "checkout_rate": 57.3
        },
        {
            "id": "prod_002",
            "name": "AirPods Pro",
            "category": "Electronics",
            "price": 249.99,
            "sales": 5621,
            "revenue": 1405224.79,
            "conversion_rate": 8.9,
            "avg_rating": 4.6,
            "inventory": 892,
            "clicks": 63200,
            "views": 98500,
            "cart_adds": 8900,
            "checkout_rate": 63.1
        },
        {
            "id": "prod_003",
            "name": "MacBook Air M3",
            "category": "Electronics",
            "price": 1299.99,
            "sales": 2156,
            "revenue": 2803178.44,
            "conversion_rate": 15.2,
            "avg_rating": 4.9,
            "inventory": 78,
            "clicks": 14200,
            "views": 32000,
            "cart_adds": 4860,
            "checkout_rate": 44.4
        },
        {
            "id": "prod_004",
            "name": "Nike Air Max",
            "category": "Fashion",
            "price": 129.99,
            "sales": 3847,
            "revenue": 499963.53,
            "conversion_rate": 6.8,
            "avg_rating": 4.3,
            "inventory": 1240,
            "clicks": 56600,
            "views": 89300,
            "cart_adds": 6070,
            "checkout_rate": 63.4
        },
        {
            "id": "prod_005",
            "name": "Coffee Maker Elite",
            "category": "Home",
            "price": 89.99,
            "sales": 1923,
            "revenue": 173069.77,
            "conversion_rate": 4.2,
            "avg_rating": 4.1,
            "inventory": 456,
            "clicks": 45800,
            "views": 67200,
            "cart_adds": 2820,
            "checkout_rate": 68.2
        }
    ]

@router.get("/stats/overview")
def products_overview():
    """Returns product performance overview"""
    return {
        "total_products": 1247,
        "total_revenue": 15811502.53,
        "avg_conversion_rate": 9.5,
        "top_category": "Electronics",
        "low_stock_items": 23,
        "trending_products": 12,
        "monthly_growth": 14.2
    }

@analytics_router.get("/top")
def get_top_products():
    """Returns top products with segment analysis"""
    return {
        "top_products": [
            {
                "product_id": "prod_1001",
                "name": "iPhone 15 Pro",
                "category": "electronics.smartphone",
                "brand": "Apple",
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
                "brand": "Samsung",
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
                "brand": "Apple",
                "total_sales": 1456,
                "revenue": 1891244.00,
                "avg_price": 1299.99,
                "top_segment": "High Converters",
                "segment_distribution": {
                    "high_converters": 52.1,
                    "loyal_customers": 28.3,
                    "window_shoppers": 12.4,
                    "cart_abandoners": 5.2,
                    "at_risk": 2.0
                }
            },
            {
                "product_id": "prod_1004",
                "name": "AirPods Pro",
                "category": "electronics.audio",
                "brand": "Apple",
                "total_sales": 3421,
                "revenue": 855250.00,
                "avg_price": 249.99,
                "top_segment": "Window Shoppers",
                "segment_distribution": {
                    "window_shoppers": 42.3,
                    "loyal_customers": 24.1,
                    "high_converters": 18.6,
                    "cart_abandoners": 11.2,
                    "at_risk": 3.8
                }
            },
            {
                "product_id": "prod_1005",
                "name": "Sony WH-1000XM5",
                "category": "electronics.audio",
                "brand": "Sony",
                "total_sales": 987,
                "revenue": 394800.00,
                "avg_price": 399.99,
                "top_segment": "High Converters",
                "segment_distribution": {
                    "high_converters": 39.1,
                    "loyal_customers": 31.2,
                    "window_shoppers": 16.5,
                    "cart_abandoners": 8.7,
                    "at_risk": 4.5
                }
            },
            {
                "product_id": "prod_1006",
                "name": "Nintendo Switch OLED",
                "category": "electronics.gaming",
                "brand": "Nintendo",
                "total_sales": 2134,
                "revenue": 747900.00,
                "avg_price": 349.99,
                "top_segment": "Cart Abandoners",
                "segment_distribution": {
                    "cart_abandoners": 34.2,
                    "window_shoppers": 26.8,
                    "loyal_customers": 19.4,
                    "high_converters": 12.1,
                    "at_risk": 7.5
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
                "total_sales": 1456,
                "revenue": 1891244.00,
                "avg_conversion_rate": 15.2,
                "top_segment": "High Converters",
                "messaging_opportunity": "Professional productivity messaging for premium users"
            },
            {
                "category": "electronics.audio",
                "total_sales": 4408,
                "revenue": 1250050.00,
                "avg_conversion_rate": 6.8,
                "top_segment": "Window Shoppers",
                "messaging_opportunity": "Audio quality education and comparison campaigns"
            }
        ],
        "electronics_insights": {
            "total_electronics_revenue": 8610790.00,
            "electronics_percentage_of_total": 68.4,
            "avg_electronics_order_value": 789.50,
            "top_electronics_segment": "High Converters",
            "cart_abandonment_rate_electronics": 23.7
        }
    }