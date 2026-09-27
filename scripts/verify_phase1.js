#!/usr/bin/env node

/**
 * Phase 1 Core Functionality - Frontend Verification Script
 * 
 * This script verifies that all Phase 1 frontend components are properly
 * integrated and ready for use once the database is set up.
 */

import { existsSync } from 'fs';
import { resolve } from 'path';

const REQUIRED_FILES = [
    // Components
    'src/components/auth/PasswordResetModal.tsx',
    'src/components/profile/ProfileEditModal.tsx',
    'src/contexts/NotificationContext.tsx',

    // Integration points
    'src/components/auth/LoginModal.tsx',
    'src/pages/Profile.tsx',
    'src/components/layout/OSTopBar.tsx',
    'src/App.tsx',

    // Database scripts
    'supabase/migrations/001_phase1_core_functionality.sql',
    'supabase/migrations/002_storage_avatars.sql',
    'supabase/schema.sql',

    // Documentation
    'supabase/SETUP_GUIDE.md',
    'README_PHASE1.md',
];

const REQUIRED_IMPORTS = [
    {
        file: 'src/components/auth/LoginModal.tsx',
        imports: ['PasswordResetModal'],
    },
    {
        file: 'src/pages/Profile.tsx',
        imports: ['ProfileEditModal'],
    },
    {
        file: 'src/components/layout/OSTopBar.tsx',
        imports: ['useNotifications'],
    },
    {
        file: 'src/App.tsx',
        imports: ['NotificationProvider'],
    },
];

console.log('🔍 Phase 1 Core Functionality - Frontend Verification\n');

let allPassed = true;

// Check if all required files exist
console.log('📁 Checking required files...');
REQUIRED_FILES.forEach((file) => {
    const filePath = resolve(process.cwd(), file);
    const exists = existsSync(filePath);

    if (exists) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - MISSING`);
        allPassed = false;
    }
});

console.log('\n📦 Checking component integrations...');
REQUIRED_IMPORTS.forEach(({ file, imports }) => {
    const filePath = resolve(process.cwd(), file);

    if (existsSync(filePath)) {
        const fs = require('fs');
        const content = fs.readFileSync(filePath, 'utf-8');

        imports.forEach((importName) => {
            if (content.includes(importName)) {
                console.log(`  ✅ ${file} imports ${importName}`);
            } else {
                console.log(`  ❌ ${file} missing import: ${importName}`);
                allPassed = false;
            }
        });
    }
});

console.log('\n' + '='.repeat(60));

if (allPassed) {
    console.log('✅ All Phase 1 frontend components verified!');
    console.log('\n📋 Next Steps:');
    console.log('  1. Run database migration in Supabase Dashboard');
    console.log('  2. Create avatars storage bucket');
    console.log('  3. Enable Realtime for notifications table');
    console.log('  4. Test features in the application');
    console.log('\n📖 See SETUP_GUIDE.md for detailed instructions');
    process.exit(0);
} else {
    console.log('❌ Some components are missing or not integrated');
    console.log('\n⚠️  Please review the errors above');
    process.exit(1);
}
