# Magic 8 Ball - Student Projects Showcase

A minimalist, sketch-styled web application that displays student projects in a magical 8 ball interface. Projects automatically rotate every 45 seconds with a shake animation, and visitors can manually shake the ball to view random projects.

## Features

- **Magic 8 Ball Display**: Projects appear in the window of a stylized magic 8 ball
- **Auto-Rotation**: Projects automatically rotate every 45 seconds with a shake animation
- **Manual Shake**: Click the button to shake the ball and view a random project
- **Project Submission Form**: Students can submit their projects with:
  - Student name
  - Project title
  - Project link
  - Screenshot upload
- **Minimalist Sketch Aesthetic**: Clean, hand-drawn style with sketch borders and effects
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Supabase Setup (Using Existing "arcade" Project)

1. Go to your [Supabase](https://supabase.com) dashboard
2. Select your existing **"arcade"** project
3. In the SQL Editor, copy and paste the contents of `supabase-setup.sql` and run it. This will create a new `student_projects` table in your arcade database.

   Or manually run this SQL:
   ```sql
   -- Create the student_projects table
   CREATE TABLE student_projects (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       student_name TEXT NOT NULL,
       title TEXT NOT NULL,
       link TEXT NOT NULL,
       screenshot_url TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );

   -- Enable Row Level Security
   ALTER TABLE student_projects ENABLE ROW LEVEL SECURITY;

   -- Create policies to allow public read and insert
   CREATE POLICY "Enable read access for all users" ON student_projects
       FOR SELECT USING (true);

   CREATE POLICY "Enable insert access for all users" ON student_projects
       FOR INSERT WITH CHECK (true);
   ```

4. Create a storage bucket for screenshots:
   - Go to **Storage** in your arcade project's Supabase dashboard
   - Create a new bucket called `project-screenshots`
   - Make it public by going to bucket settings → Make Public

5. Add storage bucket policies (run the additional SQL from `supabase-setup.sql`):
   ```sql
   -- Allow anyone to upload files
   CREATE POLICY "Allow public uploads"
   ON storage.objects FOR INSERT
   TO public
   WITH CHECK (bucket_id = 'project-screenshots');

   -- Allow anyone to read/view files
   CREATE POLICY "Allow public reads"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'project-screenshots');
   ```

6. Get your arcade project credentials:
   - Go to **Settings** → **API**
   - Copy the **Project URL** and **anon/public key**

7. Update `config.js` with your arcade project credentials:
   ```javascript
   const SUPABASE_URL = 'your-arcade-project-url';
   const SUPABASE_ANON_KEY = 'your-arcade-anon-key';
   ```

### 2. Local Development

1. Open the project folder in your code editor
2. You can serve the files using any local server, for example:
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node.js http-server
   npx http-server
   ```
3. Open your browser to `http://localhost:8000`

### 3. Deploy to Netlify

#### Option 1: Drag and Drop
1. Go to [Netlify](https://netlify.com)
2. Sign up or log in
3. Drag and drop your project folder onto the Netlify dashboard

#### Option 2: Git Integration
1. Push your code to GitHub
2. Go to Netlify and click "New site from Git"
3. Connect your repository
4. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.` (current directory)
5. Click "Deploy site"

#### Important: Environment Variables
Since `config.js` contains your Supabase credentials, you have two options:

1. **Keep credentials in config.js** (easier but less secure):
   - Your anon key is safe to expose publicly as it has Row Level Security
   - Just deploy as-is

2. **Use environment variables** (more secure):
   - In Netlify, go to Site settings → Environment variables
   - Add your Supabase credentials
   - Modify config.js to read from environment variables

## Project Structure

```
eight-ball/
├── index.html          # Main display page with magic 8 ball
├── form.html           # Project submission form
├── styles.css          # All styles with sketch aesthetic
├── app.js             # Display page functionality
├── form.js            # Form submission logic
├── config.js          # Supabase configuration
├── netlify.toml       # Netlify configuration
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## Database Schema

The `student_projects` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| student_name | TEXT | Name of the student |
| title | TEXT | Project title |
| link | TEXT | URL to the project |
| screenshot_url | TEXT | Public URL of the screenshot |
| created_at | TIMESTAMP | Submission timestamp |

## Customization

### Change Auto-Rotation Timing
In `app.js`, modify the interval (currently 45000ms = 45 seconds):
```javascript
autoRotateInterval = setInterval(() => {
    shakeTheBall();
}, 45000); // Change this value
```

### Modify Styling
All styles are in `styles.css`. The design uses:
- Courier New font for a sketch-like feel
- 2-3px solid borders for hand-drawn effect
- Transform effects for interactive elements
- Monochrome color scheme with black borders

### Adjust Ball Size
In `styles.css`, modify the `.eight-ball` class:
```css
.eight-ball {
    width: 600px;  /* Change these */
    height: 600px; /* values */
}
```
Note: If you change the ball size, you may also want to adjust the window size (`.window` class) to maintain proportions.

## Troubleshooting

### Projects not loading
- Check browser console for errors
- Verify Supabase credentials in `config.js` are from your "arcade" project
- Ensure the `student_projects` table exists and has the correct structure
- Check that Row Level Security policies allow public read access

### Screenshot upload fails (Row Level Security error)
- **Most common issue**: Missing storage bucket policies! Run the storage policies SQL from step 5 in setup
- Verify the `project-screenshots` bucket exists in Supabase Storage
- Ensure the bucket is set to public
- Check that the storage policies are created (go to Storage → Policies in Supabase)
- Check file size limits (Supabase free tier has limits)

### Styles look broken
- Ensure `styles.css` is in the same directory as HTML files
- Check browser console for 404 errors
- Clear browser cache

## Technologies Used

- HTML5
- CSS3 (with custom animations)
- Vanilla JavaScript
- Supabase (Backend & Storage)
- Netlify (Hosting)

## License

Free to use for educational purposes.
