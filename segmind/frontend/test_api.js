// Simple test script to verify the optimized Python API works
const testData = {
  product: {
    name: "iPhone 15 Pro",
    category: "Smartphones",
    price: 1199
  },
  strategy: {
    product: "iPhone 15 Pro",
    primaryAudience: "Window Shoppers",
    strategy: "Generate targeted email campaigns with studio lighting visuals",
    emailType: "informative",
    customPrompt: "Use studio lighting for better conversion rates"
  },
  weeklySchedule: [
    {
      day: "Monday",
      time: "10:00 AM",
      type: "Primary Campaign",
      audience: "Window Shoppers",
      emailTheme: "Discovery & Exploration"
    },
    {
      day: "Wednesday",
      time: "2:00 PM",
      type: "Follow-up",
      audience: "Cart Abandoners",
      emailTheme: "Urgency & Completion"
    }
  ]
}

async function testAPI() {
  try {
    console.log('🚀 Testing optimized Python API...')

    const response = await fetch('http://localhost:8000/api/campaign-generator/generate-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', response.status, errorText)
      return
    }

    const result = await response.json()
    console.log('✅ API Success:', result)
    console.log(`Generated ${result.total_cards} campaign cards`)

    if (result.cards && result.cards.length > 0) {
      console.log('📧 Sample campaign:', result.cards[0])
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testAPI()