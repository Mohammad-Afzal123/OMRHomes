import os
import google.generativeai as genai
from PIL import Image
import requests
from io import BytesIO
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Get API key
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    logging.error("API key not found in environment variables!")
    exit(1)

# Configure Gemini AI
genai.configure(api_key=API_KEY)

# Define the model for image generation
MODEL_NAME = "imagen-3.0-generate-002"  # Ensure this is correct, check Google's latest API

# Function to generate an image
def generate_image(prompt):
    try:
        logging.info(f"Generating image for: '{prompt}' using {MODEL_NAME}...")
        
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        
        # Extract image URL
        if response and hasattr(response, "candidates") and response.candidates:
            image_url = response.candidates[0].content.parts[0].image_url
            logging.info(f"Image URL: {image_url}")

            # Download and display the image
            img_response = requests.get(image_url)
            img = Image.open(BytesIO(img_response.content))
            img.show()
        else:
            logging.error("Failed to generate image. No response received.")

    except Exception as e:
        logging.error(f"Error generating image: {e}")

# Get user input
prompt = input("Enter a text prompt for the image you want to generate: ")
generate_image(prompt)
