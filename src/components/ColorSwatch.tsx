import { motion } from 'motion/react';
import { Share2, Download } from 'lucide-react';

interface ColorSwatchProps {
  color: string;
  pantoneCode: string;
  pantoneName: string;
  prompt: string;
}

export function ColorSwatch({ color, pantoneCode, pantoneName, prompt }: ColorSwatchProps) {
  const shareUrl = `${window.location.origin}?color=${encodeURIComponent(color)}&name=${encodeURIComponent(pantoneName)}&code=${encodeURIComponent(pantoneCode)}&prompt=${encodeURIComponent(prompt)}`;
  const shareText = `Check out this perfect color: ${pantoneName} (${color}) - from ireallyneedacolorswatch.com\n\n${shareUrl}`;

  // Generate PNG of the color swatch
  const generateColorPNG = async (isMobile = false): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Set canvas size - 9:16 for mobile, square for desktop
    if (isMobile) {
      canvas.width = 1080;
      canvas.height = 1920; // 9:16 aspect ratio
    } else {
      canvas.width = 1080;
      canvas.height = 1080; // Square for Instagram
    }

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

    // Add color name with wrapping
    ctx.font = 'bold 48px Arial';
    const nameLines = wrapText(pantoneName, canvas.width - 100, 48);
    const centerY = canvas.height / 2;
    nameLines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, centerY - 60 + (index * 60));
    });
    
    // Add hex code
    ctx.font = '36px Arial';
    ctx.fillText(color.toUpperCase(), canvas.width / 2, centerY + 40);
    
    // Add color code (without Pantone branding)
    ctx.font = '24px Arial';
    ctx.fillText(pantoneCode.replace('PANTONE ', ''), canvas.width / 2, centerY + 100);
    
    // Add website attribution - centered for mobile, bottom for desktop
    ctx.font = '20px Arial';
    if (isMobile) {
      ctx.fillText('i really need a color swatch', canvas.width / 2, centerY + 200);
    } else {
      ctx.fillText('i really need a color swatch', canvas.width / 2, canvas.height - 100);
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
      {/* Color Card - Matching Shareable Design */}
      <motion.div 
        className="relative border-2 border-black rounded-lg overflow-hidden"
        style={{ 
          width: '300px', 
          height: '300px',
          backgroundColor: color 
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
      >
        {/* Color Background */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: color }}
        />
        
        {/* Text Overlay - Centered like the shareable PNG */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
          {/* Color Name */}
          <h3 className="text-2xl font-bold mb-4 leading-tight">
            {pantoneName}
          </h3>
          
          {/* HEX Code */}
          <p className="text-lg font-mono mb-2">
            {color.toUpperCase()}
          </p>
          
          {/* Color Code (without Pantone branding) */}
          <p className="text-sm font-mono mb-8">
            {pantoneCode.replace('PANTONE ', '')}
          </p>
          
          {/* Website Attribution */}
          <p className="text-sm opacity-90">
            i really need a color swatch
          </p>
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