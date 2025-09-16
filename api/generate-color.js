export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
            content: 'You are a color generator. Always output exactly one HEX color code (#RRGGBB). No text, no quotes, no explanation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 10,
        temperature: 0.7,
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
    res.status(500).json({ error: 'Failed to generate color' });
  }
}
