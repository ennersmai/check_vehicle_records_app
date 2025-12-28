/**
 * VRM Scanner Composable
 * Uses Capacitor ML Kit Text Recognition for OCR scanning of UK vehicle registration plates
 */

import { extractVrmFromText, formatVrm, isValidVrm } from '~/utils/vrmFormatter';

interface ScanResult {
  success: boolean;
  vrm?: string;
  rawText?: string;
  error?: string;
}

export const useVrmScanner = () => {
  const isScanning = ref(false);
  const scanError = ref<string | null>(null);
  const isAvailable = ref(false);

  // Check if scanning is available (native app context)
  const checkAvailability = async (): Promise<boolean> => {
    try {
      const { TextRecognition } = await import('@capacitor-mlkit/text-recognition');
      isAvailable.value = true;
      return true;
    } catch {
      isAvailable.value = false;
      return false;
    }
  };

  // Scan VRM from camera
  const scanVrm = async (): Promise<ScanResult> => {
    isScanning.value = true;
    scanError.value = null;

    try {
      // First, capture image using Camera
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        width: 1280,
        height: 720,
        correctOrientation: true
      });

      if (!photo.base64String) {
        throw new Error('Failed to capture image');
      }

      // Process with ML Kit Text Recognition
      const { TextRecognition } = await import('@capacitor-mlkit/text-recognition');
      
      const result = await TextRecognition.recognizeText({
        image: photo.base64String
      });

      if (!result.text) {
        return {
          success: false,
          error: 'No text detected in image. Please try again with a clearer view of the registration plate.'
        };
      }

      // Extract VRM from recognized text
      const vrm = extractVrmFromText(result.text);

      if (vrm && isValidVrm(vrm)) {
        return {
          success: true,
          vrm: formatVrm(vrm),
          rawText: result.text
        };
      }

      // If we got text but couldn't extract a valid VRM
      return {
        success: false,
        rawText: result.text,
        error: 'Could not detect a valid UK registration number. Please try again or enter manually.'
      };

    } catch (err: any) {
      console.error('VRM scan error:', err);
      
      // Handle specific errors
      if (err.message?.includes('User cancelled')) {
        return {
          success: false,
          error: 'Scan cancelled'
        };
      }
      
      if (err.message?.includes('not implemented') || err.message?.includes('not available')) {
        return {
          success: false,
          error: 'Camera scanning is only available in the mobile app. Please enter the registration manually.'
        };
      }

      return {
        success: false,
        error: 'Failed to scan. Please try again or enter manually.'
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
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      if (!photo.base64String) {
        throw new Error('Failed to load image');
      }

      const { TextRecognition } = await import('@capacitor-mlkit/text-recognition');
      
      const result = await TextRecognition.recognizeText({
        image: photo.base64String
      });

      if (!result.text) {
        return {
          success: false,
          error: 'No text detected in image.'
        };
      }

      const vrm = extractVrmFromText(result.text);

      if (vrm && isValidVrm(vrm)) {
        return {
          success: true,
          vrm: formatVrm(vrm),
          rawText: result.text
        };
      }

      return {
        success: false,
        rawText: result.text,
        error: 'Could not detect a valid UK registration number.'
      };

    } catch (err: any) {
      console.error('Gallery scan error:', err);
      return {
        success: false,
        error: 'Failed to process image.'
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
