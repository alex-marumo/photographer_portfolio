import { put, del, list } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export const runtime = 'edge';

function encodeFilename(title: string, description: string, hash: string, originalExt: string): string {
  const encodedTitle = Buffer.from(title || 'Untitled').toString('base64');
  const encodedDesc = Buffer.from(description || '').toString('base64');
  return `${hash}__${encodedTitle}__${encodedDesc}.${originalExt}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, title, description } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    // Fetch the image data
    const imageRes = await fetch(url);
    const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
    
    // Get hash and extension from original
    const { blobs } = await list();
    const originalBlob = blobs.find(b => b.url === url);
    
    if (!originalBlob) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const hash = originalBlob.pathname.split('__')[0];
    const ext = originalBlob.pathname.split('.').pop();

    // Create new filename with updated metadata
    const newFilename = encodeFilename(title, description, hash, ext);

    // Delete old blob
    await del(url);

    // Upload with new filename
    const newBlob = await put(newFilename, imageBuffer, {
      access: 'public',
    });

    return res.status(200).json({ success: true, newUrl: newBlob.url });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ error: 'Update failed' });
  }
}