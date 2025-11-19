-- Magic 8 Ball Project - Database Setup for Existing "arcade" Supabase Project
-- Run this SQL in your "arcade" project's SQL Editor to add the student_projects table

-- Create the student_projects table
CREATE TABLE student_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name TEXT NOT NULL,
    title TEXT NOT NULL,
    link TEXT,
    screenshot_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE student_projects ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read and insert
-- This allows anyone to view projects and submit new ones
CREATE POLICY "Enable read access for all users" ON student_projects
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON student_projects
    FOR INSERT WITH CHECK (true);

-- Optional: Create an index on created_at for better performance
CREATE INDEX student_projects_created_at_idx ON student_projects (created_at DESC);

-- Storage Bucket Policies
-- These policies allow anyone to upload and view screenshots
-- IMPORTANT: Make sure you've created the 'project-screenshots' bucket first!

-- Allow anyone to upload files to the screenshots folder
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'project-screenshots');

-- Allow anyone to read/view files (for public access)
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-screenshots');

-- If you already created the table with link as NOT NULL, run this to update it:
-- ALTER TABLE student_projects ALTER COLUMN link DROP NOT NULL;

-- Note: After running this SQL, you also need to:
-- 1. Go to Storage in your "arcade" Supabase dashboard
-- 2. Create a new bucket called 'project-screenshots'
-- 3. Make the bucket public in the bucket settings
-- 4. If you've already created the bucket, just run this SQL to add the policies
