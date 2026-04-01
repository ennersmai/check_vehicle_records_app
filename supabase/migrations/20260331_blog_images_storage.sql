-- Add missing columns to blog_posts if not exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'blog_posts'
  ) THEN
    ALTER TABLE blog_posts
    ADD COLUMN IF NOT EXISTS featured_image TEXT,
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS meta_title TEXT,
    ADD COLUMN IF NOT EXISTS meta_description TEXT;
  ELSE
    RAISE NOTICE 'blog_posts table does not exist, skipping column addition';
  END IF;
END
$$;

-- Create storage bucket for blog images if not exists
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects and create policies
DO $$
BEGIN
  -- Enable RLS if not already enabled
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  
  -- Remove existing policies if they exist to avoid conflicts
  DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;
  
  -- Create policy to allow public read access to blog images
  CREATE POLICY "Public can view blog images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'blog-images');

  -- Create policy to allow authenticated users to upload blog images (admins only)
  CREATE POLICY "Admins can upload blog images"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'blog-images' AND
      auth.uid() IN (
        'd99958fe-f7cb-439a-a42b-43663e5f39a2', 
        '01f951f1-597e-4419-80d2-00753f6cf210'
      )
    );

  -- Create policy to allow authenticated users to update blog images (admins only)
  CREATE POLICY "Admins can update blog images"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'blog-images' AND
      auth.uid() IN (
        'd99958fe-f7cb-439a-a42b-43663e5f39a2', 
        '01f951f1-597e-4419-80d2-00753f6cf210'
      )
    );

  -- Create policy to allow authenticated users to delete blog images (admins only)
  CREATE POLICY "Admins can delete blog images"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'blog-images' AND
      auth.uid() IN (
        'd99958fe-f7cb-439a-a42b-43663e5f39a2', 
        '01f951f1-597e-4419-80d2-00753f6cf210'
      )
    );
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error setting up RLS policies for storage.objects: %', SQLERRM;
END
$$;