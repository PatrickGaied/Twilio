from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/api/templates", tags=["templates"])

class TemplateBlock(BaseModel):
    id: str
    type: str  # 'header', 'text', 'image', 'button', 'spacer', 'product'
    content: Dict[str, Any]
    styles: Optional[Dict[str, Any]] = None

class EmailTemplate(BaseModel):
    id: str
    name: str
    type: str  # 'promotional', 'welcome', 'cart_abandonment', 'loyalty'
    preview: str
    blocks: List[TemplateBlock]
    thumbnail: str

@router.get("/")
def get_templates():
    """Returns list of available email templates"""
    return [
        {
            "id": "template_001",
            "name": "Product Spotlight",
            "type": "promotional",
            "preview": "Perfect for highlighting specific products to targeted segments",
            "thumbnail": "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Product+Spotlight",
            "blocks": [
                {
                    "id": "header_1",
                    "type": "header",
                    "content": {
                        "title": "Exclusive for Our Valued Customers",
                        "subtitle": "Amazing Product - Limited Time Offer",
                        "backgroundColor": "#8B5CF6",
                        "textColor": "#FFFFFF"
                    }
                },
                {
                    "id": "image_1",
                    "type": "image",
                    "content": {
                        "src": "https://via.placeholder.com/600x300/3B82F6/FFFFFF?text=Product+Image",
                        "alt": "Product Image",
                        "link": "#shop-now"
                    }
                },
                {
                    "id": "text_1",
                    "type": "text",
                    "content": {
                        "html": "<h2>🎯 Hand-picked just for you!</h2><p>Based on your preferences as a <strong>valued customer</strong>, we think you'll love this exclusive offer on our premium product.</p>"
                    }
                },
                {
                    "id": "button_1",
                    "type": "button",
                    "content": {
                        "text": "Shop Now - 25% OFF",
                        "link": "#shop-now",
                        "backgroundColor": "#EF4444",
                        "textColor": "#FFFFFF"
                    }
                }
            ]
        },
        {
            "id": "template_002",
            "name": "Welcome Series",
            "type": "welcome",
            "preview": "Perfect for onboarding new customers",
            "thumbnail": "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Welcome+Series",
            "blocks": [
                {
                    "id": "header_2",
                    "type": "header",
                    "content": {
                        "title": "Welcome to Segmind!",
                        "subtitle": "We're excited to have you join our community",
                        "backgroundColor": "#10B981",
                        "textColor": "#FFFFFF"
                    }
                },
                {
                    "id": "text_2",
                    "type": "text",
                    "content": {
                        "html": "<h2>🎉 Your journey starts here</h2><p>Get ready to discover personalized recommendations, exclusive deals, and premium products tailored just for you.</p>"
                    }
                },
                {
                    "id": "product_1",
                    "type": "product",
                    "content": {
                        "title": "Trending Now",
                        "products": [
                            {"name": "iPhone 15 Pro", "price": "$1199", "image": "https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=iPhone"},
                            {"name": "MacBook Air", "price": "$1299", "image": "https://via.placeholder.com/150x150/8B5CF6/FFFFFF?text=MacBook"},
                            {"name": "AirPods Pro", "price": "$249", "image": "https://via.placeholder.com/150x150/EF4444/FFFFFF?text=AirPods"}
                        ]
                    }
                }
            ]
        },
        {
            "id": "template_003",
            "name": "Cart Recovery",
            "type": "cart_abandonment",
            "preview": "Win back customers who left items in their cart",
            "thumbnail": "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Cart+Recovery",
            "blocks": [
                {
                    "id": "header_3",
                    "type": "header",
                    "content": {
                        "title": "Don't forget your items!",
                        "subtitle": "Your cart is waiting for you",
                        "backgroundColor": "#F59E0B",
                        "textColor": "#FFFFFF"
                    }
                },
                {
                    "id": "text_3",
                    "type": "text",
                    "content": {
                        "html": "<h2>🛒 Still thinking about it?</h2><p>We saved your items! Complete your purchase now and get <strong>free shipping</strong> + an exclusive 10% discount.</p>"
                    }
                },
                {
                    "id": "spacer_1",
                    "type": "spacer",
                    "content": {"height": 20}
                },
                {
                    "id": "button_2",
                    "type": "button",
                    "content": {
                        "text": "Complete Purchase",
                        "link": "#checkout",
                        "backgroundColor": "#10B981",
                        "textColor": "#FFFFFF"
                    }
                }
            ]
        }
    ]

@router.get("/{template_id}")
def get_template(template_id: str):
    """Returns a specific template by ID"""
    # Mock data - in real implementation, query database
    return {
        "id": template_id,
        "name": "Product Spotlight",
        "type": "promotional",
        "preview": "Perfect for highlighting specific products to targeted segments",
        "thumbnail": "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Product+Spotlight",
        "blocks": [
            {
                "id": "header_1",
                "type": "header",
                "content": {
                    "title": "Exclusive for Our Valued Customers",
                    "subtitle": "Amazing Product - Limited Time Offer",
                    "backgroundColor": "#8B5CF6",
                    "textColor": "#FFFFFF"
                }
            }
        ]
    }

@router.post("/{template_id}/customize")
def customize_template(template_id: str, segment: Optional[str] = None, product: Optional[str] = None):
    """Customizes a template with segment and product data"""
    # In real implementation, this would personalize the template
    return {
        "template_id": template_id,
        "customized_for": {
            "segment": segment,
            "product": product
        },
        "message": "Template customized successfully",
        "customized_at": "2025-10-25T12:00:00Z"
    }

@router.get("/categories/{category}")
def get_templates_by_category(category: str):
    """Returns templates filtered by category"""
    # Mock filtered results
    return {
        "category": category,
        "templates": [
            {
                "id": "template_001",
                "name": "Product Spotlight",
                "type": "promotional"
            }
        ]
    }