import { motion } from 'motion/react';
import { Share2, Download } from 'lucide-react';

interface ColorSwatchProps {
  color: string;
  pantoneCode: string;
  pantoneName: string;
  prompt: string;
}

export function ColorSwatch({ color, pantoneCode, pantoneName, prompt }: ColorSwatchProps) {
  // Create a super short URL using base64 encoding
  const colorData = btoa(JSON.stringify({
    c: color,
    n: pantoneName,
    p: pantoneCode,
    t: prompt
  }));
  const shareUrl = `${window.location.origin}/#${colorData}`;
  const shareText = `Check out this perfect color: ${pantoneName} (${color}) - from ireallyneedacolorswatch.com\n\n${shareUrl}`;

  // Generate PNG of the color swatch
  const generateColorPNG = async (isMobile = false): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Get device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const scaleFactor = 4; // High quality scaling

    // Set canvas size - 9:16 for mobile, square for desktop (ultra high resolution)
    if (isMobile) {
      canvas.width = 1080 * scaleFactor; // 4320px
      canvas.height = 1920 * scaleFactor; // 7680px
    } else {
      canvas.width = 1080 * scaleFactor; // 4320px
      canvas.height = 1080 * scaleFactor; // 4320px
    }

    // Scale the context to match the device pixel ratio
    ctx.scale(scaleFactor, scaleFactor);

    // Fill background with the color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text overlay with proper wrapping
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Helper function to wrap text
    const wrapText = (text: string, maxWidth: number, fontSize: number) => {
      ctx.font = `${fontSize}px Arial`;
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    // Add color name with wrapping (ultra high resolution) - preserve original case
    ctx.font = 'bold 48px Arial'; // Base font size (will be scaled by context)
    const nameLines = wrapText(pantoneName, 1080 - 100, 48); // Base dimensions
    const centerY = (isMobile ? 1920 : 1080) / 2;
    nameLines.forEach((line, index) => {
      ctx.fillText(line, 1080 / 2, centerY - 60 + (index * 60)); // Base spacing
    });
    
    // Add hex code (ultra high resolution) - uppercase
    ctx.font = '36px Arial'; // Base font size
    ctx.fillText(color.toUpperCase(), 1080 / 2, centerY + 40); // Base spacing
    
    // Add color code (without Pantone branding) (ultra high resolution) - uppercase
    ctx.font = '24px Arial'; // Base font size
    ctx.fillText(pantoneCode.replace('PANTONE ', ''), 1080 / 2, centerY + 100); // Base spacing
    
    // Add website attribution - centered for mobile, bottom for desktop (ultra high resolution) - lowercase
    ctx.font = '20px Arial'; // Base font size
    if (isMobile) {
      ctx.fillText('i really need a color swatch', 1080 / 2, centerY + 200); // Base spacing
    } else {
      ctx.fillText('i really need a color swatch', 1080 / 2, 1080 - 100); // Base spacing
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/png');
    });
  };

  // Detect if user is on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleShare = async () => {
    try {
      const pngBlob = await generateColorPNG(isMobile);
      const file = new File([pngBlob], `${pantoneName.replace(/\s+/g, '_')}_color_swatch.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        // Native share with image
        await navigator.share({
          title: `${pantoneName} - Perfect Color`,
          text: shareText,
          files: [file]
        });
      } else if (navigator.share) {
        // Native share without image (fallback)
        await navigator.share({
          title: `${pantoneName} - Perfect Color`,
          text: shareText,
          url: shareUrl
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Shareable link copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
      // Fallback: copy link
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Shareable link copied to clipboard!');
      } catch (clipboardErr) {
        console.log('Clipboard not available:', clipboardErr);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const pngBlob = await generateColorPNG(isMobile);
      const url = URL.createObjectURL(pngBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pantoneName.replace(/\s+/g, '_')}_color_swatch_${isMobile ? 'mobile' : 'desktop'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log('Error downloading:', err);
    }
  };
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="flex flex-col items-center gap-4 mt-4"
    >
      {/* Color Card */}
      <motion.div 
        className="bg-white border-2 border-black rounded-lg overflow-hidden"
        style={{ width: '300px' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
      >
        {/* Color Block - Perfect Square */}
        <div 
          style={{ 
            width: '300px', 
            height: '300px',
            backgroundColor: color 
          }}
        />
        
        {/* Color Information Panel */}
        <div className="bg-white p-3 space-y-2">
          {/* Color Name */}
          <div className="space-y-1">
            <h3 className="text-base font-medium text-black">
              {pantoneName}
            </h3>
            <p className="text-xs text-black font-mono uppercase tracking-wide">
              {pantoneCode.replace('PANTONE ', '')}
            </p>
          </div>
          
          {/* Color Values */}
          <div className="space-y-1 pt-2 border-t-2 border-black">
            <div className="flex justify-between">
              <span className="text-xs font-medium text-black uppercase tracking-wide">
                HEX
              </span>
              <span className="text-xs font-mono text-black">
                {color.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-medium text-black uppercase tracking-wide">
                RGB
              </span>
              <span className="text-xs font-mono text-black">
                {(() => {
                  const hex = color.replace('#', '');
                  const r = parseInt(hex.substring(0, 2), 16);
                  const g = parseInt(hex.substring(2, 4), 16);
                  const b = parseInt(hex.substring(4, 6), 16);
                  return `${r}, ${g}, ${b}`;
                })()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Share and Download Buttons */}
      <motion.div 
        className="flex items-center gap-2 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black border-2 border-black rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Share</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black border-2 border-black rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Download</span>
        </button>
      </motion.div>

      {/* Inspiration Credit */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <p className="text-xs text-white opacity-80">
          inspired by "{prompt}"
        </p>
      </motion.div>
    </motion.div>
  );
}