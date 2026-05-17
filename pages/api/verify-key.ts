import type { NextApiRequest, NextApiResponse } from 'next';

export const runtime = 'edge';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key } = req.body;
  
  if (key === process.env.UPLOAD_SECRET) {
    return res.status(200).json({ valid: true });
  }
  
  return res.status(401).json({ valid: false });
}