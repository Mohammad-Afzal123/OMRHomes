import google.generativeai as genai
import sys
import os # Import the 'os' module for file path operations

API_KEY = "AIzaSyCETTk2hNJiOq64kkFqpDN2n09juy24r_E"

LAWS_FILE_PATH = "rental_laws.txt" # Name of the text file in the same directory

# --- 0. Load Context from File ---
laws_context = "" # Initialize context variable
try:
    # Ensure the file exists before trying to open it
    if os.path.exists(LAWS_FILE_PATH):
        with open(LAWS_FILE_PATH, 'r', encoding='utf-8') as f:
            laws_context = f.read()
        print(f"Successfully loaded context from '{LAWS_FILE_PATH}'.")
    else:
        print(f"Warning: Laws file '{LAWS_FILE_PATH}' not found.")
        print("Gemini will rely on its general knowledge of Indian law.")
        # laws_context remains empty

except FileNotFoundError:
    print(f"Error: Could not find the file '{LAWS_FILE_PATH}'.")
    print("Please make sure the file exists in the same directory as the script.")
    print("Proceeding without file context...")
except Exception as e:
    print(f"An error occurred while reading '{LAWS_FILE_PATH}': {e}")
    print("Proceeding without file context...")


# --- 1. API Key Check and Configuration ---
if API_KEY == "YOUR_NEW_API_KEY_HERE" or not API_KEY: # Check if it's the placeholder or empty
    print("\nError: Please replace 'YOUR_NEW_API_KEY_HERE' with your actual NEW Gemini API key in the code.")
    print("You MUST revoke the previously exposed key.")
    print("Using environment variables is highly recommended for security.\n")
    sys.exit(1) # Exit if key is not replaced

try:
    genai.configure(api_key=API_KEY)
    print("API Key configured.")

except Exception as e:
    print(f"\nAn error occurred during API key configuration: {e}")
    print("Please ensure your NEW API key is correct and valid.")
    sys.exit(1)

# --- 2. Model Initialization ---
# Using a model capable of handling context well. gemini-1.5-flash is a good balance.
# You could also use 'gemini-1.0-pro' or 'gemini-1.5-pro'
MODEL_NAME = "gemini-1.5-flash" # Or "gemini-1.0-pro"
try:
    print(f"Initializing model: {MODEL_NAME}...")
    model = genai.GenerativeModel(MODEL_NAME)
    print("Model initialized successfully.")

except Exception as e:
    print(f"\nError initializing the Generative Model ({MODEL_NAME}): {e}")
    print("\nPossible causes:")
    print("  - The model name might be incorrect or unavailable.")
    print("  - Your API key might not have permissions for this model.")
    print("  - Google API service might be temporarily down.")
    print("  - Consider updating the SDK: pip install --upgrade google-generativeai")
    sys.exit(1)

# --- 3. Main Interaction Loop ---
print(f"\nGemini Legal Assistant (Indian Property/Rental Law - referring to '{LAWS_FILE_PATH}').")
print("Type 'quit' or 'exit' to end.")
print("====================================================================")

while True:
    try:
        # 3.1 Get user input for the legal question
        user_question = input("You (Ask your property/rental question): ")

        # 3.2 Check for exit command
        if user_question.lower().strip() in ["quit", "exit"]:
            print("Gemini: Goodbye!")
            break

        # 3.3 Handle empty input
        if not user_question.strip():
            continue

        # 3.4 Construct the prompt for Gemini
        # Combine the loaded context, instructions, and the user's question
        full_prompt = f"""
        **Context Document (Indian Rental/Property Laws):**
        --- START OF DOCUMENT ---
        {laws_context if laws_context else "No document provided. Rely on general knowledge."}
        --- END OF DOCUMENT ---

        **Instructions:**
        You are a helpful assistant specializing in Indian property, renting, selling, and buying laws.
        1. Analyze the user's question below.
        2. FIRST, try to answer the question using ONLY the information provided in the 'Context Document' above.
        3. If the answer is found in the document, clearly state that the information is based on the provided document.
        4. If the document does NOT contain the specific information needed to answer the question, then provide a helpful answer based on your general knowledge of common Indian property and rental laws. In this case, state that the information is based on general knowledge as it wasn't found in the specific document.
        5. Focus the answer specifically on the Indian context.

        **User's Question:**
        {user_question}

        **Answer:**
        """

        # 3.5 Send prompt to Gemini and get response
        # print("Gemini: Consulting...") # Optional indicator
        response = model.generate_content(full_prompt)

        # 3.6 Print Gemini's response
        if response.parts:
             print(f"Gemini: {response.text}")
        else:
            # Handle cases where the response might be blocked or empty
            print("Gemini: I received no valid response. The question might have triggered safety filters or there was an issue.")
            try:
                 print(f"       Feedback: {response.prompt_feedback}")
            except Exception:
                 print("       (No specific feedback available)")
        print("-" * 68) # Separator for clarity

    except KeyboardInterrupt:
        print("\nGemini: Goodbye! (Interrupted by user)")
        break
    except Exception as e:
        print(f"\nAn error occurred during conversation: {e}")
        print("There might be an issue with the API request, the response format, or network connectivity.")
        print("-" * 68) # Separator

print("====================================================================")
print("Chat session ended.")