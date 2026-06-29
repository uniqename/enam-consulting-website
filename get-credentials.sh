#!/bin/bash

# Interactive credential retriever for Supabase

echo "🔐 DoxaOS Credential Setup"
echo "=========================="
echo ""
echo "You have Supabase URL and anon key in .env.local"
echo "I need 2 more things to set up the database:"
echo ""

# Get SERVICE_ROLE_KEY
echo "1️⃣  SUPABASE_SERVICE_ROLE_KEY"
echo "   Location: Supabase Dashboard → Settings → API → Service Role (keys)"
echo "   Paste the 'Secret' key (starts with 'eyJh...'):"
read -r SERVICE_ROLE_KEY

if [ -z "$SERVICE_ROLE_KEY" ]; then
    echo "❌ Service role key is required"
    exit 1
fi

echo ""

# Get DATABASE_URL
echo "2️⃣  DATABASE_URL"
echo "   Location: Supabase Dashboard → Settings → Database → Connection String"
echo "   Select 'Prisma' mode and copy the URL"
echo "   (Format: postgresql://postgres:PASSWORD@HOST:5432/postgres)"
read -r DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is required"
    exit 1
fi

echo ""
echo "✓ Credentials received"
echo ""
echo "Testing database connection..."

# Test connection
if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
    echo "✓ Database connection successful"
else
    echo "⚠️  Could not connect to database"
    echo "Check your DATABASE_URL is correct"
fi

echo ""
echo "📝 Next steps:"
echo "   1. Add to Netlify environment variables:"
echo "      - SUPABASE_SERVICE_ROLE_KEY"
echo "      - DATABASE_URL"
echo ""
echo "   2. Run migrations:"
echo "      export DATABASE_URL=\"$DATABASE_URL\""
echo "      npm install @prisma/client prisma --save"
echo "      npx prisma migrate deploy"
echo ""
echo "   3. Apply RLS policies:"
echo "      psql \"\$DATABASE_URL\" -f prisma/rls-policies.sql"
echo ""
echo "Done! 🎉"
