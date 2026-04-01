-- Fix storage bucket RLS policies using Supabase's recommended approach
-- This migration properly sets up RLS for the blog-images storage bucket

-- First, ensure the bucket exists
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;

-- Create policies for the blog-images bucket
-- Public read access
CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Admin upload access (for specific admin users)
CREATE POLICY "Admins can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images' AND 
    (
      -- Service role can always upload
      auth.role() = 'service_role' OR
      -- Specific admin users can upload
      auth.uid() IN (
        'd99958fe-f7cb-439a-a42b-43663e5f39a2',
        '01f951f1-597e-4419-80d2-00753f6cf210'
      )
    )
  );

-- Admin update access
CREATE POLICY "Admins can update blog images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'blog-images' AND 
    (
      auth.role() = 'service_role' OR
      auth.uid() IN (
        'd99958fe-f7cb-439a-a42b-43663e5f39a2',
        '01f951f1-597e-4419-80d2-00753f6cf210'
      )
    )
  );

-- Admin delete access
CREATE POLICY "Admins can delete blog images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blog-images' AND 
    (
      auth.role() = 'service_role' OR
      auth.uid() IN (
        'd99958fe-f7cb-439a-a42b-43663e5f39a2',
        '01f951f1-597e-4419-80d2-00753f6cf210'
      )
    )
  );

-- Grant necessary permissions to authenticated users for the bucket
GRANT USAGE ON SCHEMA storage TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO authenticated, anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO authenticated, anon;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
