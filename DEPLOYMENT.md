# Deployment Guide - Vercel + Supabase

## Prerequisites
- Supabase account (create at https://supabase.com)
- Vercel account (create at https://vercel.com)
- GitHub account with your repo pushed

## Step 1: Set Up Supabase Database

### Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Note down your **Project URL** and **Anon Key** from Settings > API

### Create consent_forms Table
Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE consent_forms (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  form_no TEXT,
  consent_date TEXT,
  service_type TEXT,
  pmu_service TEXT,
  name TEXT,
  dob TEXT,
  age TEXT,
  gender TEXT,
  occupation TEXT,
  phone TEXT,
  address TEXT,
  idProof TEXT,
  needleType TEXT,
  payment_mode TEXT,
  price TEXT,
  questionnaire JSONB,
  notes TEXT,
  customer_signature TEXT,
  artist_signature TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_form_no ON consent_forms(form_no);
CREATE INDEX idx_created_at ON consent_forms(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE consent_forms ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all inserts and reads (adjust security as needed)
CREATE POLICY "Allow all operations" ON consent_forms
  FOR ALL USING (true) WITH CHECK (true);
```

### Get Service Role Key
1. Go to Supabase Dashboard > Settings > API
2. Copy the **Service Role Secret** (keep this secret!)

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase Anon Key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your Service Role Secret
5. Click "Deploy"

### Option B: Using Vercel CLI
```bash
npm install -g vercel
vercel
# Follow the prompts and add environment variables
```

## Step 3: Local Testing

### Set up .env.local
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx...
```

### Run Locally
```bash
npm install
npm run dev
```

Test the form at http://localhost:3000

## Step 4: Verify Everything Works

1. Fill out a consent form
2. Submit it
3. Go to Supabase Dashboard > Table Editor
4. Check `consent_forms` table - your data should appear!
5. In Vercel, click "Visit" to test the deployed site

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to git (already in `.gitignore`)
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret - only use on server-side
- In production, consider adding Row Level Security (RLS) policies

## Troubleshooting

### Data not saving?
- Check Vercel logs for API errors
- Verify environment variables are set correctly in Vercel
- Check Supabase table exists and has correct schema

### Getting "Table not found" error?
- Make sure you created the `consent_forms` table in Supabase
- Check table name spelling

### Getting 401 errors?
- Verify API keys are correct
- Make sure you're using Service Role Key (not Anon Key) in API route

## Admin Dashboard

The admin page at `/admin` automatically loads submitted consent forms from the database.
You can:
- View all submissions
- Preview PDF
- Download consent forms
- Search and filter forms
