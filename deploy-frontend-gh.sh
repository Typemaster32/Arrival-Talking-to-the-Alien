#!/bin/bash
# Deploy frontend to GitHub Pages

set -e

echo "🌐 Preparing GitHub Pages deployment..."

# Check if we're in a git repo
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Please initialize first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Get Vercel URL
read -p "Enter your Vercel API URL (e.g., https://arrival-chat.vercel.app): " VERCEL_URL

if [ -z "$VERCEL_URL" ]; then
    echo "❌ Vercel URL is required"
    exit 1
fi

# Update API endpoint
echo "🔗 Updating API endpoint..."
sed -i.bak "s|endpoint: '/chatgpt'|endpoint: '${VERCEL_URL}/api/chat'|" modules/api/config.js
rm -f modules/api/config.js.bak

# Commit changes
echo "💾 Committing changes..."
git add .
git commit -m "Update API endpoint for GitHub Pages" || echo "No changes to commit"

# Push to trigger GitHub Actions
echo "📤 Pushing to GitHub..."
git push origin main || git push origin master

echo ""
echo "✅ Frontend deployment triggered!"
echo ""
echo "🌐 Your site will be available at:"
echo "   https://yi-jiaqi.github.io/arrival"
echo ""
echo "⏱️  Deployment may take 1-2 minutes..."
echo "   Check status at: https://github.com/YOUR_USERNAME/arrival/actions"
