/**
 * UK Vehicle Registration Mark (VRM) Formatter & Validator
 * 
 * Supports formats:
 * - Current (Sept 2001+): LLNN LLL (e.g., AB51 CDE)
 * - Suffix (1983-2001): LLL NNNA (e.g., ABC 123D)
 * - Prefix (1963-1983): ANNN LLL (e.g., A123 ABC)
 * - Older formats and personalised plates
 */

// Common OCR misreads to correct
const OCR_CORRECTIONS: Record<string, string> = {
  'O': '0', // Letter O often read as zero in number positions
  'I': '1', // Letter I often read as one
  'S': '5', // S sometimes read as 5
  'B': '8', // B sometimes read as 8
  '0': 'O', // Zero often read as O in letter positions
  '1': 'I', // One often read as I in letter positions
  '5': 'S', // 5 sometimes read as S
  '8': 'B', // 8 sometimes read as B
};

// Characters that are NOT allowed on UK plates (to avoid confusion)
const EXCLUDED_LETTERS = ['I', 'O', 'Q', 'Z'];

// Regex patterns for different VRM formats
const VRM_PATTERNS = {
  // Current format: AB51 CDE (2 letters, 2 numbers, 3 letters)
  current: /^([A-Z]{2})(\d{2})([A-Z]{3})$/,
  
  // Suffix format: ABC 123D (3 letters, up to 3 numbers, 1 letter)
  suffix: /^([A-Z]{1,3})(\d{1,3})([A-Z])$/,
  
  // Prefix format: A123 ABC (1 letter, up to 3 numbers, 3 letters)
  prefix: /^([A-Z])(\d{1,3})([A-Z]{3})$/,
  
  // Dateless: AB 1234 or 1234 AB (various combinations)
  dateless1: /^([A-Z]{1,3})(\d{1,4})$/,
  dateless2: /^(\d{1,4})([A-Z]{1,3})$/,
  
  // Northern Ireland: ABC 1234 (3 letters, up to 4 numbers)
  niFormat: /^([A-Z]{1,3})(\d{1,4})$/,
};

/**
 * Normalizes a VRM string by removing spaces, converting to uppercase,
 * and cleaning up common OCR errors
 */
export function normalizeVrm(input: string): string {
  if (!input) return '';
  
  // Remove all spaces, hyphens, and special characters
  let normalized = input
    .toUpperCase()
    .replace(/[\s\-\.]/g, '')
    .replace(/[^A-Z0-9]/g, '');
  
  return normalized;
}

/**
 * Formats a VRM with proper spacing based on detected format
 */
export function formatVrm(input: string): string {
  const normalized = normalizeVrm(input);
  
  if (!normalized) return '';
  
  // Current format: AB51CDE -> AB51 CDE
  if (VRM_PATTERNS.current.test(normalized)) {
    return normalized.replace(VRM_PATTERNS.current, '$1$2 $3');
  }
  
  // Suffix format: ABC123D -> ABC 123D
  if (VRM_PATTERNS.suffix.test(normalized)) {
    return normalized.replace(VRM_PATTERNS.suffix, '$1 $2$3');
  }
  
  // Prefix format: A123ABC -> A123 ABC
  if (VRM_PATTERNS.prefix.test(normalized)) {
    return normalized.replace(VRM_PATTERNS.prefix, '$1$2 $3');
  }
  
  // For other formats, try to add space in the middle
  if (normalized.length >= 5) {
    const mid = Math.ceil(normalized.length / 2);
    return `${normalized.slice(0, mid)} ${normalized.slice(mid)}`;
  }
  
  return normalized;
}

/**
 * Validates if a string is a valid UK VRM format
 */
export function isValidVrm(input: string): boolean {
  const normalized = normalizeVrm(input);
  
  if (!normalized || normalized.length < 2 || normalized.length > 8) {
    return false;
  }
  
  // Check against all known patterns
  return (
    VRM_PATTERNS.current.test(normalized) ||
    VRM_PATTERNS.suffix.test(normalized) ||
    VRM_PATTERNS.prefix.test(normalized) ||
    VRM_PATTERNS.dateless1.test(normalized) ||
    VRM_PATTERNS.dateless2.test(normalized)
  );
}

