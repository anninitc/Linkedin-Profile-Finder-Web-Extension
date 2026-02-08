from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size):
    # Create a new image with LinkedIn blue background
    img = Image.new('RGB', (size, size), color='#0A66C2')
    draw = ImageDraw.Draw(img)
    
    # Draw a simple "in" symbol (LinkedIn style)
    # White rounded rectangle
    margin = size // 8
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=size // 10,
        fill='white'
    )
    
    # Draw "LP" text (LinkedIn Profiles)
    try:
        font_size = size // 2
        # Try to use a default font, fallback to basic if not available
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        text = "LP"
        # Get text bounding box
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Center the text
        x = (size - text_width) // 2
        y = (size - text_height) // 2 - size // 12
        
        draw.text((x, y), text, fill='#0A66C2', font=font)
    except Exception as e:
        print(f"Font error for size {size}: {e}")
    
    # Save the image
    img.save(f'icon{size}.png')
    print(f'Created icon{size}.png')

# Create icons in different sizes
for size in [16, 48, 128]:
    create_icon(size)

print("All icons created successfully!")
