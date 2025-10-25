from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime, timedelta

from core.utils.schemas import Message, Campaign, SendMessageRequest, CreateCampaignRequest, MessageChannel

router = APIRouter()

# Mock data
MOCK_MESSAGES = [
    Message(
        id="msg_1",
        customer_id="cust_1",
        channel=MessageChannel.SMS,
        content="Hi John! Your cart is waiting - complete your purchase and save 10%",
        status="delivered",
        sent_at=datetime.now() - timedelta(hours=2),
        delivered_at=datetime.now() - timedelta(hours=2, minutes=1),
        opened_at=datetime.now() - timedelta(hours=1, minutes=45)
    ),
    Message(
        id="msg_2",
        customer_id="cust_2",
        channel=MessageChannel.EMAIL,
        content="Welcome to our store! Here's 20% off your first purchase",
        subject="Welcome - 20% Off Inside!",
        status="opened",
        sent_at=datetime.now() - timedelta(hours=6),
        delivered_at=datetime.now() - timedelta(hours=6, minutes=1),
        opened_at=datetime.now() - timedelta(hours=3)
    ),
    Message(
        id="msg_3",
        customer_id="cust_3",
        channel=MessageChannel.WHATSAPP,
        content="🛒 Your Samsung Galaxy is still in your cart! Complete purchase now →",
        status="clicked",
        sent_at=datetime.now() - timedelta(hours=1),
        delivered_at=datetime.now() - timedelta(hours=1, minutes=1),
        opened_at=datetime.now() - timedelta(minutes=30),
        clicked_at=datetime.now() - timedelta(minutes=15)
    )
]

MOCK_CAMPAIGNS = [
    Campaign(
        id="camp_1",
        name="Cart Recovery - Electronics",
        segment_id="seg_3",
        channel=MessageChannel.SMS,
        content="Don't forget your {{product_name}}! Complete purchase and save {{discount}}%",
        status="active",
        sent_count=1247,
        delivered_count=1198,
        opened_count=456,
        clicked_count=89,
        created_at=datetime.now() - timedelta(days=3)
    ),
    Campaign(
        id="camp_2",
        name="Welcome Series - New Users",
        segment_id="seg_2",
        channel=MessageChannel.EMAIL,
        content="Welcome! Here's everything you need to know about our store",
        subject="Welcome to Segmind Store!",
        status="active",
        sent_count=892,
        delivered_count=887,
        opened_count=334,
        clicked_count=67,
        created_at=datetime.now() - timedelta(days=1)
    ),
    Campaign(
        id="camp_3",
        name="VIP Loyalty Rewards",
        segment_id="seg_4",
        channel=MessageChannel.PUSH,
        content="🎉 Exclusive VIP offer: 25% off premium products!",
        status="completed",
        sent_count=4256,
        delivered_count=4201,
        opened_count=2100,
        clicked_count=567,
        created_at=datetime.now() - timedelta(days=7)
    )
]

@router.post("/send", response_model=Message)
async def send_message(request: SendMessageRequest):
    """Send a single message"""
    new_message = Message(
        id=f"msg_{uuid.uuid4().hex[:8]}",
        customer_id=request.customer_id,
        channel=request.channel,
        content=request.content,
        subject=request.subject,
        status="sent",
        sent_at=datetime.now()
    )

    MOCK_MESSAGES.append(new_message)
    return new_message

@router.get("/messages", response_model=List[Message])
async def get_messages(limit: int = 50):
    """Get recent messages"""
    return MOCK_MESSAGES[-limit:]

@router.get("/messages/{message_id}", response_model=Message)
async def get_message(message_id: str):
    """Get a specific message"""
    message = next((m for m in MOCK_MESSAGES if m.id == message_id), None)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message

@router.post("/campaigns", response_model=Campaign)
async def create_campaign(request: CreateCampaignRequest):
    """Create a new campaign"""
    new_campaign = Campaign(
        id=f"camp_{uuid.uuid4().hex[:8]}",
        name=request.name,
        segment_id=request.segment_id,
        channel=request.channel,
        content=request.content,
        subject=request.subject,
        status="draft",
        sent_count=0,
        delivered_count=0,
        opened_count=0,
        clicked_count=0,
        created_at=datetime.now(),
        scheduled_at=request.scheduled_at
    )

    MOCK_CAMPAIGNS.append(new_campaign)
    return new_campaign

@router.get("/campaigns", response_model=List[Campaign])
async def get_campaigns():
    """Get all campaigns"""
    return MOCK_CAMPAIGNS

@router.get("/campaigns/{campaign_id}", response_model=Campaign)
async def get_campaign(campaign_id: str):
    """Get a specific campaign"""
    campaign = next((c for c in MOCK_CAMPAIGNS if c.id == campaign_id), None)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.post("/campaigns/{campaign_id}/send")
async def send_campaign(campaign_id: str):
    """Send a campaign to all customers in the segment"""
    campaign = next((c for c in MOCK_CAMPAIGNS if c.id == campaign_id), None)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    # Simulate sending
    campaign.status = "sending"
    campaign.sent_count = 1000  # Mock count

    return {
        "status": "success",
        "campaign_id": campaign_id,
        "estimated_recipients": 1000
    }

@router.get("/automations/cart-recovery")
async def get_cart_recovery_stats():
    """Get cart recovery automation statistics"""
    return {
        "total_abandoned_carts": 8941,
        "recovery_messages_sent": 5684,
        "recovered_carts": 1247,
        "recovery_rate": 21.9,
        "average_cart_value": 339.06,
        "revenue_recovered": 422845.82,
        "cost_per_recovery": 0.45,
        "roi": 8.2
    }