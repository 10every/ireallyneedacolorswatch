#!/bin/bash

echo "🎨 AI Pantone Color Generator Setup"
echo "=================================="
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ .env file already exists"
else
    echo "📝 Creating .env file..."
    echo "VITE_OPENAI_API_KEY=your_openai_api_key_here" > .env
    echo "✅ .env file created"
fi

echo ""
echo "🔑 Next steps:"
echo "1. Get your OpenAI API key from: https://platform.openai.com/api-keys"
echo "2. Replace 'your_openai_api_key_here' in the .env file with your actual API key"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "💡 The app will work without an API key (using fallback colors), but for real AI generation, you'll need the key!"
