from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime

from core.utils.schemas import CustomerSegment, Customer, CreateSegmentRequest, SegmentType

router = APIRouter()

# Mock data for demo
MOCK_SEGMENTS = [
    CustomerSegment(
        id="seg_1",
        name="High Converters",
        type=SegmentType.HIGH_CONVERTERS,
        description="Customers with >10% conversion rate",
        customer_count=2847,
        criteria={"conversion_rate": {"gt": 0.1}},
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    CustomerSegment(
        id="seg_2",
        name="Window Shoppers",
        type=SegmentType.WINDOW_SHOPPERS,
        description="High browser activity, no purchases",
        customer_count=15623,
        criteria={"views": {"gt": 10}, "purchases": {"eq": 0}},
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    CustomerSegment(
        id="seg_3",
        name="Cart Abandoners",
        type=SegmentType.CART_ABANDONERS,
        description="Items in cart but no checkout",
        customer_count=8941,
        criteria={"cart_events": {"gt": 0}, "purchase_events": {"eq": 0}},
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    CustomerSegment(
        id="seg_4",
        name="Loyal Customers",
        type=SegmentType.LOYAL_CUSTOMERS,
        description="3+ purchases in last 90 days",
        customer_count=4256,
        criteria={"purchases_90d": {"gte": 3}},
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    CustomerSegment(
        id="seg_5",
        name="At Risk",
        type=SegmentType.AT_RISK,
        description="No activity in 30+ days",
        customer_count=12387,
        criteria={"last_activity": {"lt": "30_days_ago"}},
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
]

MOCK_CUSTOMERS = [
    Customer(
        id="cust_1",
        email="john@example.com",
        phone="+1234567890",
        first_name="John",
        last_name="Doe",
        segment_ids=["seg_1"],
        total_orders=12,
        total_spent=2450.00,
        last_activity=datetime.now(),
        conversion_rate=0.15,
        lifetime_value=2450.00
    ),
    Customer(
        id="cust_2",
        email="jane@example.com",
        phone="+1234567891",
        first_name="Jane",
        last_name="Smith",
        segment_ids=["seg_2"],
        total_orders=0,
        total_spent=0.00,
        last_activity=datetime.now(),
        conversion_rate=0.0,
        lifetime_value=0.0
    ),
    Customer(
        id="cust_3",
        email="bob@example.com",
        phone="+1234567892",
        first_name="Bob",
        last_name="Johnson",
        segment_ids=["seg_3"],
        total_orders=0,
        total_spent=0.00,
        last_activity=datetime.now(),
        conversion_rate=0.0,
        lifetime_value=450.00  # Cart value
    )
]

@router.get("/", response_model=List[CustomerSegment])
async def get_segments():
    """Get all customer segments"""
    return MOCK_SEGMENTS

@router.get("/{segment_id}", response_model=CustomerSegment)
async def get_segment(segment_id: str):
    """Get a specific segment"""
    segment = next((s for s in MOCK_SEGMENTS if s.id == segment_id), None)
    if not segment:
        raise HTTPException(status_code=404, detail="Segment not found")
    return segment

@router.get("/{segment_id}/customers", response_model=List[Customer])
async def get_segment_customers(segment_id: str):
    """Get customers in a segment"""
    segment = next((s for s in MOCK_SEGMENTS if s.id == segment_id), None)
    if not segment:
        raise HTTPException(status_code=404, detail="Segment not found")

    # Filter customers by segment
    customers = [c for c in MOCK_CUSTOMERS if segment_id in c.segment_ids]
    return customers

@router.post("/", response_model=CustomerSegment)
async def create_segment(request: CreateSegmentRequest):
    """Create a new customer segment"""
    new_segment = CustomerSegment(
        id=f"seg_{uuid.uuid4().hex[:8]}",
        name=request.name,
        type=request.type,
        description=request.description,
        customer_count=0,  # Would be calculated based on criteria
        criteria=request.criteria,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    MOCK_SEGMENTS.append(new_segment)
    return new_segment

@router.get("/stats/overview")
async def get_segment_overview():
    """Get segment overview statistics"""
    total_customers = sum(s.customer_count for s in MOCK_SEGMENTS)

    return {
        "total_segments": len(MOCK_SEGMENTS),
        "total_customers": total_customers,
        "segments": [
            {
                "name": s.name,
                "count": s.customer_count,
                "percentage": round((s.customer_count / total_customers) * 100, 1)
            }
            for s in MOCK_SEGMENTS
        ],
        "top_revenue_segment": {
            "name": "High Converters",
            "avg_ltv": 2450.00
        }
    }