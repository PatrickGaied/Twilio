// Debug test for the Python API
const testData = {
  product: {
    name: "iPhone 15 Pro",
    category: "Smartphones",
    price: 1199
  },
  strategy: {
    product: "iPhone 15 Pro",
    primaryAudience: "Window Shoppers",
    strategy: "Generate smart campaign prompt for iPhone 15 Pro targeting Window Shoppers",
    emailType: "prompt-generation",
    customPrompt: "Create a strategic campaign prompt for iPhone 15 Pro considering target audience, product details, visual guidance, and performance warnings."
  },
  weeklySchedule: [{
    day: "Today",
    time: "10:30:45 AM",
    type: "Prompt Generation",
    audience: "Window Shoppers",
    emailTheme: "Strategic Campaign Planning"
  }]
}

async function testAPI() {
  try {
    console.log('🧪 Testing Python API with debug data...')
    console.log('📦 Request payload:', JSON.stringify(testData, null, 2))

    const response = await fetch('http://localhost:8000/api/campaign-generator/generate-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    console.log('📡 Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', response.status, errorText)
      return
    }

    const result = await response.json()
    console.log('✅ API Success:', result)

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testAPI()