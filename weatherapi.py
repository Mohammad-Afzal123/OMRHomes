import google.generativeai as genai

# Your Gemini API key
api_key = "AIzaSyAcPjcrfZmDrxN92qAvvws7C-hj7IHu4gI"

# Configure Gemini API
try:
    genai.configure(api_key=api_key)

    # Test Gemini API with a simple prompt
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content("Say 'Hello, Gemini!'")

    if response and hasattr(response, "text"):
        print("API Key is valid! ✅")
        print("Response:", response.text)
    else:
        print("Failed to get a valid response. ❌")

except Exception as e:
    print("Error testing API Key:", e)
