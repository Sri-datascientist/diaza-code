"""
Bulk Upload Script for Cloudinary - Diaza Studio
Scans all images in frontend/public/drive_images and uploads to Cloudinary.
Generates frontend/src/data/cloudinary-images.json for the React frontend.
"""

import os
import json
import re
import sys
import urllib.parse

try:
    import cloudinary
    import cloudinary.uploader
    HAS_CLOUDINARY_SDK = True
except ImportError:
    HAS_CLOUDINARY_SDK = False


def main():
    # Try reading frontend/.env if credentials not in env
    env_path = os.path.join("frontend", ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("CLOUDINARY_URL="):
                        # format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
                        c_url = line.split("=", 1)[1].strip()
                        if "cloudinary://" in c_url:
                            auth_part, cname = c_url.replace("cloudinary://", "").split("@")
                            key, secret = auth_part.split(":")
                            os.environ.setdefault("CLOUDINARY_CLOUD_NAME", cname)
                            os.environ.setdefault("CLOUDINARY_API_KEY", key)
                            os.environ.setdefault("CLOUDINARY_API_SECRET", secret)
                    elif "=" in line and not line.startswith("#"):
                        k, v = line.split("=", 1)
                        os.environ.setdefault(k.strip(), v.strip())
        except Exception as e:
            print(f"Warning reading .env: {e}")

    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME", "nw9o0vrv")
    api_key = os.environ.get("CLOUDINARY_API_KEY", "285245471972584")
    api_secret = os.environ.get("CLOUDINARY_API_SECRET", "RGNNei3suBV7ckM5zwji-3fW-Fc")

    base_dir = os.path.join("frontend", "public")
    output_json = os.path.join("frontend", "src", "data", "cloudinary-images.json")

    mapping = {}
    missing_files = []

    if HAS_CLOUDINARY_SDK and api_key and api_secret:
        print(f"Configuring Cloudinary SDK for cloud: {cloud_name}")
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret,
            secure=True
        )

    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg")):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, base_dir).replace("\\", "/")
                local_key = "/" + rel_path

                # Generate clean public ID
                clean_rel = re.sub(r'[^a-zA-Z0-9_/.-]', '_', rel_path)
                public_id = f"diaza_studio/{clean_rel}".rsplit(".", 1)[0]

                if HAS_CLOUDINARY_SDK and api_key and api_secret:
                    try:
                        print(f"Uploading {file} to Cloudinary public_id: {public_id}...")
                        res = cloudinary.uploader.upload(
                            full_path,
                            public_id=public_id,
                            overwrite=True,
                            resource_type="image"
                        )
                        c_url = res.get("secure_url")
                    except Exception as err:
                        print(f"Cloudinary API upload error for {file}: {err}")
                        c_url = f"https://res.cloudinary.com/{cloud_name}/image/upload/f_auto,q_auto/{public_id}"
                else:
                    c_url = f"https://res.cloudinary.com/{cloud_name}/image/upload/f_auto,q_auto/{public_id}"

                item = {
                    "publicId": public_id,
                    "cloudinaryUrl": c_url,
                    "fileName": file,
                    "size": os.path.getsize(full_path)
                }
                mapping[local_key] = item
                encoded_key = urllib.parse.quote(local_key, safe="/")
                if encoded_key != local_key:
                    mapping[encoded_key] = item

    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump({
            "cloudName": cloud_name,
            "baseUrl": f"https://res.cloudinary.com/{cloud_name}/image/upload",
            "totalCount": len(mapping),
            "missingCount": len(missing_files),
            "missingFiles": missing_files,
            "images": mapping
        }, f, indent=2)

    print(f"\nBulk upload complete! Manifest generated at: {output_json}")
    print(f"Total mapped images: {len(mapping)}")
    if missing_files:
        print(f"Missing images reported: {len(missing_files)}")


if __name__ == "__main__":
    main()
