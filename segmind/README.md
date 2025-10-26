# Segmind Project

## Quick Start with Docker

From the project root directory (`/home/alex/code/test/Twilio/segmind/`):

```bash
# Start the development environment
docker compose up

# Start in background
docker compose up -d

# Stop everything
docker compose down

# Rebuild and start (if you change dependencies)
docker compose up --build
```

The frontend will be available at http://localhost:3000

## Development

### Frontend
- Built with Next.js, TypeScript, and Tailwind CSS
- Campaign builder with product selection, calendar, and analytics
- OpenAI integration for automated email generation

### Features
- Product catalog with search
- Strategy-based campaign recommendations
- Interactive calendar with campaign cards
- OCR insights and audience analytics
- Automated email generation workflow

## Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```
OPENAI_API_KEY=your_openai_api_key_here
```