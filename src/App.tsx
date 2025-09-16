import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { ColorSwatch } from './components/ColorSwatch';
import SearchBar from './components/SearchBar';
import { generatePantoneColorWithAI } from './utils/pantoneAI';
import logoColored from './assets/logo_transparent2.png';
import logoWhite from './assets/logo_white.png';
import logoDord from './assets/logo_dd_transparent.png';


export default function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedColor, setGeneratedColor] = useState<{
    color: string;
    pantoneCode: string;
    pantoneName: string;
    prompt: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [variationCount, setVariationCount] = useState(0);
  const [lastPrompt, setLastPrompt] = useState('');

  useEffect(() => {
    // Check for short URL hash to pre-load a color
    const hash = window.location.hash.substring(1); // Remove the # symbol
    
    if (hash) {
      try {
        const colorData = JSON.parse(atob(hash));
        if (colorData.c && colorData.n && colorData.p && colorData.t) {
          // Pre-load the shared color
          setGeneratedColor({
            color: colorData.c,
            pantoneCode: colorData.p,
            pantoneName: colorData.n,
            prompt: colorData.t,
          });
        }
      } catch (error) {
        // Fallback to old URL parameter format
        const urlParams = new URLSearchParams(window.location.search);
        const colorParam = urlParams.get('color');
        const nameParam = urlParams.get('name');
        const codeParam = urlParams.get('code');
        const promptParam = urlParams.get('prompt');

        if (colorParam && nameParam && codeParam && promptParam) {
          setGeneratedColor({
            color: colorParam,
            pantoneCode: codeParam,
            pantoneName: nameParam,
            prompt: promptParam,
          });
        }
      }
    }

    // Trigger the welcome animation sequence
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = async (inputValue: string) => {
    if (!inputValue.trim()) return;
    
    setIsGenerating(true);
    setPrompt(inputValue);
    
    // Check if this is the same prompt as last time
    const isSamePrompt = inputValue.trim().toLowerCase() === lastPrompt.toLowerCase();
    const currentVariation = isSamePrompt ? variationCount + 1 : 0;
    
    try {
      const pantoneColor = await generatePantoneColorWithAI(inputValue, currentVariation);
      setGeneratedColor({
        color: pantoneColor.hex,
        pantoneCode: pantoneColor.code,
        pantoneName: pantoneColor.name,
        prompt: inputValue.trim(),
      });
      
      // Update variation tracking
      if (isSamePrompt) {
        setVariationCount(currentVariation);
      } else {
        setVariationCount(0);
        setLastPrompt(inputValue.trim().toLowerCase());
      }
    } catch (error) {
      console.error('Error generating color:', error);
      alert('Failed to generate color. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className="h-screen flex flex-col items-center px-6 py-8 transition-colors duration-1000 overflow-hidden"
      style={{ 
        backgroundColor: generatedColor ? generatedColor.color : 'var(--background)' 
      }}
    >
      {/* Centered Content Container */}
        <div className="flex-1 flex flex-col items-center justify-center w-full -mt-8 sm:mt-0">
        {/* Header */}
        <motion.div 
          className="text-center mb-4 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: hasLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-2 sm:mb-8" style={{ marginLeft: '10px' }}>
            <motion.img 
              src={generatedColor ? logoWhite : logoColored} 
              alt="i really need a color swatch"
              className={`w-auto max-w-full h-auto transition-all duration-700 sm:max-w-md ${generatedColor ? 'cursor-pointer hover:opacity-80' : ''}`}
              style={{
                maxHeight: generatedColor ? "120px" : "240px",
                width: "auto",
                height: "auto"
              }}
              initial={{ opacity: 0, scale: 0.8, y: -30 }}
              animate={{ 
                opacity: hasLoaded ? 1 : 0,
                scale: hasLoaded ? 1 : 0.8,
                y: hasLoaded ? 0 : -30
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.4 },
                scale: { duration: 0.8, delay: 0.4, ease: "easeOut" },
                y: { duration: 0.8, delay: 0.4, ease: "easeOut" }
              }}
              onClick={generatedColor ? () => {
                setGeneratedColor(null);
                setPrompt('');
              } : undefined}
            />
          </div>
        </motion.div>

        {/* Search Interface */}
        <motion.div 
          className="w-full mb-0 sm:mb-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: hasLoaded ? 1 : 0, 
            y: hasLoaded ? 0 : 30 
          }}
          transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
        >
          <SearchBar onSubmit={handleGenerate} isLoading={isGenerating} />
          
          {/* Loading State - directly under input */}
          {isGenerating && (
            <motion.div 
              className="flex flex-col items-center gap-3 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: generatedColor 
                        ? (generatedColor.color === '#FFFFFF' || generatedColor.color === '#F7F7F7' ? '#000000' : '#FFFFFF')
                        : '#000000'
                    }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
              <p 
                className="text-xs"
                style={{ 
                  color: generatedColor 
                    ? (generatedColor.color === '#FFFFFF' || generatedColor.color === '#F7F7F7' ? '#000000' : '#FFFFFF')
                    : '#000000' 
                }}
              >
                fetching your color!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Generated Color Display */}
      {generatedColor && !isGenerating && (
        <ColorSwatch
          color={generatedColor.color}
          pantoneCode={generatedColor.pantoneCode}
          pantoneName={generatedColor.pantoneName}
          prompt={generatedColor.prompt}
        />
      )}

      {/* Footer */}
      {!generatedColor && (
        <motion.footer 
          className="mt-auto text-center space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: hasLoaded ? 1 : 0,
            y: hasLoaded ? 0 : 20
          }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <a 
            href="https://dordworld.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 transition-opacity duration-1000 hover:opacity-80"
          >
            <span 
              className="text-xs"
              style={{ 
                color: generatedColor 
                  ? (generatedColor.color === '#FFFFFF' || generatedColor.color === '#F7F7F7' ? '#000000' : '#FFFFFF')
                  : '#999999' 
              }}
            >
              by
            </span>
            <img 
              src={logoDord} 
              alt="dord"
              className="h-12 w-auto"
            />
          </a>
        </motion.footer>
      )}
      <Analytics />
    </div>
  );
}