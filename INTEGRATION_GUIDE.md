# ChromaDB and OCR Integration Guide

This guide explains how to integrate ChromaDB vector database and OCR capabilities with the Twilio marketing platform for enhanced product recommendations and campaign analysis.

## Overview

The platform currently uses mock data but is designed to integrate with:
- **ChromaDB**: Vector database for product similarity and recommendations
- **OCR Processing**: Image analysis for campaign content optimization
- **OpenAI**: AI-powered content generation

## ChromaDB Integration

### 1. Setup ChromaDB

```bash
# Install ChromaDB
pip install chromadb

# For persistent storage
pip install chromadb[persistent]
```

### 2. Product Vector Storage

```python
import chromadb
from chromadb.config import Settings

# Initialize ChromaDB client
client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="./chroma_db"
))

# Create collection for products
products_collection = client.create_collection(
    name="products",
    metadata={"description": "Product embeddings for similarity search"}
)

# Example: Add product vectors
product_data = [
    {
        "id": "iphone_15_pro",
        "name": "iPhone 15 Pro",
        "category": "smartphone",
        "price": 999,
        "features": ["A17 Pro chip", "Pro camera system", "Titanium"],
        "description": "Professional smartphone with advanced camera and performance"
    },
    # ... more products
]

# Generate embeddings and add to ChromaDB
for product in product_data:
    # Use OpenAI or other embedding model
    embedding = generate_embedding(product["description"] + " " + " ".join(product["features"]))

    products_collection.add(
        embeddings=[embedding],
        documents=[product["description"]],
        metadatas=[{
            "name": product["name"],
            "category": product["category"],
            "price": product["price"],
            "features": product["features"]
        }],
        ids=[product["id"]]
    )
```

### 3. Integration Points

#### A. QuickInsightAnalysis Component
Replace mock similar products with ChromaDB queries:

```typescript
// In segmind/frontend/components/QuickInsightAnalysis.tsx
const getSimilarProducts = async (targetProduct: string) => {
  try {
    const response = await fetch('/api/chromadb/similar-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: targetProduct, limit: 5 })
    });

    const data = await response.json();
    return data.similarProducts;
  } catch (error) {
    console.error('Error fetching similar products:', error);
    return [];
  }
};
```

#### B. Campaign Generation
Use ChromaDB for product recommendations in campaigns:

```typescript
// In campaign generation logic
const getProductRecommendations = async (customerSegment: string, preferences: string[]) => {
  const response = await fetch('/api/chromadb/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      segment: customerSegment,
      preferences: preferences,
      limit: 10
    })
  });

  return response.json();
};
```

### 4. API Endpoints

Create these API endpoints in `segmind/frontend/pages/api/chromadb/`:

