#!/bin/bash

# Test script to verify the campaign card processing endpoint

echo "Testing Python Campaign Generator API..."

# Test data matching the frontend structure
curl -X POST "http://localhost:8000/api/campaign-generator/process-cards" \
  -H "Content-Type: application/json" \
  -d '{
    "cards": [
      {
        "id": "card_1729909876_0",
        "day": "Monday",
        "time": "10:00 AM",
        "type": "Primary Campaign",
        "audience": "Window Shoppers",
        "theme": "Modern & Clean",
        "subject": "",
        "preview": "",
        "prompt": "",
        "emailContent": "",
        "imagePrompt": "",
        "status": "pending"
      },
      {
        "id": "card_1729909876_1",
        "day": "Wednesday",
        "time": "2:00 PM",
        "type": "Follow-up",
        "audience": "Cart Abandoners",
        "theme": "Urgent & Direct",
        "subject": "",
        "preview": "",
        "prompt": "",
        "emailContent": "",
        "imagePrompt": "",
        "status": "pending"
      }
    ],
    "product": {
      "name": "iPhone 15 Pro",
      "category": "Smartphones",
      "price": 1199
    },
    "strategy": {
      "product": "iPhone 15 Pro",
      "primaryAudience": "Window Shoppers",
      "strategy": "Generate targeted informative email campaigns",
      "emailType": "informative",
      "customPrompt": ""
    }
  }' | python3 -m json.tool

echo "Test completed!"