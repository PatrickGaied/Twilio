from fastapi import APIRouter

router = APIRouter(prefix="/api/segments", tags=["segments"])

@router.get("/")
def get_segments():
    """Returns detailed customer segments for management"""
    return [
        {
            "id": "seg_001",
            "name": "High Converters",
            "type": "behavioral",
            "description": "Customers with conversion rate > 10% and multiple purchases",
            "customer_count": 2847,
            "criteria": {"conversion_rate": "> 10%", "total_orders": "> 3"},
            "created_at": "2024-01-15T08:30:00Z",
            "updated_at": "2024-10-20T14:22:00Z"
        },
        {
            "id": "seg_002",
            "name": "Window Shoppers",
            "type": "engagement",
            "description": "High site engagement but low purchase rate",
            "customer_count": 15623,
            "criteria": {"page_views": "> 20", "conversion_rate": "< 2%"},
            "created_at": "2024-01-15T08:30:00Z",
            "updated_at": "2024-10-18T11:15:00Z"
        },
        {
            "id": "seg_003",
            "name": "Cart Abandoners",
            "type": "behavioral",
            "description": "Users who add items to cart but don't complete purchase",
            "customer_count": 8941,
            "criteria": {"cart_abandonment": "true", "days_since_cart": "< 7"},
            "created_at": "2024-01-15T08:30:00Z",
            "updated_at": "2024-10-22T16:45:00Z"
        },
        {
            "id": "seg_004",
            "name": "Loyal Customers",
            "type": "value",
            "description": "Repeat customers with high lifetime value",
            "customer_count": 4256,
            "criteria": {"total_orders": "> 5", "lifetime_value": "> $500"},
            "created_at": "2024-01-15T08:30:00Z",
            "updated_at": "2024-10-19T09:33:00Z"
        },
        {
            "id": "seg_005",
            "name": "At Risk",
            "type": "retention",
            "description": "Previously active customers who haven't purchased recently",
            "customer_count": 12387,
            "criteria": {"days_since_last_order": "> 60", "previous_orders": "> 1"},
            "created_at": "2024-01-15T08:30:00Z",
            "updated_at": "2024-10-21T13:12:00Z"
        }
    ]

@router.get("/stats/overview")
def segments_overview():
    """Returns customer segment statistics overview"""
    return {
        "segments": [
            {"name": "High Converters", "count": 2847, "percentage": 6.5},
            {"name": "Window Shoppers", "count": 15623, "percentage": 35.4},
            {"name": "Cart Abandoners", "count": 8941, "percentage": 20.3},
            {"name": "Loyal Customers", "count": 4256, "percentage": 9.7},
            {"name": "At Risk", "count": 12387, "percentage": 28.1}
        ]
    }