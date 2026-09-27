# Phase 1 Core Functionality - Quick Reference

## 🚀 Quick Setup (5 minutes)

### 1. Database Migration
```bash
# Open Supabase Dashboard → SQL Editor
# Copy and run: supabase/migrations/001_phase1_core_functionality.sql
```

### 2. Storage Bucket
```bash
# Supabase Dashboard → Storage → Create Bucket
# Name: avatars
# Public: ✅ Yes
# Then run: supabase/migrations/002_storage_avatars.sql
```

### 3. Enable Realtime
```bash
# Supabase Dashboard → Database → Replication
# Enable for: notifications table
```

### 4. Test
```bash
npm run dev
# Test password reset, profile edit, and notifications
```

---

## ✨ Features Included

### 🔐 Password Recovery
- Email-based password reset
- Secure token generation
- Beautiful UI with animations
- **Access:** Login Modal → "Recover?" link

### 👤 Profile Management
- Avatar upload (2MB limit)
- Username & display name
- Bio (500 chars)
- Social links (GitHub, Twitter, Website)
- **Access:** Profile Page → "Edit Bio" button

### 🔔 Real-time Notifications
- Live updates without refresh
- Unread count badge
- Mark as read/delete
- Clear all functionality
- **Access:** Top bar → Bell icon

---

## 📁 Key Files

### Frontend (Already Complete ✅)
- `src/components/auth/PasswordResetModal.tsx`
- `src/components/profile/ProfileEditModal.tsx`
- `src/contexts/NotificationContext.tsx`

### Database (Ready to Execute ⏳)
- `supabase/migrations/001_phase1_core_functionality.sql`
- `supabase/migrations/002_storage_avatars.sql`
- `supabase/test_phase1.sql` (verification)

### Documentation
- `supabase/SETUP_GUIDE.md` (detailed instructions)
- `README_PHASE1.md` (this file)

---

## 🧪 Testing Checklist

- [ ] Password reset email received
- [ ] Avatar upload works (<2MB)
- [ ] Profile updates persist
- [ ] Notifications appear in real-time
- [ ] Unread count updates correctly
- [ ] Mark as read works
- [ ] Delete notification works
- [ ] Clear all works

---

## 🔧 Troubleshooting

**"relation does not exist"**
→ Run migration script in Supabase SQL Editor

**Avatar upload fails**
→ Check Storage bucket exists and is public

**Notifications don't appear**
→ Enable Realtime for notifications table

**Permission denied errors**
→ Verify RLS policies are set correctly

---

## 📊 Database Schema

### notifications
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to auth.users
- `type` (TEXT) - 'achievement', 'social', 'system', 'quest'
- `title` (TEXT) - Notification title
- `message` (TEXT) - Notification message
- `read` (BOOLEAN) - Read status
- `data` (JSONB) - Additional metadata
- `created_at` (TIMESTAMPTZ) - Creation timestamp

### user_profiles
- `id` (UUID) - Primary key, foreign key to auth.users
- `username` (TEXT) - Unique username
- `display_name` (TEXT) - Display name
- `bio` (TEXT) - User bio
- `avatar_url` (TEXT) - Avatar image URL
- `social_links` (JSONB) - Social media links
- `is_public` (BOOLEAN) - Profile visibility
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

---

## 🎯 Next Steps

1. ✅ Review this guide
2. ⏳ Execute database migration
3. ⏳ Create storage bucket
4. ⏳ Enable Realtime
5. ⏳ Test all features
6. ✅ Move to Phase 2!

---

## 📞 Support

For detailed setup instructions, see: `supabase/SETUP_GUIDE.md`

For implementation details, see: 
- `implementation_plan.md` (in artifacts)
- `walkthrough.md` (in artifacts)
