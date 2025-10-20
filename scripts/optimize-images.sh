#!/bin/bash

# Image optimization script for sourdough step images
# Usage: ./optimize-images.sh

echo "🍞 Sourdough Step Image Optimizer"
echo "=================================="
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Install it first:"
    echo "   macOS: brew install imagemagick"
    echo "   Linux: sudo apt-get install imagemagick"
    exit 1
fi

# Directory containing images
IMAGE_DIR="./public/images/steps"
OPTIMIZED_DIR="./public/images/steps/optimized"

# Create optimized directory if it doesn't exist
mkdir -p "$OPTIMIZED_DIR"

# Counter
count=0

# Process all jpg and png files
for img in "$IMAGE_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
    # Check if file exists (handles no match case)
    [ -f "$img" ] || continue
    
    filename=$(basename "$img")
    name="${filename%.*}"
    
    echo "📸 Processing: $filename"
    
    # Resize to 1200x675 (16:9), optimize quality to 85%, strip metadata
    convert "$img" \
        -resize 1200x675^ \
        -gravity center \
        -extent 1200x675 \
        -quality 85 \
        -strip \
        "$OPTIMIZED_DIR/$name.jpg"
    
    original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img")
    optimized_size=$(stat -f%z "$OPTIMIZED_DIR/$name.jpg" 2>/dev/null || stat -c%s "$OPTIMIZED_DIR/$name.jpg")
    
    savings=$(( (original_size - optimized_size) * 100 / original_size ))
    
    echo "   ✅ Saved ${savings}% ($(numfmt --to=iec $original_size) → $(numfmt --to=iec $optimized_size))"
    echo ""
    
    ((count++))
done

if [ $count -eq 0 ]; then
    echo "ℹ️  No images found to optimize."
    echo "   Add .jpg or .png files to $IMAGE_DIR"
else
    echo "🎉 Optimized $count images!"
    echo "   Optimized images are in: $OPTIMIZED_DIR"
    echo ""
    echo "Next steps:"
    echo "1. Review optimized images"
    echo "2. Move them to $IMAGE_DIR (replace originals)"
    echo "3. Uncomment the Image component in components/StepCard.tsx"
fi
