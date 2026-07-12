import { VercelRequest, VercelResponse } from '@vercel/node';
import { removeMember } from '../_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      code: 1,
      msg: 'Method not allowed',
      data: null,
    });
  }

  const { id } = req.query;
  const success = removeMember(String(id));

  if (!success) {
    return res.json({
      code: 1,
      msg: '成员不存在',
      data: null,
    });
  }

  res.json({
    code: 0,
    msg: '移除成功',
    data: null,
  });
}
