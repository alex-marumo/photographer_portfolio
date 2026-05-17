import { list } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';

function decodeFilename(pathname: string) {
  try {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { blobs } = await list();
    
    const images = blobs.map((blob) => {
      const { title, description } = decodeFilename(blob.pathname);
      return {
        url: blob.url,
        pathname: blob.pathname,
        title,
        description,
      };
    });

    return res.status(200).json({ images });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch images' });
  }
}