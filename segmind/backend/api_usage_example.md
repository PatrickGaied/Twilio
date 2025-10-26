# Campaign Cards API Usage

## Endpoint: `/api/campaigns/generate-cards`

### Method: POST

### Request Format:

```json
{
  "product": {
    "name": "iPhone 15 Pro",
    "category": "Phones",
    "price": 999
  },
  "strategy": {
    "product": "iPhone 15 Pro",
    "primaryAudience": "Window Shoppers",
    "strategy": "Generate targeted informative email campaigns for window shoppers with compelling hero images and personalized content.",
    "emailType": "informative",
    "customPrompt": ""
  },
  "weeklySchedule": [
    {
      "day": "Monday",
      "time": "10:00 AM",
      "type": "Primary Campaign",
      "audience": "Window Shoppers",
      "emailTheme": "Discovery & Exploration"
    },
    {
      "day": "Wednesday",
      "time": "2:00 PM",
      "type": "Primary Campaign",
      "audience": "Window Shoppers",
      "emailTheme": "Feature Showcase"
    },
    {
      "day": "Thursday",
      "time": "11:00 AM",
      "type": "Follow-up",
      "audience": "Cart Abandoners",
      "emailTheme": "Urgency & Completion"
    },
    {
      "day": "Friday",
      "time": "9:00 AM",
      "type": "Premium Drop",
      "audience": "High Converters",
      "emailTheme": "Exclusive Access"
    },
    {
      "day": "Sunday",
      "time": "6:00 PM",
      "type": "Weekly Recap",
      "audience": "All Segments",
      "emailTheme": "Weekly Highlights"
    }
  ]
}
```

### Response Format:

```json
{
  "success": true,
  "cards": [
    {
      "id": "card_1729909876_0",
      "day": "Monday",
      "time": "10:00 AM",
      "type": "Primary Campaign",
      "audience": "Window Shoppers",
      "theme": "Modern & Clean",
      "subject": "Meet the Future: Introducing iPhone 15 Pro",
      "preview": "Monday 10:00 AM: Primary Campaign",
      "prompt": "Primary Campaign email for Window Shoppers promoting iPhone 15 Pro",
      "emailContent": "Hi {{first_name}},\n\nWe're excited to introduce you to the iPhone 15 Pro!\n\nAs someone who appreciates quality technology, we thought you'd love to know about this latest addition to our collection.\n\n✨ Key Features:\n• Premium design and build quality\n• Latest technology innovations\n• Perfect for your lifestyle\n\nReady to learn more?\n\nBest regards,\nThe Segmind Team",
      "imagePrompt": "Clean, modern product photography of iPhone 15 Pro on a minimal white background with soft studio lighting, professional commercial style",
      "status": "pending"
    }
  ],
  "generated_at": "2025-10-26T04:34:15.123456",
  "total_cards": 5
}
```

## Frontend Integration

### Replace the existing Next.js API call

In your frontend `generateCampaignCards` function, replace:

```javascript
// OLD: Next.js API
const response = await fetch('/api/generate-campaign-cards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product: selectedProductForPromotion,
    strategy: strategy,
    weeklySchedule: strategy.weeklySchedule
  })
})
```

### With the new FastAPI backend call:

```javascript
// NEW: FastAPI backend
const response = await fetch('http://localhost:8000/api/campaigns/generate-cards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product: selectedProductForPromotion,
    strategy: {
      product: selectedProductForPromotion?.name,
      primaryAudience: strategy.primaryAudience,
      strategy: strategy.strategy,
      emailType: selectedEmailType,
      customPrompt: customPrompt
    },
    weeklySchedule: strategy.weeklySchedule
  })
})

if (response.ok) {
  const data = await response.json()
  if (data.success) {
    setGeneratedCampaignCards(data.cards)
    setShowStrategyModal(false)
  }
}
```

## Starting the Backend Server

```bash
# Install dependencies (if not already installed)
cd backend
pip install fastapi uvicorn requests python-dotenv

# Start the server
python3 -m uvicorn main:app --reload --port 8000
```

## Testing

```bash
# Test the generator directly
cd backend
python3 test_endpoint.py

# Test with curl
curl -X POST "http://localhost:8000/api/campaigns/generate-cards" \
  -H "Content-Type: application/json" \
  -d '{
    "product": {"name": "iPhone 15 Pro", "category": "Phones", "price": 999},
    "strategy": {
      "product": "iPhone 15 Pro",
      "primaryAudience": "Window Shoppers",
      "strategy": "Generate targeted email campaigns",
      "emailType": "informative",
      "customPrompt": ""
    },
    "weeklySchedule": [
      {
        "day": "Monday",
        "time": "10:00 AM",
        "type": "Primary Campaign",
        "audience": "Window Shoppers",
        "emailTheme": "Discovery"
      }
    ]
  }'
```

## Error Handling

The endpoint includes comprehensive error handling:

- **500 Import Error**: Campaign generator module not found
- **500 Generation Error**: Failed to generate campaign cards
- **422 Validation Error**: Invalid request format

## Features

✅ **Same Logic**: Uses the exact same Python generator as the standalone script
✅ **OpenAI Integration**: Supports OpenAI API key for enhanced generation
✅ **Template Fallback**: Works without API keys using built-in templates
✅ **FastAPI Validation**: Request/response validation with Pydantic models
✅ **Error Handling**: Comprehensive error responses
✅ **Documentation**: Auto-generated API docs at `/docs`