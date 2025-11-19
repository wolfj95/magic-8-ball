// Supabase Configuration for "arcade" project
// Get these credentials from your existing "arcade" Supabase project:
// 1. Go to your Supabase dashboard
// 2. Select the "arcade" project
// 3. Go to Settings → API
// 4. Copy the Project URL and anon/public key below

const SUPABASE_URL = 'https://osmnsdnsgovdnvpissba.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zbW5zZG5zZ292ZG52cGlzc2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MDkwNTIsImV4cCI6MjA3ODQ4NTA1Mn0.DhBqmXUn2H5M7cAFdV4BlHOyYwqk_B2jXf443taIuQs';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database table name (will be created in your arcade project)
const PROJECTS_TABLE = 'student_projects';
