import { put, list } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File as FormidableFile } from 'formidable';
import fs from 'fs';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Encode metadata into filename
function encodeFilename(title: string, description: string, hash: string, originalName: string): string {
  const ext = originalName.split('.').pop();
  // Base64 encode to handle special characters
  const encodedTitle = Buffer.from(title || 'Untitled').toString('base64');
  const encodedDesc = Buffer.from(description || '').toString('base64');
  return `${hash}__${encodedTitle}__${encodedDesc}.${ext}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm();
    
    const { fields, files } = await new Promise<{ fields: any, files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title || '';
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description || '';

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileBuffer = fs.readFileSync((file as FormidableFile).filepath);
    const fileHash = crypto.createHash('md5').update(fileBuffer).digest('hex');
    const originalName = (file as FormidableFile).originalFilename || 'image.jpg';

    // Check for duplicates
    const { blobs } = await list();
    const duplicate = blobs.find(b => b.pathname.startsWith(fileHash));
    
    if (duplicate) {
      return res.status(400).json({ error: 'This image has already been uploaded' });
    }

    // Encode metadata in filename
    const encodedFilename = encodeFilename(title, description, fileHash, originalName);

    console.log('Uploading:', encodedFilename);

    const blob = await put(encodedFilename, fileBuffer, {
      access: 'public',
    });

    console.log('Upload success:', blob.pathname);

    return res.status(200).json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed', details: error.message });
  }
}