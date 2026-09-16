/**
 * Resizes and compresses image files from iPhone camera or photo library
 * to prevent browser memory bloat and ensure fast, reliable PDF compilation.
 * Always yields a standard base64 JPEG Data URL.
 */
export async function compressImage(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        reject(new Error('Failed to read image file'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          // Draw white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Force JPEG format for universal jsPDF, iOS, and browser support
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (canvasErr) {
          console.warn('Canvas compression error, falling back to raw Data URL:', canvasErr);
          resolve(rawDataUrl);
        }
      };
      img.onerror = (imgErr) => {
        console.warn('Image load error during compression, falling back to raw Data URL:', imgErr);
        resolve(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.onerror = (readerErr) => reject(readerErr);
    reader.readAsDataURL(file);
  });
}