/**
 * Attempts to correct common OCR errors in a VRM
 * Uses context-aware correction based on expected format
 */
export function correctOcrErrors(input: string): string {
  const normalized = normalizeVrm(input);
  
  if (!normalized) return '';
  
  // Try to detect the format and correct accordingly
  const chars = normalized.split('');
  
  // Current format: LLNNLLL - positions 0,1 are letters, 2,3 are numbers, 4,5,6 are letters
  if (chars.length === 7) {
    // First two should be letters
    if (/\d/.test(chars[0])) chars[0] = correctToLetter(chars[0]);
    if (/\d/.test(chars[1])) chars[1] = correctToLetter(chars[1]);
    
    // Next two should be numbers
    if (/[A-Z]/.test(chars[2])) chars[2] = correctToNumber(chars[2]);
    if (/[A-Z]/.test(chars[3])) chars[3] = correctToNumber(chars[3]);
    
    // Last three should be letters
    if (/\d/.test(chars[4])) chars[4] = correctToLetter(chars[4]);
    if (/\d/.test(chars[5])) chars[5] = correctToLetter(chars[5]);
    if (/\d/.test(chars[6])) chars[6] = correctToLetter(chars[6]);
  }
  
  return chars.join('');
}

function correctToLetter(char: string): string {
  const corrections: Record<string, string> = {
    '0': 'O',
    '1': 'I',
    '5': 'S',
    '8': 'B',
    '6': 'G',
    '4': 'A',
  };
  return corrections[char] || char;
}

function correctToNumber(char: string): string {
  const corrections: Record<string, string> = {
    'O': '0',
    'I': '1',
    'L': '1',
    'S': '5',
    'B': '8',
    'G': '6',
    'A': '4',
    'Z': '2',
  };
  return corrections[char] || char;
}

/**
 * Extracts potential VRM from OCR text that may contain other text
 */
export function extractVrmFromText(text: string): string | null {
  if (!text) return null;
  
  // Clean up the text
  const cleaned = text.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
  
  // Split into words and check each
  const words = cleaned.split(/\s+/);
  
  // First, try combining adjacent words (for "AB51 CDE" case)
  for (let i = 0; i < words.length - 1; i++) {
    const combined = words[i] + words[i + 1];
    const corrected = correctOcrErrors(combined);
    if (isValidVrm(corrected)) {
      return formatVrm(corrected);
    }
  }
  
  // Then try individual words that might be full VRMs
  for (const word of words) {
    const corrected = correctOcrErrors(word);
    if (isValidVrm(corrected)) {
      return formatVrm(corrected);
    }
  }
  
  // Try the entire text as one VRM (spaces removed)
  const fullText = normalizeVrm(cleaned);
  const correctedFull = correctOcrErrors(fullText);
  if (isValidVrm(correctedFull)) {
    return formatVrm(correctedFull);
  }
  
  // If nothing valid found, return the best guess (first 7-8 chars formatted)
  if (fullText.length >= 5) {
    const guess = fullText.slice(0, 7);
    return formatVrm(guess);
  }
  
  return null;
}

/**
 * Gets VRM info based on the format
 */
export function getVrmInfo(input: string): { format: string; valid: boolean; formatted: string } {
  const normalized = normalizeVrm(input);
  const formatted = formatVrm(input);
  
  if (VRM_PATTERNS.current.test(normalized)) {
    return { format: 'Current (2001+)', valid: true, formatted };
  }
  if (VRM_PATTERNS.suffix.test(normalized)) {
    return { format: 'Suffix (1983-2001)', valid: true, formatted };
  }
  if (VRM_PATTERNS.prefix.test(normalized)) {
    return { format: 'Prefix (1963-1983)', valid: true, formatted };
  }
  if (VRM_PATTERNS.dateless1.test(normalized) || VRM_PATTERNS.dateless2.test(normalized)) {
    return { format: 'Dateless/Personalised', valid: true, formatted };
  }
  
  return { format: 'Unknown', valid: false, formatted };
}
