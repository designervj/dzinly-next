// canvasImageUtils.ts
// Utility functions for loading and adding images to a Fabric.js canvas with CORS and fetch strategies.
import * as fabric from "fabric";

// Type for fabric objects with custom properties
type NamedFabricObject = fabric.Object & {
  name?: string;
  isBackgroundImage?: boolean;
};

/**
 * Adds an HTMLImageElement to a Fabric.js canvas, scaling and centering it to fit.
 * @param imgElement The HTMLImageElement to add.
 * @param canvas The Fabric.js canvas instance.
 * @param width The width of the canvas.
 * @param height The height of the canvas.
 * @param backgroundImageRef Ref to store the fabric.Image instance.
 * @param onImageLoad Optional callback when image is loaded.
 */
export const AddImageToCanvas = (
  imgElement: HTMLImageElement,
  canvasRef: React.RefObject<fabric.Canvas>,
  width: number,
  height: number,
  backgroundImageRef: React.MutableRefObject<fabric.Image | null>,
  onImageLoad?: () => void
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const fabricImage = new fabric.Image(imgElement, {
    selectable: false,
    evented: false,
    excludeFromExport: false,
    // width: 800,
    // height: 600,
  });

  // Mark this as background image for identification
  (fabricImage as NamedFabricObject).name = "backgroundImage";
  (fabricImage as NamedFabricObject).isBackgroundImage = true;

  // Calculate scaling to fit the canvas (800x600) while maintaining aspect ratio
  const canvasWidth = canvas.width || width;   // 800
  const canvasHeight = canvas.height || height; // 600
  
  const imgAspect = imgElement.width / imgElement.height;
  const canvasAspect = canvasWidth / canvasHeight;
  
  let scale;
  if (imgAspect > canvasAspect) {
    // Image is wider than canvas ratio - scale by width
    scale = canvasWidth / imgElement.width;
  } else {
    // Image is taller than canvas ratio - scale by height  
    scale = canvasHeight / imgElement.height;
  }
  
  
  fabricImage.scale(scale);
  
  // Calculate scaled dimensions
  const scaledWidth = imgElement.width * scale;
  const scaledHeight = imgElement.height * scale;
  
  console.log("Scaled image size:", scaledWidth, "x", scaledHeight);
  
  fabricImage.set({
    left: (canvasWidth - scaledWidth) / 2,  // Center horizontally
    top: (canvasHeight - scaledHeight) / 2, // Center vertically
    originX: "left",
    originY: "top",
  });
  
  
  // Set as background image instead of adding as fabric object
  canvas.backgroundImage = fabricImage;
  
  // Apply the positioning and scaling to the background image
  fabricImage.set({
    // scaleX: scale,
    // scaleY: scale,
    left: (canvasWidth - scaledWidth) / 2,
    top: (canvasHeight - scaledHeight) / 2,
    // originX: "left",
    // originY: "top",

    // width: 800,
    // height: 600,
  });
  
  // Store reference
  backgroundImageRef.current = fabricImage;
  canvas.renderAll();

  // Call the onImageLoad callback if provided
  if (onImageLoad) {
    onImageLoad();
  }
};

/**
 * Loads an image using the HTMLImageElement with a specified CORS mode.
 * @param imageUrl The image URL.
 * @param corsMode The CORS mode ("anonymous", "use-credentials", or null).
 * @returns Promise resolving to an HTMLImageElement.
 */
export const LoadImageWithCORS = (
  imageUrl: string,
  corsMode: string | null = "anonymous"
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const imgElement = new window.Image();
    if (corsMode) {
      imgElement.crossOrigin = corsMode;
    }
    imgElement.onload = () => resolve(imgElement);
    imgElement.onerror = (error) => reject(error);
    imgElement.src = imageUrl;
  });
};

/**
 * Loads an image using fetch with a specified request mode, then creates an HTMLImageElement from the blob.
 * @param imageUrl The image URL.
 * @param fetchMode The fetch RequestMode ("cors", "no-cors", "same-origin").
 * @returns Promise resolving to an HTMLImageElement with fixed dimensions (1023x592).
 */
export const LoadImageWithFetch = async (
  imageUrl: string,
  fetchMode: RequestMode
): Promise<HTMLImageElement> => {
  try {
    const response = await fetch(imageUrl, {
      mode: fetchMode,
      credentials: "omit",
      cache: "no-cache",
      headers: {
        Accept: "image/*",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        imgElement.width = 800  ;
        imgElement.height = 600;
        URL.revokeObjectURL(objectUrl);
        resolve(imgElement);
      };
      imgElement.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to load image from blob"));
      };
      imgElement.src = objectUrl;
    });
  } catch (error) {
    throw new Error(`Fetch failed with mode ${fetchMode}: ${error}`);
  }
};


export const setBackgroundImage = (
  canvasRef: React.RefObject<fabric.Canvas>,
  url: string,
  backgroundImageRef: React.MutableRefObject<fabric.Image | null>,
  onLoading?: (loading: boolean) => void
) => {
  const canvas = canvasRef.current;
  if (!canvas) {
    if (onLoading) onLoading(false);
    return;
  }
  
  if (onLoading) onLoading(true);

  fabric.Image.fromURL(url, { crossOrigin: "anonymous" })
    .then((img: fabric.Image) => {
      if (!img) {
        if (onLoading) onLoading(false);
        return;
      }
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // Calculate scale to cover the entire canvas while maintaining aspect ratio
      const imgWidth = img.width || 1;
      const imgHeight = img.height || 1;
      const imgAspect = imgWidth / imgHeight;
      const canvasAspect = canvasWidth / canvasHeight;
      
      let scale;
      if (imgAspect > canvasAspect) {
        // Image is wider - scale by height to cover full canvas height
        scale = canvasHeight / imgHeight;
      } else {
        // Image is taller or same ratio - scale by width to cover full canvas width
        scale = canvasWidth / imgWidth;
      }
      
      // Calculate final dimensions
      const finalWidth = imgWidth * scale;
      const finalHeight = imgHeight * scale;
      
      // Center the image
      const left = (canvasWidth - finalWidth) / 2;
      const top = (canvasHeight - finalHeight) / 2;

      // Set background image properties
      img.set({
        scaleX: scale,
        scaleY: scale,
        left: left,
        top: top,
        originX: "left",
        originY: "top",
        selectable: false,
        evented: false,
      });

      // Set the image as canvas background
      canvas.backgroundImage = img;
      
      // Store reference
      backgroundImageRef.current = img;
      
      // Reset canvas zoom and position to show the full image properly
      canvas.setZoom(1);
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      
      canvas.renderAll();

      if (onLoading) onLoading(false);
    })
    .catch((error) => {
      console.error("Error loading background image:", error);
      if (onLoading) onLoading(false);
    });
}