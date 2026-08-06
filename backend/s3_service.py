import boto3
from botocore.exceptions import ClientError
from typing import List, Dict, Any, Optional
from datetime import datetime
from urllib.parse import unquote
from config import settings

class S3Service:
    def __init__(self):
        try:
            import os
            import logging
            logger = logging.getLogger(__name__)
            
            self.bucket_name = settings.s3_bucket_name
            self.region = settings.aws_region
            self.base_url = f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com"
            
            # Check if running on Lambda
            is_lambda = (
                os.environ.get("AWS_LAMBDA_FUNCTION_NAME") is not None or
                os.environ.get("AWS_EXECUTION_ENV") is not None or
                os.environ.get("LAMBDA_TASK_ROOT") is not None
            )
            
            logger.info(f"[S3] Initializing S3Service")
            logger.info(f"[S3] Running on Lambda: {is_lambda}")
            logger.info(f"[S3] Bucket: {self.bucket_name}, Region: {self.region}")
            logger.info(f"[S3] AWS_ACCESS_KEY_ID from env: {bool(os.getenv('AWS_ACCESS_KEY_ID'))}")
            logger.info(f"[S3] AWS_ACCESS_KEY_ID from settings: {bool(settings.aws_access_key_id)}")
            logger.info(f"[S3] AWS_SECRET_ACCESS_KEY from env: {bool(os.getenv('AWS_SECRET_ACCESS_KEY'))}")
            logger.info(f"[S3] S3_BUCKET_NAME from env: {os.getenv('S3_BUCKET_NAME', 'NOT SET')}")
            
            # Initialize boto3 S3 client with credentials
            # On Lambda, prefer IAM role; otherwise use explicit credentials
            client_kwargs = {
                'region_name': self.region
            }
            
            # On Lambda, ALWAYS use IAM role (more secure and reliable)
            # For local dev, use explicit credentials
            if is_lambda:
                # On Lambda, ALWAYS use IAM role - don't use explicit credentials
                # boto3 will automatically use the Lambda execution role
                logger.info(f"[S3] Using IAM role credentials (Lambda execution role)")
                logger.info(f"[S3] Note: Ensure Lambda execution role has S3 permissions")
                # Don't add any credentials - let boto3 use IAM role
            else:
                # Local development - use explicit credentials from settings
                if settings.aws_access_key_id and settings.aws_secret_access_key:
                    client_kwargs['aws_access_key_id'] = settings.aws_access_key_id
                    client_kwargs['aws_secret_access_key'] = settings.aws_secret_access_key
                    logger.info(f"[S3] Using explicit AWS credentials for local development")
                else:
                    logger.warning(f"[S3] No credentials provided - boto3 will use default credential chain")
            
            self.s3_client = boto3.client('s3', **client_kwargs)
            logger.info(f"[S3] S3Service initialized successfully")
            
            # Test connection by checking bucket location
            try:
                location = self.s3_client.get_bucket_location(Bucket=self.bucket_name)
                logger.info(f"[S3] Successfully connected to bucket. Location: {location.get('LocationConstraint', 'us-east-1')}")
            except Exception as test_error:
                error_code = None
                if hasattr(test_error, 'response'):
                    error_code = test_error.response.get('Error', {}).get('Code', 'Unknown')
                
                if error_code == 'InvalidAccessKeyId':
                    logger.error(f"[S3] Invalid credentials detected. On Lambda, ensure IAM role has S3 permissions instead of using explicit credentials.")
                logger.warning(f"[S3] Could not verify bucket connection: {test_error}")
                # Don't fail initialization, but log the warning
                
        except Exception as e:
            import traceback
            error_msg = f"[S3] ERROR initializing S3Service: {e}"
            error_trace = traceback.format_exc()
            print(error_msg)
            print(error_trace)
            # Also try to log if logger is available
            try:
                import logging
                logging.getLogger(__name__).error(error_msg)
                logging.getLogger(__name__).error(error_trace)
            except:
                pass
            raise

    def get_s3_url(self, s3_key: str) -> str:
        """Generate S3 URL for an object."""
        return f"{self.base_url}/{s3_key}"

    def list_images_from_folder(self, folder_path: Optional[str] = None) -> List[Dict[str, Any]]:
        """List images from a specific S3 folder using boto3."""
        try:
            # Handle folder_path - FastAPI may have already decoded it
            # S3 object keys use + signs, not spaces
            if folder_path:
                # If it still has URL encoding, decode it (but preserve + signs)
                if '%' in folder_path:
                    folder_path = unquote(folder_path)
                # Ensure + signs are used (not spaces) - S3 keys use + for spaces
                folder_path = folder_path.replace(' ', '+')
                # Ensure it ends with / if it's a folder path (for proper S3 prefix matching)
                folder_path = folder_path.rstrip('/') + '/'
            
            # Use the correct folder path - S3 keys use + not spaces
            prefix = folder_path or 'beula+(interior+design+site)/'
            
            print(f"[S3] Listing objects in bucket: {self.bucket_name} with prefix: {prefix}")
            
            # Use boto3 to list objects
            paginator = self.s3_client.get_paginator('list_objects_v2')
            pages = paginator.paginate(Bucket=self.bucket_name, Prefix=prefix, MaxKeys=1000)
            
            images = []
            for page in pages:
                if 'Contents' not in page:
                    continue
                    
                for obj in page['Contents']:
                    key = obj['Key']
                    # Only include image files
                    if any(key.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']):
                        images.append({
                            'id': key,
                            'name': key.split('/')[-1],
                            's3_key': key,
                            's3_url': self.get_s3_url(key),
                            'file_name': key.split('/')[-1],
                            'file_type': key.split('.')[-1].lower(),
                            'project': self._extract_project_from_path(key),
                            'room_type': self._extract_room_type_from_path(key),
                            'is_edited': 'edited' in key.lower() or 'reju-edited' in key.lower(),
                            'base_file_name': key.split('/')[-1].split('.')[0],
                            'size': obj.get('Size', 0),
                            'last_modified': obj.get('LastModified', datetime.now()).isoformat()
                        })
            
            print(f"[S3] Found {len(images)} images")
            return images
            
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', 'Unknown')
            error_message = e.response.get('Error', {}).get('Message', str(e))
            error_details = f"[S3] AWS Client error: {error_code} - {error_message}"
            error_details += f"\n[S3] Bucket: {self.bucket_name}, Prefix: {prefix}"
            error_details += f"\n[S3] Region: {self.region}"
            error_details += f"\n[S3] Using credentials: {bool(settings.aws_access_key_id)}"
            print(error_details)
            print(f"[S3] Full error: {e}")
            import traceback
            print(f"[S3] Traceback: {traceback.format_exc()}")
            
            # Provide more helpful error messages
            if error_code == 'AccessDenied':
                raise Exception(f"S3 Access Denied. Check IAM permissions for bucket '{self.bucket_name}'. Required: s3:ListBucket, s3:GetObject")
            elif error_code == 'NoSuchBucket':
                raise Exception(f"S3 bucket '{self.bucket_name}' not found in region '{self.region}'")
            else:
                raise Exception(f"S3 error ({error_code}): {error_message}. Bucket: {self.bucket_name}, Prefix: {prefix}")
        except Exception as e:
            error_details = f"[S3] Error listing images: {e}"
            error_details += f"\n[S3] Bucket: {self.bucket_name}, Prefix: {prefix if 'prefix' in locals() else 'N/A'}"
            error_details += f"\n[S3] Region: {self.region}"
            error_details += f"\n[S3] Using credentials: {bool(settings.aws_access_key_id)}"
            print(error_details)
            import traceback
            print(f"[S3] Traceback: {traceback.format_exc()}")
            
            # Check if it's a credentials/permissions issue
            error_str = str(e).lower()
            if 'access denied' in error_str or 'unauthorized' in error_str or 'credentials' in error_str:
                raise Exception(f"S3 access error: {str(e)}. Please verify IAM permissions or AWS credentials.")
            else:
                raise Exception(f"Failed to list S3 images: {str(e)}")

    def get_s3_image(self, s3_key: str) -> Dict[str, Any]:
        """Get specific image from S3."""
        try:
            # Use boto3 to get object metadata
            response = self.s3_client.head_object(Bucket=self.bucket_name, Key=s3_key)
            
            return {
                's3_key': s3_key,
                's3_url': self.get_s3_url(s3_key),
                'content_type': response.get('ContentType'),
                'content_length': response.get('ContentLength'),
                'last_modified': response.get('LastModified').isoformat() if response.get('LastModified') else None,
            }
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', 'Unknown')
            if error_code == '404':
                raise Exception(f"Image not found: {s3_key}")
            print(f'Error getting S3 image: {e}')
            raise Exception('Failed to fetch image from S3')
        except Exception as e:
            print(f'Error getting S3 image: {e}')
            raise Exception('Failed to fetch image from S3')

    def get_s3_projects(self) -> List[str]:
        """Get all projects from S3."""
        try:
            print(f"[S3] Getting projects from bucket: {self.bucket_name}")
            
            # Use boto3 to list common prefixes (folders)
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix='beula+(interior+design+site)/',
                Delimiter='/'
            )
            
            projects = []
            if 'CommonPrefixes' in response:
                for prefix_info in response['CommonPrefixes']:
                    prefix_text = prefix_info.get('Prefix', '')
                    # Extract project name from path like "beula+(interior+design+site)/Anushka+site/"
                    if prefix_text and prefix_text != 'beula+(interior+design+site)/':
                        project_name = prefix_text.replace('beula+(interior+design+site)/', '').rstrip('/')
                        if project_name:
                            projects.append(project_name)
            
            print(f"[S3] Found projects: {projects}")
            return projects
            
        except ClientError as e:
            print(f'[S3] AWS Client error getting projects: {e}')
            return []
        except Exception as e:
            print(f'Error getting S3 projects: {e}')
            return []

    def get_s3_room_types(self, project_name: str) -> List[str]:
        """Get all room types for a specific project from S3."""
        try:
            print(f"[S3] Getting room types for project: {project_name}")
            
            prefix = f"beula+(interior+design+site)/{project_name}/"
            # Use boto3 to list common prefixes (folders)
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix,
                Delimiter='/'
            )
            
            room_types = []
            if 'CommonPrefixes' in response:
                for prefix_info in response['CommonPrefixes']:
                    prefix_text = prefix_info.get('Prefix', '')
                    # Extract room type from path
                    if prefix_text and prefix_text.startswith(f"beula+(interior+design+site)/{project_name}/"):
                        room_type = prefix_text.replace(f"beula+(interior+design+site)/{project_name}/", '').rstrip('/')
                        if room_type:
                            room_types.append(room_type)
            
            print(f"[S3] Found room types for {project_name}: {room_types}")
            return room_types
            
        except ClientError as e:
            print(f'[S3] AWS Client error getting room types: {e}')
            return []
        except Exception as e:
            print(f'Error getting S3 room types: {e}')
            return []

    def _extract_project_from_path(self, s3_key: str) -> str:
        """Extract project name from S3 key path."""
        try:
            if 'beula+(interior+design+site)/' in s3_key:
                parts = s3_key.split('beula+(interior+design+site)/')[1].split('/')
                if len(parts) > 0:
                    return parts[0]
            return "Unknown Project"
        except:
            return "Unknown Project"

    def _extract_room_type_from_path(self, s3_key: str) -> str:
        """Extract room type from S3 key path."""
        try:
            if 'beula+(interior+design+site)/' in s3_key:
                parts = s3_key.split('beula+(interior+design+site)/')[1].split('/')
                if len(parts) > 1:
                    return parts[1]
            return "Unknown Room"
        except:
            return "Unknown Room"

    def _get_file_type(self, file_name: str) -> str:
        """Get file type from file name."""
        try:
            return file_name.split('.')[-1].lower()
        except:
            return "unknown"

    def _extract_base_file_name(self, file_name: str) -> str:
        """Extract base file name without extension."""
        try:
            return file_name.split('.')[0]
        except:
            return file_name

    def _remove_duplicate_images(self, images: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate images, prioritizing edited versions."""
        unique_images = {}
        
        for image in images:
            base_name = image['base_file_name']
            is_edited = image['is_edited']
            
            if base_name not in unique_images:
                unique_images[base_name] = image
            elif is_edited and not unique_images[base_name]['is_edited']:
                # Replace with edited version
                unique_images[base_name] = image
        
        return list(unique_images.values())

    def debug_s3_bucket(self) -> Dict[str, Any]:
        """Debug method to check S3 bucket contents."""
        try:
            # List root contents using boto3
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                MaxKeys=100
            )
            
            contents = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    contents.append(obj['Key'])
            
            return {
                "bucket": self.bucket_name,
                "region": self.region,
                "base_url": self.base_url,
                "root_contents": contents[:10],  # First 10 items
                "total_items": len(contents)
            }
            
        except ClientError as e:
            return {"error": f"AWS Client Error: {str(e)}", "bucket": self.bucket_name}
        except Exception as e:
            return {"error": str(e), "bucket": self.bucket_name}