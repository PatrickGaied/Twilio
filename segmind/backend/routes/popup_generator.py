from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import base64
from datetime import datetime
from PIL import Image
from io import BytesIO
import threading
import logging
from pathlib import Path

# Only import if Gemini is available
try:
    from google import genai
    from google.genai import types
    from dotenv import load_dotenv
    load_dotenv()
    GEMINI_AVAILABLE = True
    print("Info: Google Gemini available")
except ImportError:
    GEMINI_AVAILABLE = False
    print("Warning: Google Gemini not installed. Install with: pip install google-genai")

router = APIRouter(prefix="/api/popup-generator", tags=["popup-generator"])
logger = logging.getLogger(__name__)

# Create necessary directories
UPLOAD_DIR = Path("uploaded_products")
EXAMPLE_ADS_DIR = Path("example_ads")
GENERATED_DIR = Path("generated_popups")

for dir_path in [UPLOAD_DIR, EXAMPLE_ADS_DIR, GENERATED_DIR]:
    dir_path.mkdir(exist_ok=True)

class PopupGenerationRequest(BaseModel):
    product_name: str
    campaign_type: str  # "discount", "new_arrival", "feature_highlight", etc.
    prompt_text: str  # The text/offer to show in the popup
    style: str  # "modern", "minimal", "bold", "elegant"
    aspect_ratio: str  # "square", "vertical", "horizontal"
    color_scheme: Optional[str] = "auto"  # "vibrant", "pastel", "monochrome", "auto"

class ReturnThread(threading.Thread):
    """Thread that returns a value from target function"""
    def __init__(self, target, args=()):
        super().__init__(target=target, args=args)
        self._return = None

    def run(self):
        if self._target is not None:
            self._return = self._target(*self._args)

    def join(self):
        super().join()
        return self._return

def crop_to_aspect_ratio(image: Image.Image, aspect_ratio: str) -> Image.Image:
    """Crop image to specified aspect ratio"""
    width, height = image.size

    # Define target aspect ratios
    aspect_ratios = {
        "square": 1.0,      # 1:1
        "vertical": 9/16,   # 9:16 (0.5625)
        "horizontal": 16/9  # 16:9 (1.777...)
    }

    target_ratio = aspect_ratios.get(aspect_ratio, 1.0)
    current_ratio = width / height

    if abs(current_ratio - target_ratio) < 0.01:
        # Already close to target ratio
        return image

    if current_ratio > target_ratio:
        # Image is too wide, crop width
        new_width = int(height * target_ratio)
        left = (width - new_width) // 2
        right = left + new_width
        cropped = image.crop((left, 0, right, height))
    else:
        # Image is too tall, crop height
        new_height = int(width / target_ratio)
        top = (height - new_height) // 2
        bottom = top + new_height
        cropped = image.crop((0, top, width, bottom))

    return cropped

def generate_popup_with_gemini(client, prompt: str, product_image: Image.Image, example_ad: Optional[Image.Image] = None):
    """Generate a popup ad using Gemini API"""
    try:
        contents = [prompt]

        # Add product image
        if product_image:
            contents.append(product_image)

        # Add example ad if provided
        if example_ad:
            contents.append(example_ad)

        response = client.models.generate_content(
            model="gemini-2.5-flash-image",  # Using the image generation model
            contents=contents,
        )
        return response
    except Exception as e:
        logger.error(f"Gemini generation error: {e}")
        raise

def create_intelligent_prompt(request: PopupGenerationRequest) -> str:
    """Create a proven prompt that generates high-quality ads"""

    prompt = (
        "A photorealistic picture of my device set in "
        "a snowy mountain environment. The scene is illuminated by sunlight, creating "
        "a bright atmosphere. Captured with a dslr camera, emphasizing "
        "the exact same text as seen on the content image."
    )

    return prompt

