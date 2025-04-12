from openai import OpenAI

import json
import time
import os
import requests

# Set your OpenAI API key
with open('key.txt') as k:
    client = OpenAI(api_key=k.readline().rstrip())

# Create folder for images
os.makedirs("images", exist_ok=True)

# Load prompts from JSON
with open('../public/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extract all option texts
phrases = []
for question in data:
    for option in question.get("options", []):
        text = option.get("text")
        if text:
            phrases.append(text)

# Describe your consistent image style
style_description = " to be used as an icon on a button in a web page, with a pure white background to enable it to be separated from its background using image tools after generation. In the style of a vintage illustrated children's book, dark, magical and  mysterious. Do not add any text. Ensure the illustration is an object or objects that do not come close to the edges of the image."

# Generate and download images
for i, phrase in enumerate(phrases):
    prompt = f"{phrase}, {style_description}"
    print(f"[{i+1}/{len(phrases)}] Prompt: {prompt}")

    try:
        response = client.images.generate(model="dall-e-3",
        prompt=prompt,
        n=1,
        size="1024x1024",
        response_format="url")
        image_url = response.data[0].url
        print(f"→ Image URL: {image_url}")

        # Download image
        image_data = requests.get(image_url).content
        filename = f"images/{i+1:03}_{phrase.replace(' ', '_')[:30]}.png"
        with open(filename, "wb") as img_file:
            img_file.write(image_data)
        print(f"✓ Saved to {filename}")

    except Exception as e:
        print(f"✗ Error generating image for '{phrase}': {e}")

    time.sleep(2)  # Prevent rate limiting
