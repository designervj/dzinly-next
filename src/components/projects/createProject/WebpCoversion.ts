export async function convertToWebP(file: File): Promise<File> {
  const TARGET_WIDTH = 1400;
  const TARGET_HEIGHT = 750;
  const QUALITY = 0.8; // 0–1

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context not available"));

        // Optional: background (helps for transparent PNGs)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

        // scale to FIT inside 1400x750 (no distortion)
        const scale = Math.min(
          TARGET_WIDTH / img.width,
          TARGET_HEIGHT / img.height
        );

        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;

        // center the image in the 1400x750 box
        const offsetX = (TARGET_WIDTH - drawWidth) / 2;
        const offsetY = (TARGET_HEIGHT - drawHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Failed to create WebP blob"));
            }

            const webpFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, ".webp"),
              { type: "image/webp" }
            );

            // ✅ This file will show as 1400 × 750 in Finder/Explorer/etc.
            resolve(webpFile);
          },
          "image/webp",
          QUALITY
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
    };
  });
}
