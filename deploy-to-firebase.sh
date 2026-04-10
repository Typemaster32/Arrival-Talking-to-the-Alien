#!/bin/bash
# Deploy Arrival Chat to Firebase

set -e

echo "🚀 Preparing deployment to Firebase..."

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Copy frontend files to public directory
echo "📦 Copying frontend files to public/..."
rm -rf public/*
cp index.html public/
cp style.css public/
cp sketch.js public/
cp p5.js public/
cp p5.sound.min.js public/
cp -r modules public/

# Install function dependencies
echo "📦 Installing function dependencies..."
cd functions
npm install
cd ..

# Check if logged in
echo "🔐 Checking Firebase login status..."
firebase login || firebase login

# Check project setup
if grep -q "your-project-id" .firebaserc; then
    echo "⚠️  Please update .firebaserc with your Firebase project ID"
    echo "   Run: firebase projects:list"
    exit 1
fi

# Deploy functions first
echo "☁️  Deploying Functions..."
firebase deploy --only functions

# Set secrets (if not already set)
echo "🔑 Checking secrets..."
firebase functions:secrets:get DEEPSEEK_API_KEY 2>/dev/null || echo "⚠️  Set DEEPSEEK_API_KEY with: firebase functions:secrets:set DEEPSEEK_API_KEY"
firebase functions:secrets:get OPENAI_API_KEY 2>/dev/null || echo "⚠️  Set OPENAI_API_KEY with: firebase functions:secrets:set OPENAI_API_KEY"

# Deploy hosting
echo "🌐 Deploying Hosting..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Set your API keys in Firebase Secret Manager:"
echo "      firebase functions:secrets:set DEEPSEEK_API_KEY"
echo "      firebase functions:secrets:set OPENAI_API_KEY"
echo "   2. Visit your deployed site at the URL shown above"
