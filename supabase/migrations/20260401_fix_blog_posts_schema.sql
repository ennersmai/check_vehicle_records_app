-- Create blog_posts table if it doesn't exist with all required columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'blog_posts'
  ) THEN
    CREATE TABLE blog_posts (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT NOT NULL,
      featured_image TEXT,
      image_url TEXT,
      meta_title TEXT,
      meta_description TEXT,
      published BOOLEAN DEFAULT FALSE,
      author_id UUID REFERENCES auth.users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create indexes
    CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
    CREATE INDEX idx_blog_posts_published ON blog_posts(published);
    CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
    
    RAISE NOTICE 'blog_posts table created successfully';
  ELSE
    -- Table exists, ensure all columns are present
    ALTER TABLE blog_posts 
    ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ADD COLUMN IF NOT EXISTS title TEXT NOT NULL,
    ADD COLUMN IF NOT EXISTS slug TEXT NOT NULL UNIQUE,
    ADD COLUMN IF NOT EXISTS excerpt TEXT,
    ADD COLUMN IF NOT EXISTS content TEXT NOT NULL,
    ADD COLUMN IF NOT EXISTS featured_image TEXT,
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS meta_title TEXT,
    ADD COLUMN IF NOT EXISTS meta_description TEXT,
    ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    
    -- Create indexes if they don't exist
    CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
    
    RAISE NOTICE 'blog_posts table columns verified/added';
  END IF;
END
$$;

-- Refresh schema cache to ensure Supabase recognizes the new columns
NOTIFY pgrst, 'reload schema';
