from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

router = APIRouter(prefix="/api/campaigns", tags=["campaigns"])

class CampaignCreate(BaseModel):
    name: str
    type: str  # 'email', 'sms', 'whatsapp'
    segment_id: str
    product_id: Optional[str] = None
    content: str
    subject: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    template_id: Optional[str] = None

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    content: Optional[str] = None
    subject: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    status: Optional[str] = None

@router.get("/")
def get_campaigns():
    """Returns list of all campaigns"""
    return [
        {
            "id": "camp_001",
            "name": "High Converters Email Blast",
            "type": "email",
            "segment": "High Converters",
            "product": "iPhone 15 Pro",
            "status": "scheduled",
            "scheduled_at": "2025-10-26T10:00:00Z",
            "created_at": "2025-10-25T14:30:00Z",
            "metrics": {
                "sent": 0,
                "delivered": 0,
                "opened": 0,
                "clicked": 0
            }
        },
        {
            "id": "camp_002",
            "name": "Window Shoppers SMS",
            "type": "sms",
            "segment": "Window Shoppers",
            "product": "AirPods Pro",
            "status": "scheduled",
            "scheduled_at": "2025-10-27T14:30:00Z",
            "created_at": "2025-10-25T15:15:00Z",
            "metrics": {
                "sent": 0,
                "delivered": 0,
                "opened": 0,
                "clicked": 0
            }
        },
        {
            "id": "camp_003",
            "name": "Loyal Customers WhatsApp",
            "type": "whatsapp",
            "segment": "Loyal Customers",
            "product": "Samsung Galaxy S24",
            "status": "scheduled",
            "scheduled_at": "2025-10-28T09:00:00Z",
            "created_at": "2025-10-25T16:45:00Z",
            "metrics": {
                "sent": 0,
                "delivered": 0,
                "opened": 0,
                "clicked": 0
            }
        }
    ]

@router.post("/")
def create_campaign(campaign: CampaignCreate):
    """Creates a new campaign"""
    # In real implementation, this would save to database
    campaign_id = f"camp_{len(str(datetime.now().timestamp()).replace('.', ''))}"

    return {
        "id": campaign_id,
        "message": "Campaign created successfully",
        "campaign": {
            "id": campaign_id,
            "name": campaign.name,
            "type": campaign.type,
            "segment_id": campaign.segment_id,
            "product_id": campaign.product_id,
            "content": campaign.content,
            "subject": campaign.subject,
            "scheduled_at": campaign.scheduled_at,
            "template_id": campaign.template_id,
            "status": "draft",
            "created_at": datetime.now().isoformat()
        }
    }

@router.get("/{campaign_id}")
def get_campaign(campaign_id: str):
    """Returns details of a specific campaign"""
    # Mock data - in real implementation, query database
    return {
        "id": campaign_id,
        "name": "High Converters Email Blast",
        "type": "email",
        "segment": "High Converters",
        "product": "iPhone 15 Pro",
        "content": "🎯 Personalized Campaign for High Converters...",
        "subject": "Exclusive iPhone 15 Pro Offer Just for You!",
        "status": "scheduled",
        "scheduled_at": "2025-10-26T10:00:00Z",
        "created_at": "2025-10-25T14:30:00Z",
        "metrics": {
            "sent": 0,
            "delivered": 0,
            "opened": 0,
            "clicked": 0,
            "conversion_rate": 0.0,
            "revenue": 0.0
        }
    }

@router.put("/{campaign_id}")
def update_campaign(campaign_id: str, campaign_update: CampaignUpdate):
    """Updates a campaign"""
    # In real implementation, this would update the database
    return {
        "id": campaign_id,
        "message": "Campaign updated successfully",
        "updated_fields": campaign_update.dict(exclude_unset=True)
    }

@router.delete("/{campaign_id}")
def delete_campaign(campaign_id: str):
    """Deletes a campaign"""
    # In real implementation, this would delete from database
    return {
        "message": f"Campaign {campaign_id} deleted successfully"
    }

@router.get("/calendar/{year}/{month}")
def get_campaign_calendar(year: int, month: int):
    """Returns campaigns scheduled for a specific month"""
    # Mock data for calendar view
    return {
        "year": year,
        "month": month,
        "campaigns": [
            {
                "id": "camp_001",
                "name": "High Converters Email",
                "type": "email",
                "date": f"{year}-{month:02d}-26",
                "time": "10:00",
                "segment": "High Converters"
            },
            {
                "id": "camp_002",
                "name": "Window Shoppers SMS",
                "type": "sms",
                "date": f"{year}-{month:02d}-27",
                "time": "14:30",
                "segment": "Window Shoppers"
            },
            {
                "id": "camp_003",
                "name": "Loyal Customers WhatsApp",
                "type": "whatsapp",
                "date": f"{year}-{month:02d}-28",
                "time": "09:00",
                "segment": "Loyal Customers"
            }
        ]
    }

@router.post("/{campaign_id}/send")
def send_campaign(campaign_id: str):
    """Sends a campaign immediately"""
    # In real implementation, this would trigger the messaging service
    return {
        "id": campaign_id,
        "message": "Campaign sent successfully",
        "sent_at": datetime.now().isoformat(),
        "status": "sent"
    }

@router.post("/generate")
def generate_campaign_content(segment: str, product: Optional[str] = None, campaign_type: str = "email"):
    """AI-generates campaign content based on segment and product"""
    # Mock AI generation - in real implementation, this would call an AI service
    if product:
        content = f"""🎯 Personalized Campaign for {segment}

Subject: Exclusive {product} Offer Just for You!

Hi [Customer Name],

As one of our valued {segment.lower()}, we've noticed your interest in premium electronics. We have an exclusive offer on the {product} that we think you'll love!

✨ Limited Time: 15% off + Free Express Shipping
📱 {product} - Perfect for your lifestyle
💎 Premium quality you trust

This offer expires in 48 hours. Don't miss out!

[SHOP NOW] [Learn More]

Best regards,
The Segmind Team"""
    else:
        content = f"""🎯 Campaign for {segment}

Subject: We Miss You! Come Back for Exclusive Rewards

Hi [Customer Name],

We've prepared something special for our {segment.lower()}. Based on your previous purchases and browsing behavior, here's a personalized offer:

🎁 25% OFF your next purchase
📦 Free shipping on orders over $50
⭐ Early access to new arrivals

Your rewards are waiting!

[CLAIM OFFER] [Browse Products]

Best,
The Segmind Team"""

    return {
        "generated_content": content,
        "segment": segment,
        "product": product,
        "campaign_type": campaign_type,
        "generated_at": datetime.now().isoformat()
    }