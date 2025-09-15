
# AI Pantone Color Generator

An ultrachic, ultraminimal design website for creatives featuring an AI-powered search bar that generates perfect Pantone color swatches from any prompt.

## Features

- **Real AI-Powered Color Generation**: Uses OpenAI GPT-3.5 to generate intelligent Pantone colors from any text prompt
- **Ultrachic Minimal Design**: Clean, sophisticated interface with smooth animations
- **Comprehensive Color Database**: Curated collection of authentic Pantone colors with fallback system
- **Real-time Color Display**: Beautiful color swatch with hex, RGB, and Pantone code information
- **Responsive Design**: Optimized for all devices
- **Vercel Ready**: Pre-configured for seamless deployment

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Framer Motion** for smooth animations
- **Tailwind CSS** for styling
- **Radix UI** components for accessibility
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ireallyneedacolorswatch
```

2. Install dependencies:
```bash
npm install
```

3. Set up your OpenAI API key:
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a `.env` file in the root directory:
   ```bash
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

## Deployment

This project is pre-configured for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

The project includes:
- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to exclude from deployment
- Optimized build settings for Vercel

## How It Works

1. **AI Analysis**: Your text prompt is sent to OpenAI GPT-3.5 for intelligent analysis
2. **Color Generation**: The AI generates a unique Pantone color with custom name and reasoning
3. **Fallback System**: If AI is unavailable, falls back to curated color database
4. **Color Display**: Shows a beautiful color swatch with all relevant color information
5. **Background Animation**: The entire page background transitions to your generated color

## Color Categories

The AI understands prompts related to:
- **Emotions**: happiness, joy, calm, peace, energy, passion
- **Nature**: ocean, sky, forest, sunset, sunrise, earth
- **Seasons**: spring, summer, autumn, winter
- **Abstract Concepts**: innovation, creativity, minimal, bold, luxury, modern

## Original Design

This project is based on the original Figma design: [AI Pantone Color Generator](https://www.figma.com/design/8fRlf2bYj0FwUYMYZUbLiE/AI-Pantone-Color-Generator)

## License

Made with love for people who need colors by dord.
  