import json
import os

# Load prompts from JSON
with open('../public/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extract all option texts
phrases = []
p = 0
for question in data:
    o = 0
    for option in question.get("options", []):
        text = option.get("text")
        if text:
            phrases.append((p, o, text))
        o += 1
    p += 1

i = 0
for p, o, phrase in phrases:
    filename = f"images/{i+1:03}_{phrase.replace(' ', '_')[:30]}.png"
    new_filename = f"images-renamed/{p}-{o}.png"
    try:
        os.rename(filename, new_filename)
    except:
        pass

    i += 1

