const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  res.json({
    status: 'ok',
    apiKeyPresent: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/generate-color', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check if prompt contains "dord" - return special pastel colors
    if (prompt.toLowerCase().includes('dord')) {
      const pastelColors = [
        '#FFB6C1', // Light Pink
        '#FFC0CB', // Pink
        '#FFCCCB', // Light Pink
        '#F0E68C', // Khaki
        '#98FB98', // Pale Green
        '#AFEEEE', // Pale Turquoise
        '#E0FFFF', // Light Cyan
        '#F5DEB3', // Wheat
        '#DDA0DD', // Plum
        '#B0E0E6', // Powder Blue
        '#F0F8FF', // Alice Blue
        '#F5F5DC', // Beige
        '#FFEFD5', // Papaya Whip
        '#FFF8DC', // Cornsilk
        '#E6E6FA', // Lavender
        '#FDF5E6', // Old Lace
        '#FFE4E1', // Misty Rose
        '#F0FFF0', // Honeydew
        '#FFF0F5', // Lavender Blush
        '#F5FFFA'  // Mint Cream
      ];
      
      const randomPastel = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      const pantoneCode = `PANTONE ${Math.floor(Math.random() * 9000) + 1000} TPX`;
      const colorName = prompt; // Preserve exact case from prompt

      return res.status(200).json({
        hex: randomPastel,
        name: colorName,
        code: pantoneCode,
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a creative color generator. Generate unexpected, inventive colors that capture the essence of the prompt in surprising ways. Think beyond the obvious - if someone says "sunset", don\'t just give orange/red, think of the unexpected colors that make sunsets magical. If they explicitly ask for a specific color (like "blue" or "red"), give them that color. Always output exactly one HEX color code (#RRGGBB). No text, no quotes, no explanation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 10,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const hexColor = data.choices[0].message.content.trim();
    
    // Validate hex color with regex guard
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexRegex.test(hexColor)) {
      throw new Error('Invalid hex color format received from AI');
    }
    
    // Generate Pantone code and color name
    const pantoneCode = `PANTONE ${Math.floor(Math.random() * 9000) + 1000} TPX`;
    const colorName = prompt; // Preserve exact case from prompt
    
    res.status(200).json({
      hex: hexColor,
      name: colorName,
      code: pantoneCode,
    });

  } catch (error) {
    console.error('Error generating color:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate color',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
