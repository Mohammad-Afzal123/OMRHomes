import json
import os
import time
import google.generativeai as genai

YOUR_GEMINI_API_KEY = "AIzaSyD0QWnkS7PiYNGV9aKvdF_1ckzVV56A2z8" 

INPUT_JSON_FILE = "property_descriptions.json"
OUTPUT_JSON_FILE = "tour_guide_descriptions.json"

try:
    genai.configure(api_key=YOUR_GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash') 
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    print("Please ensure you have pasted a valid API key in the script.")
    exit()

PROMPT_TEMPLATE = """
You are an enthusiastic and imaginative virtual tour guide.
Based *only* on the following basic property description, create a vivid and highly detailed paragraph (one single paragraph) describing a virtual walk-through of the property.

**Instructions for the Tour:**
1.  **Entrance:** Imagine stepping through the front door. What's the first impression? Is there a foyer?
2.  **Flow:** Guide the "visitor" through the main living spaces (living room, dining area, kitchen if applicable). Describe the layout and how the rooms connect.
3.  **Bedrooms/Bathrooms:** Briefly touch upon the bedrooms and bathrooms mentioned. Imagine their potential ambiance (e.g., cozy, bright, spacious).
4.  **Lighting:** Describe the lighting – is there abundant natural light from windows? Imagine the type of ambient lighting that might complement the space in the evening.
5.  **Atmosphere & Imagination:** Evoke the feeling or atmosphere of the space (e.g., cozy, modern, airy, tranquil, luxurious). Use your imagination to add plausible details about potential furnishings, decor style hints, or unique features *inspired* by the original description (like coastal vibes, city views, garden access), even if not explicitly stated.
6.  **Tone:** Keep the tone engaging, inviting, and positive. Make the "visitor" feel like they are really there.
7.  **Output:** Provide *only* the single paragraph of the tour guide description as the response. Do not include introductory phrases like "Here is the tour guide paragraph:".

**Original Property Description:**
{description}

**Your Tour Guide Paragraph:**
"""

# --- MAIN SCRIPT ---

def load_json_data(filepath):
    """Loads data from a JSON file."""
    if not os.path.exists(filepath):
        print(f"Error: Input file not found at {filepath}")
        return None
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from {filepath}: {e}")
        return None
    except Exception as e:
        print(f"An error occurred while reading {filepath}: {e}")
        return None

def save_json_data(filepath, data):
    """Saves data to a JSON file."""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"\nSuccessfully saved tour guide descriptions to {filepath}")
    except IOError as e:
        print(f"Error writing to file {filepath}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred while saving JSON: {e}")

def generate_tour_description(original_description):
    """Generates the tour guide description using the Gemini API."""
    if not original_description:
        return "Could not generate tour: Original description was empty."

    prompt = PROMPT_TEMPLATE.format(description=original_description)
    try:

        response = model.generate_content(prompt)

        if not response.parts:
             if response.prompt_feedback and response.prompt_feedback.block_reason:
                 print(f"  -> Blocked: {response.prompt_feedback.block_reason}")
                 return f"Content generation blocked due to: {response.prompt_feedback.block_reason}. Original: {original_description}"
             else:
                 print("  -> Warning: Received empty response from API.")
                 return f"Could not generate tour: Received empty response from API. Original: {original_description}"

        # Extract text safely
        generated_text = ''.join(part.text for part in response.parts if hasattr(part, 'text'))

        if not generated_text.strip():
            print("  -> Warning: Generated text is empty.")
            return f"Could not generate tour: Generated empty text. Original: {original_description}"

        return generated_text.strip()

    except Exception as e:
        print(f"  -> Error during API call: {e}")
        return f"Could not generate tour due to API error: {e}. Original: {original_description}"

# --- Execution ---
if __name__ == "__main__":
    if YOUR_GEMINI_API_KEY == "YOUR_GEMINI_API_KEY":
        print("Error: Please replace 'YOUR_GEMINI_API_KEY' with your actual Gemini API key in the script.")
    else:
        print(f"Loading properties from {INPUT_JSON_FILE}...")
        property_data = load_json_data(INPUT_JSON_FILE)

        if property_data:
            print(f"Found {len(property_data)} properties. Generating tour guide descriptions...")
            tour_guide_descriptions = {}
            count = 0
            total = len(property_data)

            for property_name, description in property_data.items():
                count += 1
                print(f"Processing property {count}/{total}: {property_name}...")
                new_description = generate_tour_description(description)
                tour_guide_descriptions[property_name] = new_description

                time.sleep(1) # Sleep for 1 second between requests

            save_json_data(OUTPUT_JSON_FILE, tour_guide_descriptions)
        else:
            print("Could not load property data. Exiting.")