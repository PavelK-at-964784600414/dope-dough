# Step Images

Add images for each recipe step here to improve SEO and user experience.

## File Naming Convention
- `step-1.jpg` - Activate the starter
- `step-2.jpg` - Prepare the levain
- `step-3.jpg` - Mix main dough (part 1)
- `step-4.jpg` - Bulk rest ~40 min
- `step-5.jpg` - Add salt — mix 2 minutes
- `step-6.jpg` - Add water — mix 2-3 minutes
- `step-7.jpg` - Final mix with seeds — 5 minutes
- `step-8.jpg` - Bulk fermentation — stretch-fold 1
- `step-9.jpg` - Stretch-fold 2
- `step-10.jpg` - Stretch-fold 3 (final)
- `step-11.jpg` - Final bulk fermentation
- `step-12.jpg` - Shaping & cold proof (16 hours)
- `step-13.jpg` - Bake — preheat
- `step-14.jpg` - Bake — stage 1 (steam)
- `step-15.jpg` - Bake — stage 2 (crust)
- `step-16.jpg` - Storage

## Image Requirements for SEO

### Optimal Dimensions
- **Width:** 1200px (minimum 800px)
- **Height:** 675px (16:9 aspect ratio)
- **Format:** JPG (optimized for web, 80-90% quality)
- **File Size:** Under 200KB per image

### SEO Best Practices
1. **Use descriptive filenames** (already done with step-X.jpg pattern)
2. **Alt text is automatically generated** by the component
3. **Lazy loading enabled** for performance
4. **Responsive images** with Next.js Image component
5. **Structured data** (schema.org HowToStep) included

### Image Content Tips
- Show hands performing the action
- Clear, well-lit photos
- Focus on the key technique (folding, mixing, shaping)
- Include the dough/bread at that stage
- Use consistent styling across all images
- Avoid text overlays (use captions in the app instead)

### How to Add Images
1. Take or source high-quality photos of each step
2. Resize to 1200x675px
3. Optimize with tools like TinyPNG or ImageOptim
4. Name according to the pattern above
5. Place in this directory
6. Uncomment the Image component in StepCard.tsx

### Placeholder
Currently showing a gradient placeholder with an icon. Once images are added and the Image component is uncommented in `components/StepCard.tsx`, real images will display.

## Free Image Resources
If you don't have your own photos:
- Unsplash (unsplash.com) - Free bread/baking photos
- Pexels (pexels.com) - Free stock photos
- Your own sourdough process photos (best option!)
