from fastapi import APIRouter

router = APIRouter(prefix="/api/segments", tags=["segments"])

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