import { put } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File as FormidableFile } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const form = new IncomingForm();
    
    const { fields, files } = await new Promise<{ fields: any, files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Read file from temporary path
    const fileBuffer = fs.readFileSync((file as FormidableFile).filepath);
    const fileName = (file as FormidableFile).originalFilename || 'image';

    // Upload to Vercel Blob with metadata
    const blob = await put(fileName, fileBuffer, {
      access: 'public',
      addRandomSuffix: true,
    });

    // TODO: Store metadata in a database or JSON file
    // For now, you'll need to manually add title/description to your images array
    // Consider using Vercel KV or a similar solution to persist metadata

    return res.status(200).json({ 
      ...blob,
      title,
      description 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}