#### `similar-products.ts`
```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import chromadb from '../../../lib/chromadb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { product, limit = 5 } = req.body;

    // Generate embedding for the target product
    const embedding = await generateEmbedding(product);

    // Query ChromaDB for similar products
    const results = await chromadb.query({
      collection_name: "products",
      query_embeddings: [embedding],
      n_results: limit
    });

    res.status(200).json({ similarProducts: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

#### `recommendations.ts`
```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import chromadb from '../../../lib/chromadb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { segment, preferences, limit = 10 } = req.body;

    // Build query based on segment and preferences
    const queryText = `${segment} customer preferences: ${preferences.join(', ')}`;
    const embedding = await generateEmbedding(queryText);

    const results = await chromadb.query({
      collection_name: "products",
      query_embeddings: [embedding],
      n_results: limit,
      where: { "category": { "$in": getRelevantCategories(segment) } }
    });

    res.status(200).json({ recommendations: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## OCR Integration

### 1. Setup OCR Processing

```bash
# Install OCR dependencies
pip install pytesseract pillow opencv-python
pip install easyocr  # Alternative OCR engine

# For cloud OCR
pip install google-cloud-vision  # Google Vision API
pip install azure-cognitiveservices-vision-computervision  # Azure Computer Vision
```

### 2. OCR Processing Pipeline

```python
import pytesseract
from PIL import Image
import cv2
import numpy as np

class OCRProcessor:
    def __init__(self):
        # Configure tesseract path if needed
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        pass

    def extract_text_from_image(self, image_path: str) -> dict:
        """Extract text and metadata from campaign images"""
        try:
            # Load and preprocess image
            image = cv2.imread(image_path)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            # Extract text
            text = pytesseract.image_to_string(gray)

            # Extract detailed data with bounding boxes
            data = pytesseract.image_to_data(gray, output_type=pytesseract.Output.DICT)

            # Analyze text layout and structure
            analysis = self.analyze_text_structure(data)

            return {
                "extracted_text": text.strip(),
                "word_count": len(text.split()),
                "layout_analysis": analysis,
                "confidence_scores": data['conf'],
                "image_dimensions": image.shape[:2]
            }

        except Exception as e:
            return {"error": str(e)}

    def analyze_text_structure(self, ocr_data: dict) -> dict:
        """Analyze the structure and layout of extracted text"""
        headings = []
        body_text = []
        cta_text = []

        for i, text in enumerate(ocr_data['text']):
            if text.strip():
                confidence = ocr_data['conf'][i]
                height = ocr_data['height'][i]

                # Classify text based on position and size
                if height > 30:  # Likely heading
                    headings.append(text)
                elif any(keyword in text.lower() for keyword in ['buy', 'shop', 'click', 'learn more']):
                    cta_text.append(text)
                else:
                    body_text.append(text)

        return {
            "headings": headings,
            "body_text": body_text,
            "cta_elements": cta_text,
            "text_density": len([t for t in ocr_data['text'] if t.strip()])
        }
```

### 3. Integration with Campaign Analysis

#### A. Past Trends Tab
Update the past trends analysis to use real OCR data:

```typescript
// In segmind/frontend/pages/index.tsx - Past Trends section
const analyzeCampaignImages = async (campaignId: string) => {
  try {
    const response = await fetch('/api/ocr/analyze-campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId })
    });

    const analysis = await response.json();
    return analysis;
  } catch (error) {
    console.error('OCR analysis failed:', error);
    return null;
  }
};
```

#### B. API Endpoint for OCR Analysis

Create `segmind/frontend/pages/api/ocr/analyze-campaign.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import { OCRProcessor } from '../../../lib/ocr'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { campaignId, imageUrl } = req.body;

    const ocrProcessor = new OCRProcessor();
    const analysis = await ocrProcessor.extract_text_from_image(imageUrl);

    // Enhance analysis with AI insights
    const aiInsights = await generateCampaignInsights(analysis);

    res.status(200).json({
      campaignId,
      ocr_analysis: analysis,
      ai_insights: aiInsights,
      recommendations: generateRecommendations(analysis)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function generateCampaignInsights(ocrData: any) {
  // Use OpenAI to analyze OCR results
  const prompt = `Analyze this campaign content:
  Text: ${ocrData.extracted_text}
  Layout: ${JSON.stringify(ocrData.layout_analysis)}

  Provide insights on:
  1. Message clarity and effectiveness
  2. Visual hierarchy and readability
  3. Call-to-action optimization
  4. Target audience alignment`;

  // Call OpenAI API with the prompt
  // Return structured insights
}
```

### 4. Data Flow Integration

#### A. Campaign Performance Tracking
```typescript
// Track campaign performance with OCR insights
interface CampaignWithOCR {
  id: string;
  name: string;
  type: 'email' | 'popup' | 'social';
  performance_metrics: {
    conversion_rate: number;
    click_rate: number;
    engagement_rate: number;
  };
  ocr_analysis: {
    text_clarity_score: number;
    cta_effectiveness: number;
    visual_hierarchy_score: number;
    readability_score: number;
  };
  chromadb_recommendations: {
    similar_campaigns: Array<{id: string, similarity: number}>;
    product_matches: Array<{product: string, relevance: number}>;
  };
}
```

#### B. Real-time Analysis Pipeline
```typescript
// Implement real-time analysis when campaigns are created
const processCampaignContent = async (campaignData: any) => {
  // 1. Extract text from images using OCR
  const ocrResults = await processWithOCR(campaignData.images);

  // 2. Generate embeddings for ChromaDB storage
  const embeddings = await generateEmbeddings(ocrResults.text_content);

  // 3. Store in ChromaDB for future similarity searches
  await chromadb.add({
    collection_name: "campaigns",
    embeddings: [embeddings],
    documents: [ocrResults.text_content],
    metadatas: [campaignData.metadata],
    ids: [campaignData.id]
  });

  // 4. Get recommendations based on similar campaigns
  const recommendations = await chromadb.query({
    collection_name: "campaigns",
    query_embeddings: [embeddings],
    n_results: 5
  });

  return {
    ocr_analysis: ocrResults,
    recommendations: recommendations
  };
};
```

## Environment Configuration

Add these environment variables to your `.env` file:

```bash
# ChromaDB Configuration
CHROMADB_HOST=localhost
CHROMADB_PORT=8000
CHROMADB_PERSIST_DIRECTORY=./chroma_db

# OCR Configuration
TESSERACT_PATH=/usr/bin/tesseract
OCR_CONFIDENCE_THRESHOLD=60

# Cloud OCR (optional)
GOOGLE_VISION_API_KEY=your_google_vision_key
AZURE_COMPUTER_VISION_KEY=your_azure_cv_key
AZURE_COMPUTER_VISION_ENDPOINT=your_azure_endpoint

# OpenAI (already configured)
OPENAI_API_KEY=your_openai_key
```

## Testing the Integration

### 1. Test ChromaDB Connection
```bash
# Run this test to verify ChromaDB is working
curl -X POST http://localhost:3000/api/chromadb/test \
  -H "Content-Type: application/json" \
  -d '{"test": "connection"}'
```

### 2. Test OCR Processing
```bash
# Test OCR with a sample image
curl -X POST http://localhost:3000/api/ocr/test \
  -H "Content-Type: application/json" \
  -d '{"image_url": "path/to/test/image.jpg"}'
```

### 3. Integration Test
```bash
# Test the full pipeline
curl -X POST http://localhost:3000/api/test-integration \
  -H "Content-Type: application/json" \
  -d '{"campaign_id": "test_campaign", "image_url": "path/to/image.jpg"}'
```

## Next Steps

1. **Install Dependencies**: Install ChromaDB and OCR libraries
2. **Create Collections**: Set up ChromaDB collections for products and campaigns
3. **API Implementation**: Create the API endpoints described above
4. **Data Migration**: Migrate existing mock data to ChromaDB
5. **OCR Setup**: Configure OCR processing for campaign images
6. **Testing**: Test the integration with real data
7. **Monitoring**: Add logging and monitoring for the new services

## Performance Considerations

- **Embedding Generation**: Cache embeddings to avoid regenerating
- **ChromaDB Indexing**: Use appropriate indexing for large datasets
- **OCR Processing**: Process images asynchronously for better performance
- **API Rate Limits**: Implement rate limiting for OpenAI API calls
- **Caching**: Cache similar product results and OCR analyses

This integration will enable:
- Real product similarity recommendations
- Automated campaign content analysis
- Data-driven campaign optimization
- Enhanced customer targeting based on product affinity