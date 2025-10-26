from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Import routers
from routes.analytics import router as analytics_router
from routes.segments import router as segments_router
from routes.products import router as products_router, analytics_router as products_analytics_router
from routes.insights import router as insights_router
from routes.campaigns import router as campaigns_router
from routes.templates import router as templates_router
from audience_insights import router as audience_insights_router

app = FastAPI(title="Segmind MVP - Customer Messaging Platform")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analytics_router)
app.include_router(segments_router)
app.include_router(products_router)
app.include_router(products_analytics_router)
app.include_router(insights_router)
app.include_router(campaigns_router)
app.include_router(templates_router)
app.include_router(audience_insights_router, prefix="/api")

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "segmind-backend"}

@app.get("/")
def root():
    """Root endpoint"""
    return {"message": "Segmind MVP Backend", "docs": "/docs"}