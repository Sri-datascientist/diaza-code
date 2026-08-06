// Shared schema types for frontend-backend communication

export interface ContactLead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  queries: string;
  status: string;
  source: string;
  assigned_to?: string;
  notes?: string;
  responded_at?: string;
  created_at: string;
}

export interface ContactLeadCreate {
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  queries: string;
}

export interface ContactLeadUpdate {
  status?: string;
  notes?: string;
  assigned_to?: string;
  responded_at?: string;
}

export interface SeoMetadata {
  id: string;
  route_path: string;
  title: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image_asset_id?: string;
  updated_at: string;
}

export interface SeoMetadataCreate {
  route_path: string;
  title: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image_asset_id?: string;
}

export interface S3Image {
  id: string;
  name: string;
  s3_key: string;
  s3_url: string;
  file_name: string;
  file_type: string;
  size: number;
  last_modified?: string;
  project: string;
  room_type: string;
  is_edited: boolean;
  base_file_name: string;
}

export interface S3ImageResponse {
  images: S3Image[];
}

export interface S3ProjectsResponse {
  projects: string[];
}

export interface S3RoomTypesResponse {
  room_types: string[];
}

export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Array<Record<string, any>>;
}
