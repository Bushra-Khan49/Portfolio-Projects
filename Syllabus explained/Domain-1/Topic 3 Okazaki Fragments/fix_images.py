import pytesseract
from PIL import Image, ImageDraw, ImageFont
import sys

def replace_text(img_path, replacements):
    img = Image.open(img_path)
    draw = ImageDraw.Draw(img)
    data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
    
    for rep in replacements:
        target = rep['target'].lower()
        new_text = rep['new_text']
        
        # very simple bounding box logic
        for i in range(len(data['text'])):
            word = data['text'][i].lower()
            if target in word or word in target:
                if len(word) > 2: # avoid small random matches
                    x, y, w, h = data['left'][i], data['top'][i], data['width'][i], data['height'][i]
                    # Draw white box
                    draw.rectangle([x-5, y-5, x+w+5, y+h+5], fill="white")
                    if new_text:
                        # We would need a font, let's just use default
                        # Or better, just print where we found it to confirm
                        print(f"Found '{word}' at {x},{y} in {img_path}")

    # img.save("fixed_" + img_path)

replace_text("assembly_diagram.jpg", [{"target": "methodology", "new_text": ""}])
