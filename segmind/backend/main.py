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

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "segmind-backend"}

@app.get("/")
def root():
    """Root endpoint"""
    return {"message": "Segmind MVP Backend", "docs": "/docs"}