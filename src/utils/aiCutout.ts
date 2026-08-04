import * as imgly from '@imgly/background-removal';

/**
 * Takes an uploaded File, processes it through the background removal ML model,
 * and returns a Blob URL representing the transparent image.
 */
export async function processFurnitureImage(file: File): Promise<string> {
  console.log('Starting AI background removal...');
  
  try {
    // The library automatically downloads the necessary ONNX ML models 
    // and WebAssembly files to process the image in the browser.
    // Ensure we handle both named export or default export from imgly
    const removeBg = typeof imgly === 'function' ? imgly : (imgly as any).removeBackground;
    const blob = await removeBg(file);
    console.log('AI processing complete!');
    
    // Create a local URL for the processed blob
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error in AI background removal:', error);
    throw error;
  }
}
