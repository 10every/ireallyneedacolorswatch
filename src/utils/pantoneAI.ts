interface PantoneColor {
  code: string;
  name: string;
  hex: string;
}

// Simple GPT wrapper for color generation
export async function generatePantoneColorWithAI(prompt: string): Promise<PantoneColor> {
  const response = await fetch('/api/generate-color', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}