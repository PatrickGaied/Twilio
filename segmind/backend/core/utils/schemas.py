from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class SegmentType(str, Enum):
    HIGH_CONVERTERS = "high_converters"
    WINDOW_SHOPPERS = "window_shoppers"
    CART_ABANDONERS = "cart_abandoners"
    LOYAL_CUSTOMERS = "loyal_customers"
    AT_RISK = "at_risk"

class MessageChannel(str, Enum):
    SMS = "sms"
    EMAIL = "email"
    PUSH = "push"
    WHATSAPP = "whatsapp"

class CustomerSegment(BaseModel):
    id: str
    name: str
    type: SegmentType
    description: str
    customer_count: int
    criteria: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class Customer(BaseModel):
    id: str
    email: Optional[str] = None
    phone: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    segment_ids: List[str] = []
    total_orders: int = 0
    total_spent: float = 0.0
    last_activity: Optional[datetime] = None
    conversion_rate: float = 0.0
    lifetime_value: float = 0.0

class Message(BaseModel):
    id: str
    customer_id: str
    channel: MessageChannel
    content: str
    subject: Optional[str] = None
    status: str
    sent_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    opened_at: Optional[datetime] = None
    clicked_at: Optional[datetime] = None

class Campaign(BaseModel):
    id: str
    name: str
    segment_id: str
    channel: MessageChannel
    content: str
    subject: Optional[str] = None
    status: str
    sent_count: int = 0
    delivered_count: int = 0
    opened_count: int = 0
    clicked_count: int = 0
    created_at: datetime
    scheduled_at: Optional[datetime] = None

class AnalyticsMetrics(BaseModel):
    total_messages: int
    delivery_rate: float
    open_rate: float
    click_rate: float
    conversion_rate: float
    revenue_attributed: float
    cost_per_message: float
    roi: float

class SendMessageRequest(BaseModel):
    customer_id: str
    channel: MessageChannel
    content: str
    subject: Optional[str] = None

class CreateCampaignRequest(BaseModel):
    name: str
    segment_id: str
    channel: MessageChannel
    content: str
    subject: Optional[str] = None
    scheduled_at: Optional[datetime] = None

class CreateSegmentRequest(BaseModel):
    name: str
    type: SegmentType
    description: str
    criteria: Dict[str, Any]