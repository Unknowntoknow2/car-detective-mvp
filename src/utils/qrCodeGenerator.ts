// QR Code Generation Utility
export async function generateQRCode(text: string): Promise<string> {
  try {
    // Simple SVG QR code placeholder - in production, use a proper QR library
    const size = 200;
    const modules = 21; // Standard QR code size
    const moduleSize = size / modules;
    
    // Generate a simple pattern based on text hash
    const hash = text.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    svg += `<rect width="${size}" height="${size}" fill="white"/>`;
    
    // Generate a pattern
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        const shouldFill = (row + col + hash) % 3 === 0;
        if (shouldFill) {
          const x = col * moduleSize;
          const y = row * moduleSize;
          svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
        }
      }
    }
    
    svg += '</svg>';
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch (error) {
    return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#f0f0f0"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-size="12">QR Error</text></svg>')}`;
  }
}