@router.post("/generate")
async def generate_popup_ad(request: PopupGenerationRequest):
    """Generate a popup ad based on campaign requirements"""

    if not GEMINI_AVAILABLE:
        # Fallback response when Gemini is not available
        return {
            "success": False,
            "message": "Gemini API not configured. Please install google-generativeai",
            "fallback": True,
            "generated_prompt": create_intelligent_prompt(request),
            "instructions": "Use this prompt with your preferred image generation service"
        }

    try:
        # Initialize Gemini client
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")

        client = genai.Client(api_key=api_key)

        # Create intelligent prompt
        prompt = create_intelligent_prompt(request)

        # Try to load product image if it exists
        product_image = None
        product_name_clean = request.product_name.replace(' ', '_').lower()

        # Check multiple locations and file extensions
        search_paths = [
            UPLOAD_DIR,
            Path("../../Images"),  # Check Images directory (correct relative path)
            Path("../Images"),     # Alternative path
            Path("Images"),        # Direct path
        ]

        extensions = ['.png', '.jpg', '.jpeg', '.webp']

        for search_dir in search_paths:
            for ext in extensions:
                product_image_path = search_dir / f"{product_name_clean}{ext}"
                logger.info(f"Checking for product image: {product_image_path}")
                if product_image_path.exists():
                    logger.info(f"Found product image: {product_image_path}")
                    product_image = Image.open(product_image_path)
                    break
            if product_image:
                break

        if not product_image:
            logger.warning(f"No product image found for: {product_name_clean}")
        else:
            logger.info(f"Successfully loaded product image for: {product_name_clean}")

        # Try to load example ad - check both product-specific and campaign-type examples
        example_ad = None

        # First try product-specific examples (e.g., "iPhone_15_Pro_ad_example.jpeg")
        example_patterns = [
            f"{product_name_clean}_ad_example",  # iPhone_15_Pro_ad_example
            f"{product_name_clean.replace('_', '-')}_Ad_example",  # iPhone-15-Pro-Ad_example
            f"{request.campaign_type}_example",  # discount_example
        ]

        for search_dir in search_paths:
            if example_ad:
                break
            for pattern in example_patterns:
                if example_ad:
                    break
                for ext in extensions:
                    example_ad_path = search_dir / f"{pattern}{ext}"
                    logger.info(f"Checking for example ad: {example_ad_path}")
                    if example_ad_path.exists():
                        logger.info(f"Found example ad: {example_ad_path}")
                        example_ad = Image.open(example_ad_path)
                        break

        if not example_ad:
            logger.warning(f"No example ad found for product: {product_name_clean} or campaign type: {request.campaign_type}")
        else:
            logger.info(f"Successfully loaded example ad")

        # Generate the popup ad
        response = generate_popup_with_gemini(client, prompt, product_image, example_ad)

        # Process the response
        generated_images = []
        for i, part in enumerate(response.candidates[0].content.parts):
            if part.inline_data is not None:
                # Save the generated image
                image = Image.open(BytesIO(part.inline_data.data))

                # Crop image based on aspect ratio
                image = crop_to_aspect_ratio(image, request.aspect_ratio)

                # Create filename with timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{request.product_name.replace(' ', '_')}_{request.campaign_type}_{timestamp}_{i}.png"
                save_path = GENERATED_DIR / filename

                image.save(save_path)

                # Convert to base64 for frontend
                buffered = BytesIO()
                image.save(buffered, format="PNG")
                img_base64 = base64.b64encode(buffered.getvalue()).decode()

                generated_images.append({
                    "filename": filename,
                    "base64": f"data:image/png;base64,{img_base64}",
                    "path": str(save_path)
                })

        return {
            "success": True,
            "generated_images": generated_images,
            "prompt_used": prompt,
            "campaign_type": request.campaign_type,
            "product": request.product_name
        }

    except Exception as e:
        logger.error(f"Error generating popup: {e}")
        return {
            "success": False,
            "error": str(e),
            "generated_prompt": create_intelligent_prompt(request),
            "message": "Failed to generate image, but here's the prompt you can use"
        }

@router.post("/generate-batch")
async def generate_popup_batch(
    product_name: str = Form(...),
    campaign_types: str = Form(...),  # Comma-separated list
    prompt_text: str = Form(...),
    style: str = Form("modern"),
    aspect_ratio: str = Form("square"),
    product_images: List[UploadFile] = File(None)
):
    """Generate multiple popup variations in batch"""

    results = []
    campaign_list = campaign_types.split(",")

    # Save uploaded product images
    saved_images = []
    if product_images:
        for upload_file in product_images:
            if upload_file.filename:
                file_path = UPLOAD_DIR / upload_file.filename
                with open(file_path, "wb") as f:
                    f.write(await upload_file.read())
                saved_images.append(file_path)

    # Generate popup for each campaign type
    for campaign_type in campaign_list:
        request = PopupGenerationRequest(
            product_name=product_name,
            campaign_type=campaign_type.strip(),
            prompt_text=prompt_text,
            style=style,
            aspect_ratio=aspect_ratio
        )

        result = await generate_popup_ad(request)
        results.append(result)

    return {
        "success": True,
        "results": results,
        "total_generated": len(results)
    }

@router.get("/templates")
async def get_popup_templates():
    """Get available popup templates and styles"""
    return {
        "campaign_types": [
            {"id": "discount", "name": "Discount/Sale", "description": "Highlight special offers and discounts"},
            {"id": "new_arrival", "name": "New Arrival", "description": "Showcase new products"},
            {"id": "feature_highlight", "name": "Feature Focus", "description": "Highlight product features"},
            {"id": "seasonal", "name": "Seasonal", "description": "Season-specific campaigns"},
            {"id": "flash_sale", "name": "Flash Sale", "description": "Urgent, time-limited offers"}
        ],
        "styles": [
            {"id": "modern", "name": "Modern", "description": "Clean, contemporary design"},
            {"id": "bold", "name": "Bold", "description": "High-impact, attention-grabbing"},
            {"id": "elegant", "name": "Elegant", "description": "Sophisticated, premium feel"},
            {"id": "minimal", "name": "Minimal", "description": "Simple, focused design"},
            {"id": "playful", "name": "Playful", "description": "Fun, energetic style"}
        ],
        "aspect_ratios": [
            {"id": "square", "name": "Square (1:1)", "description": "Instagram, social media"},
            {"id": "vertical", "name": "Vertical (9:16)", "description": "Stories, mobile"},
            {"id": "horizontal", "name": "Horizontal (16:9)", "description": "Website banners"}
        ]
    }

@router.get("/examples/{campaign_type}")
async def get_example_ads(campaign_type: str):
    """Get example ads for a specific campaign type"""
    example_path = EXAMPLE_ADS_DIR / f"{campaign_type}_example.png"
    if example_path.exists():
        return FileResponse(example_path)
    else:
        raise HTTPException(status_code=404, detail="Example not found")

@router.get("/generated/{filename}")
async def get_generated_image(filename: str):
    """Retrieve a generated popup image"""
    file_path = GENERATED_DIR / filename
    if file_path.exists():
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="Image not found")