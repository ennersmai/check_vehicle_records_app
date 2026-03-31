-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- Admins can manage all blog posts
CREATE POLICY "Admins can manage all blog posts"
  ON blog_posts FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE id IN ('d99958fe-f7cb-439a-a42b-43663e5f39a2', '01f951f1-597e-4419-80d2-00753f6cf210')
    )
  );

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(published);

-- FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Public can read published FAQs
CREATE POLICY "Public can read published FAQs"
  ON faqs FOR SELECT
  USING (published = true);

-- Admins can manage all FAQs
CREATE POLICY "Admins can manage all FAQs"
  ON faqs FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE id IN ('d99958fe-f7cb-439a-a42b-43663e5f39a2', '01f951f1-597e-4419-80d2-00753f6cf210')
    )
  );

-- Create index for sort order
CREATE INDEX IF NOT EXISTS faqs_sort_order_idx ON faqs(sort_order);

-- Insert default FAQs
INSERT INTO faqs (question, answer, sort_order, published) VALUES
('What is a vehicle report?', 'A vehicle report is a comprehensive check on a car''s history. It includes data on outstanding finance, previous accidents, write-offs, stolen status, MOT history, mileage discrepancies, and more — all sourced from official UK databases.', 1, true),
('How do I generate a report?', 'Simply enter a UK vehicle registration number on our app or website, and we''ll instantly pull together all available data into a clear, easy-to-read report. Free basic checks are available, and premium reports offer deeper insights.', 2, true),
('Where does the data come from?', 'Our reports are compiled from trusted UK sources including the DVLA, MOT testing records, insurance write-off databases, finance agreement registries, and police stolen vehicle records. This ensures you get accurate, up-to-date information.', 3, true),
('Is my payment secure?', 'Absolutely. All payments are processed securely through encrypted payment providers (Google Play, Apple App Store, or Stripe on web). We never store your card details directly — your financial information is always protected.', 4, true),
('Can I download or share my report?', 'Yes! Premium reports can be downloaded as a full PDF document, which you can save, print, or share with others. This is especially useful when negotiating a purchase or keeping records for your own vehicle.', 5, true)
ON CONFLICT DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
