// utils/cachedImages.ts
import { list } from '@vercel/blob';
import type { ImageProps } from './types';

function decodeFilename(pathname: string) {
  try {
    // Format: hash__base64title__base64desc.ext
    const parts = pathname.split('__');
    if (parts.length !== 3) {
      return { title: 'Untitled', description: '' };
    }
    
    const hash = parts[0];
    const title = Buffer.from(parts[1], 'base64').toString('utf-8');
    const descWithExt = parts[2];
    const description = Buffer.from(descWithExt.split('.')[0], 'base64').toString('utf-8');
    
    return { hash, title, description };
  } catch {
    return { title: 'Untitled', description: '' };
  }
}

export default async function getResults(): Promise<ImageProps[]> {
  const { blobs } = await list();
  
  return blobs.map((blob, index) => {
    const { title, description } = decodeFilename(blob.pathname);
    
    return {
      id: index,
      url: blob.url,
      title: title || 'Untitled',
      description: description || 'A moment captured in the wild of Botswana.',
    };
  });
}