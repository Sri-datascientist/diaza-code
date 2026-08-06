#!/usr/bin/env python3
"""
Test script for S3Service
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from s3_service import S3Service

def test_s3_service():
    print("Testing S3Service...")
    
    try:
        # Create S3Service instance
        s3_service = S3Service()
        print(f"✓ S3Service created successfully")
        print(f"  Bucket: {s3_service.bucket_name}")
        print(f"  Region: {s3_service.region}")
        print(f"  Base URL: {s3_service.base_url}")
        
        # Test debug method
        print("\nTesting debug_s3_bucket...")
        debug_data = s3_service.debug_s3_bucket()
        print(f"✓ Debug data: {debug_data}")
        
        # Test list images
        print("\nTesting list_images_from_folder...")
        images = s3_service.list_images_from_folder('beula (interior design site)/')
        print(f"✓ Found {len(images)} images")
        
        if images:
            print(f"  First image: {images[0]['name']}")
            print(f"  First image URL: {images[0]['s3_url']}")
        
        # Test get projects
        print("\nTesting get_s3_projects...")
        projects = s3_service.get_s3_projects()
        print(f"✓ Found {len(projects)} projects: {projects}")
        
        print("\n✅ All tests passed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_s3_service()
