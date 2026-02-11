/**
 * VRM Scanner Composable
 * Uses Capacitor bridge globals for Camera + OCR (native plugins can't be ES-imported in static builds)
 */

import { extractVrmFromText, formatVrm, isValidVrm } from '~/utils/vrmFormatter';

interface ScanResult {
  success: boolean;
  vrm?: string;
  rawText?: string;
  error?: string;
}

// Access Capacitor plugins through the bridge global
const getCapacitorPlugin = (name: string): any => {
  if (typeof window === 'undefined') return null;
  const cap = (window as any).Capacitor;
  if (!cap) return null;
  return cap.Plugins?.[name] || null;
};

export const useVrmScanner = () => {
  const isScanning = ref(false);
  const scanError = ref<string | null>(null);
  const isAvailable = ref(false);

  // Check if scanning is available (native app context)
  const checkAvailability = async (): Promise<boolean> => {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        isAvailable.value = true;
        return true;
      }
      isAvailable.value = false;
      return false;
    } catch {
      isAvailable.value = false;
      return false;
    }
  };

  // Process OCR on an image (file URI or data URL)
  const processOcr = async (imageData: string): Promise<ScanResult> => {
    try {
      const OcrPlugin = getCapacitorPlugin('Ocr');
      if (!OcrPlugin) {
        return { success: false, error: 'OCR plugin not available on this device.' };
      }

      const result = await OcrPlugin.process({ image: imageData });
      console.log(JSON.stringify(result));

      if (!result.results || result.results.length === 0) {
        return {
          success: false,
          error: 'No text detected in image. Please try again with a clearer view of the registration plate.'
        };
      }

      // Combine all recognized text
      const allText = result.results.map((r: any) => r.text).join(' ');

      // Extract VRM from recognized text
      const vrm = extractVrmFromText(allText);

      if (vrm && isValidVrm(vrm)) {
        return {
          success: true,
          vrm: formatVrm(vrm),
          rawText: allText
        };
      }

      // Even if not a perfect match, return cleaned text as best guess
      // so user can manually correct it in the input field
      if (vrm) {
        return {
          success: true,
          vrm: vrm,
          rawText: allText
        };
      }

      // Last resort: clean up raw text and return it
      const cleaned = allText.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
      if (cleaned.length >= 4) {
        return {
          success: true,
          vrm: cleaned,
          rawText: allText
        };
      }

      return {
        success: false,
        rawText: allText,
        error: `Could not detect text. Please try again with a clearer, straight-on photo of the plate.`
      };
    } catch (err: any) {
      console.error('OCR processing error:', err);
      return {
        success: false,
        error: `OCR error: ${err?.message || err || 'Unknown error'}`
      };
    }
  };

  // Scan VRM from camera
  const scanVrm = async (): Promise<ScanResult> => {
    isScanning.value = true;
    scanError.value = null;

    try {
      const CameraPlugin = getCapacitorPlugin('Camera');
      if (!CameraPlugin) {
        return { success: false, error: 'Camera not available on this device.' };
      }

      const photo = await CameraPlugin.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: 'uri',
        source: 'CAMERA',
        width: 1280,
        height: 720,
        correctOrientation: true
      });

      // Use the real file path for OCR (not webPath which is a Capacitor proxy URL)
      const imageUri = photo.path;
      if (!imageUri) {
        throw new Error('No image path returned from camera');
      }

      return await processOcr(imageUri);

    } catch (err: any) {
      console.error('VRM scan error:', err);
      
      // Handle user cancellation
      if (err.message?.includes('User cancelled') || err.message?.includes('cancelled')) {
        return { success: false, error: 'Scan cancelled' };
      }
      
      if (err.message?.includes('not implemented') || err.message?.includes('not available')) {
        return { success: false, error: 'Camera not available. Please enter registration manually.' };
      }

      // Show real error for debugging
      return {
        success: false,
        error: `Camera error: ${err?.message || err || 'Unknown error'}`
      };
    } finally {
      isScanning.value = false;
    }
  };

  // Alternative: Pick from gallery
  const scanFromGallery = async (): Promise<ScanResult> => {
    isScanning.value = true;
    scanError.value = null;

    try {
      const CameraPlugin = getCapacitorPlugin('Camera');
      if (!CameraPlugin) {
        return { success: false, error: 'Camera not available on this device.' };
      }

      const photo = await CameraPlugin.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: 'uri',
        source: 'PHOTOS'
      });

      const imageUri = photo.path;
      if (!imageUri) {
        throw new Error('No image path returned');
      }

      return await processOcr(imageUri);

    } catch (err: any) {
      console.error('Gallery scan error:', err);
      return {
        success: false,
        error: `Gallery error: ${err?.message || err || 'Unknown error'}`
      };
    } finally {
      isScanning.value = false;
    }
  };

  return {
    isScanning,
    scanError,
    isAvailable,
    checkAvailability,
    scanVrm,
    scanFromGallery
  };
};
