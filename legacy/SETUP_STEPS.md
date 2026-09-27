# Phase 1 Database Setup - Step-by-Step Guide

## 🎯 Quick Setup (Follow These Steps)

### Step 1: Open Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Log in to your account
3. Select your TypingOS project

---

### Step 2: Run Database Migration

#### Option A: Via SQL Editor (Recommended)

1. In Supabase Dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query** button
3. Copy the ENTIRE contents below:

```sql
-- Phase 1 Core Functionality - Database Migration
-- This script creates the necessary tables and policies for:
-- 1. Notifications System
-- 2. User Profiles

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('achievement', 'social', 'system', 'quest')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running the migration)
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create RLS Policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Create RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profiles
  FOR SELECT USING (is_public = true OR auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- REALTIME PUBLICATION (for real-time notifications)
-- ============================================================================

-- Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. Wait for "Success. No rows returned" message

✅ **Expected Result**: Green success message

---

### Step 3: Create Storage Bucket

1. In Supabase Dashboard, click **Storage** in the left sidebar
2. Click **Create a new bucket** button
3. Fill in the form:
   - **Name**: `avatars`
   - **Public bucket**: ✅ **Check this box** (IMPORTANT!)
   - **File size limit**: `2097152` (2MB in bytes)
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp,image/gif`
4. Click **Create bucket**

✅ **Expected Result**: New "avatars" bucket appears in the list

---

### Step 4: Set Storage Policies

1. Still in **Storage**, click on the **avatars** bucket
2. Click the **Policies** tab
3. Click **New Policy**
4. For each policy below, click **New Policy** → **For full customization** → paste the SQL:

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

**Policy 2: User Upload**
```sql
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3: User Update**
```sql
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 4: User Delete**
```sql
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

✅ **Expected Result**: 4 policies created for the avatars bucket

---

### Step 5: Enable Realtime (Already done in migration!)

The migration script already enabled Realtime for the notifications table via:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

No additional action needed! ✅

---

### Step 6: Verify Setup

1. Go to **SQL Editor**
2. Run this verification query:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('notifications', 'user_profiles');

-- Check policies
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('notifications', 'user_profiles')
ORDER BY tablename, policyname;
```

✅ **Expected Result**: 
- 2 tables shown
- 7 policies shown (4 for notifications, 3 for user_profiles)

---

### Step 7: Test the Application

1. Open your terminal
2. Run: `npm run dev`
3. Open: http://localhost:5173
4. Test each feature:
   - **Password Reset**: Login modal → "Recover?" link
   - **Profile Edit**: Profile page → "Edit Bio" button
   - **Notifications**: Top bar → Bell icon

---

## ✅ Completion Checklist

- [ ] Database migration executed successfully
- [ ] Storage bucket "avatars" created (public)
- [ ] 4 storage policies created
- [ ] Verification query shows 2 tables
- [ ] Verification query shows 7 policies
- [ ] Application runs without errors
- [ ] Password reset sends email
- [ ] Profile edit saves to database
- [ ] Notifications appear in bell icon

---

## 🎉 Success!

Once all checkboxes are complete, Phase 1 Core Functionality is **fully deployed**!

You can now:
- Reset passwords via email
- Edit user profiles with avatar uploads
- Receive real-time notifications

**Next**: Move to Phase 2 implementation or test thoroughly!
