import json
import os
import re
from elevenlabs.client import ElevenLabs
from elevenlabs import save
import sys # Import sys to handle potential exit on directory creation error

YOUR_ELEVENLABS_API_KEY = "sk_cc8a082f36caea223483eaed88c5c06c86f4d5bc70a65b47" # <--- KEY IS HERE

INPUT_JSON_FILE = "tour_guide_descriptions.json"
AUDIO_OUTPUT_FOLDER = "audio_guides" # Name of the folder to save MP3s

# You can change the voice here. Find voice IDs/names in your ElevenLabs account.
# Common default voices: "Rachel", "Adam", "Bella", "Antoni", etc.
VOICE_NAME_OR_ID = "Bella"
# You can select different models like: "eleven_multilingual_v2", "eleven_mono_v1" etc.
MODEL_ID = "eleven_multilingual_v2"

# --- HELPER FUNCTIONS ---

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

def sanitize_filename(name):
    """Removes or replaces characters invalid for filenames."""
    # Remove characters that are definitely invalid in most file systems
    name = re.sub(r'[\\/*?:"<>|]', "", name)
    # Replace spaces with underscores
    name = name.replace(" ", "_")
    # Replace other potentially problematic characters like parentheses
    name = name.replace("(", "").replace(")", "")
    # Truncate long names
    max_len = 100
    if len(name) > max_len:
        name = name[:max_len]
    return name

def generate_and_save_audio(text_to_speak, property_name, output_dir):
    """Generates audio using ElevenLabs API and saves it into the specified directory."""
    if not text_to_speak or not text_to_speak.strip():
        print("Error: The description text is empty. Cannot generate audio.")
        return False # Indicate failure

    print(f"\nInitializing ElevenLabs client...")
    try:
        client = ElevenLabs(api_key=YOUR_ELEVENLABS_API_KEY)

        print(f"Generating audio for '{property_name}' using voice '{VOICE_NAME_OR_ID}'...")

        # Generate the audio bytes
        audio = client.generate(
            text=text_to_speak,
            voice=VOICE_NAME_OR_ID,
            model=MODEL_ID
        )

        # Create a safe filename
        output_filename = sanitize_filename(property_name) + ".mp3"
        # Construct the full path including the output directory
        output_filepath = os.path.join(output_dir, output_filename)

        print(f"Saving audio to {output_filepath}...")

        # Save the audio bytes to the MP3 file
        save(audio, output_filepath)

        print(f"Successfully saved audio to {output_filepath}")
        return True # Indicate success

    except Exception as e:
        print(f"\nError during ElevenLabs API call or saving file: {e}")
        print("Please check your API key, internet connection, and ElevenLabs account status.")
        return False # Indicate failure

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    # Basic check if placeholder key is still there
    if "YOUR_ELEVENLABS_API_KEY" in YOUR_ELEVENLABS_API_KEY and len(YOUR_ELEVENLABS_API_KEY) < 30:
         print("Error: Please replace 'YOUR_ELEVENLABS_API_KEY' with your actual ElevenLabs API key in the script.")
         sys.exit(1) # Exit if key is likely the placeholder

    # --- Create Output Directory ---
    script_dir = os.getcwd() # Get the directory where the script is running
    audio_dir_path = os.path.join(script_dir, AUDIO_OUTPUT_FOLDER)

    try:
        os.makedirs(audio_dir_path, exist_ok=True) # exist_ok=True prevents error if dir exists
        print(f"Ensured output directory exists: {audio_dir_path}")
    except OSError as e:
        print(f"Error: Could not create directory '{audio_dir_path}'. {e}")
        sys.exit(1) # Exit if directory cannot be created

    # --- Load Data and Process ---
    print(f"\nLoading property descriptions from {INPUT_JSON_FILE}...")
    property_data = load_json_data(INPUT_JSON_FILE)

    if property_data:
        print("\nAvailable properties:")
        # Sort keys for consistent listing (optional)
        property_names = sorted(property_data.keys())
        for name in property_names:
            print(f"- {name}")

        while True: # Loop until valid property is selected or user quits
            property_name_input = input(f"\nEnter the exact name of the property you want to hear about (or type 'quit' to exit): ")

            if property_name_input.lower() == 'quit':
                print("Exiting.")
                break

            if property_name_input in property_data:
                description = property_data[property_name_input]
                # Basic check for error messages from the previous (Gemini) step
                if "Could not generate tour" in description or "Content generation blocked" in description or "exceeded your current quota" in description:
                     print(f"\nWarning: The description for '{property_name_input}' seems to be an error message or incomplete:")
                     print(f"'{description[:200]}...'") # Show snippet
                     print("Skipping audio generation for this property.")
                else:
                    # Call function to generate and save audio into the specific folder
                    generate_and_save_audio(description, property_name_input, audio_dir_path)
                break # Exit loop after processing a valid property
            else:
                print(f"\nError: Property '{property_name_input}' not found in {INPUT_JSON_FILE}.")
                print("Please make sure you entered the name exactly as listed above.")
                # Loop continues to ask for input again
    else:
        print("Could not load property data. Exiting.")