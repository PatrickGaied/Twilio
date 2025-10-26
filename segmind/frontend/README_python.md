# Email Campaign Card Generator - Python Version

This Python implementation replicates the email campaign card generation functionality from the Next.js web application.

## Files

- **`generate_campaign_cards.py`** - Main generator class with OpenAI integration and template fallbacks
- **`example_usage.py`** - Comprehensive examples showing different use cases
- **`requirements.txt`** - Python dependencies
- **`README_python.md`** - This documentation

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Basic Usage (Template Mode - No API Key Required)
```bash
python3 generate_campaign_cards.py
```

### 3. With OpenAI Integration
```bash
export OPENAI_API_KEY="your-api-key-here"
python3 generate_campaign_cards.py
```

### 4. Run Examples
```bash
python3 example_usage.py
```

## Usage Examples

### Basic Campaign Generation
```python
from generate_campaign_cards import CampaignCardGenerator

# Initialize generator
generator = CampaignCardGenerator()

# Define product
product = {
    'name': 'iPhone 15 Pro',
    'category': 'Phones',
    'price': 999
}

# Define strategy
strategy = {
    'primaryAudience': 'Window Shoppers',
    'strategy': 'Generate targeted email campaigns with compelling hero images'
}

# Define schedule
schedule = [
    {
        'day': 'Monday',
        'time': '10:00 AM',
        'type': 'Primary Campaign',
        'audience': 'Window Shoppers',
        'emailTheme': 'Discovery'
    }
]

# Generate cards
cards = generator.generate_campaign_cards(product, strategy, schedule)
```

### Campaign Types Supported

- **Primary Campaign** - Introduction and feature showcase
- **Follow-up** - Cart abandonment and re-engagement
- **Premium Drop** - Exclusive offers for high-value customers
- **Weekly Recap** - Summary and newsletter content
- **Sale Campaign** - Promotional and discount campaigns
- **Educational Recap** - Learning and tutorial content

### Output Format

Each campaign card includes:
```json
{
  "id": "unique_id",
  "day": "Monday",
  "time": "10:00 AM",
  "type": "Primary Campaign",
  "audience": "Window Shoppers",
  "theme": "Modern & Clean",
  "subject": "Discover the iPhone 15 Pro!",
  "preview": "Email preview text",
  "prompt": "Generation prompt for AI",
  "emailContent": "Full email HTML/text content",
  "imagePrompt": "Image generation prompt",
  "status": "pending"
}
```

## Features

### ✅ OpenAI Integration
- Uses GPT-4 for intelligent campaign generation
- Same prompts as the web application
- Automatic fallback to templates if API fails

### ✅ Template System
- Complete fallback templates for all campaign types
- Works without any API keys
- Randomized subject lines and content

### ✅ Flexible Configuration
- Support for any product type
- Customizable audiences and strategies
- Configurable weekly schedules

### ✅ Multiple Output Formats
- JSON files for integration
- Console output for debugging
- Batch processing for multiple products

## Advanced Usage

### Custom Strategies
```python
strategy = {
    'primaryAudience': 'Creative Professionals',
    'strategy': 'Focus on productivity and creative workflow improvements',
    'emailType': 'educational',
    'customPrompt': 'Emphasize the creative potential and professional tools'
}
```

### Batch Processing
```python
products = [
    {'name': 'MacBook Pro', 'category': 'Laptops'},
    {'name': 'iPad Air', 'category': 'Tablets'},
    {'name': 'AirPods Pro', 'category': 'Audio'}
]

for product in products:
    cards = generator.generate_campaign_cards(product, strategy, schedule)
    # Save or process cards
```

### Error Handling
The generator includes comprehensive error handling:
- Network timeouts for OpenAI API
- JSON parsing errors
- Missing configuration values
- Automatic fallback to templates

## Configuration

### Environment Variables
- `OPENAI_API_KEY` - Your OpenAI API key (optional)

### OpenAI Settings
- Model: GPT-4
- Temperature: 0.7
- Max Tokens: 2000
- Timeout: 30 seconds

## Integration

### With Marketing Automation
```python
# Generate campaigns
cards = generator.generate_campaign_cards(product, strategy, schedule)

# Send to email platform
for card in cards:
    schedule_email(
        subject=card['subject'],
        content=card['emailContent'],
        audience=card['audience'],
        send_time=f"{card['day']} {card['time']}"
    )
```

### With CRM Systems
```python
# Export to CRM format
crm_data = []
for card in cards:
    crm_data.append({
        'campaign_id': card['id'],
        'campaign_name': card['subject'],
        'target_segment': card['audience'],
        'schedule': f"{card['day']} {card['time']}",
        'content': card['emailContent']
    })
```

## Troubleshooting

### OpenAI API Issues
- Check your API key is valid
- Verify you have sufficient credits
- Check network connectivity
- Review rate limits

### Template Generation
- Templates work without internet connection
- Fully deterministic output (except randomized subjects)
- Can be customized in the generator class

### File Permissions
Make sure the script can write to the output directory:
```bash
chmod +w .
```

## Support

For questions or issues:
1. Check the example files for usage patterns
2. Review the error messages for specific guidance
3. Test with template mode first (no API key)
4. Verify your product and strategy data format

Happy campaign generating! 🚀