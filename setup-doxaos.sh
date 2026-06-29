#!/bin/bash

# DoxaOS Setup Helper
# Run this after you have DATABASE_URL, SUPABASE_URL, and API keys

set -e

echo "🚀 DoxaOS Setup Helper"
echo "====================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable not set"
    echo ""
    echo "Before running this script, set:"
    echo "  export DATABASE_URL=\"postgresql://postgres:PASSWORD@HOST:5432/postgres\""
    echo ""
    echo "Get this from Supabase → Settings → Database → Connection String (Prisma)"
    exit 1
fi

echo "✓ DATABASE_URL is set"
echo ""

# Test database connection
echo "🔍 Testing database connection..."
if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
    echo "✓ Database connection successful"
else
    echo "❌ Cannot connect to database"
    echo "Check your DATABASE_URL is correct"
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
npm install @prisma/client prisma --save > /dev/null 2>&1
echo "✓ Dependencies installed"

echo ""
echo "🗄️  Running Prisma migrations..."
npx prisma migrate deploy
echo "✓ Migrations complete"

echo ""
echo "🔐 Applying RLS security policies..."
psql "$DATABASE_URL" -f prisma/rls-policies.sql > /dev/null 2>&1
echo "✓ RLS policies applied"

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Go to Supabase Dashboard → Authentication → URL Configuration"
echo "2. Add redirect URLs:"
echo "   - https://doxaandco.co"
echo "   - https://doxaandco.co/**"
echo "   - https://doxaandco.co/auth/callback"
echo ""
echo "3. Go to Netlify → Settings → Environment Variables"
echo "4. Add these env vars:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - DATABASE_URL"
echo ""
echo "5. Deploy: git push origin main"
echo ""
echo "Then test at: https://doxaandco.co"
