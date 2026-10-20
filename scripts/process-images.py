import os
from PIL import Image, ImageOps

source_dir = r"C:\Users\Chitransh\Neelam\public\images\new_converted"
target_dir = r"C:\Users\Chitransh\Neelam\public\images"

mapping = {
    "IMG_0788.jpg": "salon-pedicure-lounge",
    "IMG_0789.jpg": "salon-pedicure-chair",
    "IMG_0790.jpg": "salon-pedicure-spa",
    "IMG_0791.jpg": "salon-ambience-floor",
    "IMG_0792.jpg": "salon-derma-clinic",
    "IMG_0793.jpg": "salon-facial-suite-1",
    "IMG_0795.jpg": "salon-facial-suite-2",
    "IMG_0796.jpg": "salon-facial-room",
    "IMG_0797.jpg": "salon-facial-suite-3",
    "IMG_0798.jpg": "salon-facial-suite-4",
    "IMG_0799.jpg": "salon-pmu-treatment",
    "IMG_0800.jpg": "salon-skin-suite",
    "IMG_0801.jpg": "salon-ambience-crest",
    "IMG_0802.jpg": "salon-nail-art-bar",
    "IMG_0803.jpg": "salon-nail-studio",
}

max_dim = 1600

for src_name, base_name in mapping.items():
    src_path = os.path.join(source_dir, src_name)
    if not os.path.exists(src_path):
        print(f"Missing: {src_path}")
        continue
    
    with Image.open(src_path) as im:
        im = ImageOps.exif_transpose(im)
        w, h = im.size
        if max(w, h) > max_dim:
            if w > h:
                new_w = max_dim
                new_h = int(h * (max_dim / w))
            else:
                new_h = max_dim
                new_w = int(w * (max_dim / h))
            im = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Save JPEG
        jpg_out = os.path.join(target_dir, f"{base_name}.jpg")
        im.save(jpg_out, "JPEG", quality=88, optimize=True)
        jpg_size = os.path.getsize(jpg_out) // 1024
        
        # Save WebP
        webp_out = os.path.join(target_dir, f"{base_name}.webp")
        im.save(webp_out, "WEBP", quality=88, method=6)
        webp_size = os.path.getsize(webp_out) // 1024
        
        print(f"Processed {base_name}: {im.size} -> JPG {jpg_size}KB, WebP {webp_size}KB")

print("All images processed successfully!")
