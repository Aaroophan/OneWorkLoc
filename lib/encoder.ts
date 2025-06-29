import { lzma } from 'lzma';

// Base62 encoding for URL-safe strings
const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function base62Encode(data: Uint8Array): string {
  let result = '';
  let num = BigInt(0);
  
  // Convert bytes to big integer
  for (let i = 0; i < data.length; i++) {
    num = (num << BigInt(8)) + BigInt(data[i]);
  }
  
  // Convert to base62
  if (num === BigInt(0)) return '0';
  
  while (num > 0) {
    result = BASE62_CHARS[Number(num % BigInt(62))] + result;
    num = num / BigInt(62);
  }
  
  return result;
}

function base62Decode(encoded: string): Uint8Array {
  let num = BigInt(0);
  
  for (let i = 0; i < encoded.length; i++) {
    const char = encoded[i];
    const value = BASE62_CHARS.indexOf(char);
    if (value === -1) throw new Error('Invalid base62 character');
    num = num * BigInt(62) + BigInt(value);
  }
  
  // Convert big integer back to bytes
  const bytes: number[] = [];
  while (num > 0) {
    bytes.unshift(Number(num & BigInt(255)));
    num = num >> BigInt(8);
  }
  
  return new Uint8Array(bytes);
}

// Simple CRC32 checksum
function crc32(data: string): string {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return ((~crc) >>> 0).toString(16).slice(-5).toUpperCase();
}

export interface ContentMetadata {
  type: string;
  language?: string;
  timestamp: number;
  version: number;
}

export async function encodeContent(content: string, metadata: ContentMetadata): Promise<string> {
  try {
    // Create payload object
    const payload = {
      meta: metadata,
      data: content
    };
    
    const jsonString = JSON.stringify(payload);
    
    // Compress using LZMA (simulated with simple compression for demo)
    const compressed = await compressString(jsonString);
    
    // Encode to base62
    const encoded = base62Encode(compressed);
    
    // Generate checksum
    const checksum = crc32(jsonString);
    
    // Build URL
    const baseUrl = 'OneWorkLoc.app';
    const version = `v${metadata.version}`;
    const type = metadata.type;
    
    return `${baseUrl}/${version}/${type}/${checksum}/${encoded}`;
  } catch (error) {
    console.error('Encoding error:', error);
    throw new Error('Failed to encode content');
  }
}

export async function decodeContent(encodedData: string, checksum: string): Promise<{ content: string; metadata: ContentMetadata }> {
  try {
    // Decode from base62
    const compressed = base62Decode(encodedData);
    
    // Decompress
    const jsonString = await decompressString(compressed);
    
    // Verify checksum
    const calculatedChecksum = crc32(jsonString);
    if (calculatedChecksum !== checksum) {
      throw new Error('Checksum verification failed');
    }
    
    // Parse payload
    const payload = JSON.parse(jsonString);
    
    return {
      content: payload.data,
      metadata: payload.meta
    };
  } catch (error) {
    console.error('Decoding error:', error);
    throw new Error('Failed to decode content');
  }
}

// Simplified compression functions (replace with actual LZMA in production)
async function compressString(str: string): Promise<Uint8Array> {
  // For demo purposes, we'll use a simple compression
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  
  // Simulate compression with basic RLE
  const compressed: number[] = [];
  let i = 0;
  
  while (i < data.length) {
    let count = 1;
    const current = data[i];
    
    while (i + count < data.length && data[i + count] === current && count < 255) {
      count++;
    }
    
    if (count > 3) {
      compressed.push(255, count, current);
    } else {
      for (let j = 0; j < count; j++) {
        compressed.push(current);
      }
    }
    
    i += count;
  }
  
  return new Uint8Array(compressed);
}

async function decompressString(compressed: Uint8Array): Promise<string> {
  // Decompress the RLE data
  const decompressed: number[] = [];
  let i = 0;
  
  while (i < compressed.length) {
    if (compressed[i] === 255 && i + 2 < compressed.length) {
      const count = compressed[i + 1];
      const value = compressed[i + 2];
      for (let j = 0; j < count; j++) {
        decompressed.push(value);
      }
      i += 3;
    } else {
      decompressed.push(compressed[i]);
      i++;
    }
  }
  
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(decompressed));
}