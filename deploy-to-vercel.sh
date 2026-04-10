#!/bin/bash
# Deploy Arrival Chat to Vercel + GitHub Pages

set -e

echo "🚀 Deploying Arrival Chat..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check environment variables
if [ -z "$DEEPSEEK_API_KEY" ]; then
    echo "⚠️  DEEPSEEK_API_KEY not set in environment"
    echo "   Set it with: export DEEPSEEK_API_KEY=sk-..."
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY not set (optional, for fallback)"
fi

# Check if logged in
echo "🔐 Checking Vercel login..."
vercel whoami || vercel login

# Deploy API to Vercel
echo "☁️  Deploying API to Vercel..."
vercel --prod --yes

# Get the deployed URL
VERCEL_URL=$(vercel --json | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
echo ""
echo "✅ API deployed to: https://$VERCEL_URL"
echo ""
echo "📝 Next steps for GitHub Pages:"
echo "   1. Update frontend API endpoint in modules/api/config.js"
echo "   2. Push to GitHub to trigger GitHub Pages deployment"
echo ""
echo "   Or run: ./deploy-frontend-gh.sh"
