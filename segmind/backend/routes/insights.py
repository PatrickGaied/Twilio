from fastapi import APIRouter

router = APIRouter(prefix="/api/insights", tags=["insights"])

@router.get("/product-segment-correlations")
def get_product_segment_insights():
    """Returns AI-powered product-segment affinity insights"""
    return [
        {
            "product_id": "prod_1001",
            "product": "iPhone 15 Pro",
            "segment": "High Converters",
            "affinity_score": 92,
            "conversion_rate": 28.4,
            "revenue": 487650,
            "sales_count": 342,
            "insight": "High Converters show exceptional affinity for premium Apple products",
            "recommendation": "Create premium positioning campaigns emphasizing exclusivity and advanced features"
        },
        {
            "product_id": "prod_1002",
            "product": "Samsung Galaxy S24",
            "segment": "Loyal Customers",
            "affinity_score": 87,
            "conversion_rate": 23.1,
            "revenue": 298420,
            "sales_count": 256,
            "insight": "Loyal Customers prefer Samsung for repeat purchases and upgrades",
            "recommendation": "Highlight upgrade benefits and loyalty rewards in campaigns"
        },
        {
            "product_id": "prod_1003",
            "product": "MacBook Air M3",
            "segment": "High Converters",
            "affinity_score": 89,
            "conversion_rate": 31.2,
            "revenue": 623150,
            "sales_count": 289,
            "insight": "Professional-grade products resonate strongly with high-value customers",
            "recommendation": "Focus on productivity and professional use cases in messaging"
        },
        {
            "product_id": "prod_1004",
            "product": "AirPods Pro",
            "segment": "Window Shoppers",
            "affinity_score": 76,
            "conversion_rate": 12.8,
            "revenue": 156830,
            "sales_count": 478,
            "insight": "Entry-level premium accessories attract browsing customers",
            "recommendation": "Use bundle offers and time-limited promotions to drive conversion"
        },
        {
            "product_id": "prod_1005",
            "product": "iPad Pro",
            "segment": "Creative Professionals",
            "affinity_score": 94,
            "conversion_rate": 34.7,
            "revenue": 445720,
            "sales_count": 187,
            "insight": "Creative segment shows highest affinity for professional tablets",
            "recommendation": "Showcase creative workflows and professional tools integration"
        }
    ]

@router.get("/segment-performance/{segment_id}")
def get_segment_performance(segment_id: str):
    """Returns detailed performance metrics for a specific segment"""
    # Mock data - in real implementation, this would query the database
    return {
        "segment_id": segment_id,
        "top_products": [
            {"product": "iPhone 15 Pro", "sales": 342, "revenue": 487650},
            {"product": "MacBook Air M3", "sales": 289, "revenue": 623150},
            {"product": "AirPods Pro", "sales": 156, "revenue": 89400}
        ],
        "engagement_metrics": {
            "email_open_rate": 32.4,
            "click_through_rate": 8.7,
            "conversion_rate": 28.4
        },
        "trends": {
            "growth_rate": 12.3,
            "retention_rate": 84.2
        }
    }