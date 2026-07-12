import { VercelRequest, VercelResponse } from '@vercel/node';
import { getMembers } from '../_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      code: 1,
      msg: 'Method not allowed',
      data: null,
    });
  }

  res.json({
    code: 0,
    msg: 'success',
    data: getMembers(),
  });
}
