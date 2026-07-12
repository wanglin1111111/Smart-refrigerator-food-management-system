import { VercelRequest, VercelResponse } from '@vercel/node';
import { addMember } from '../_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      code: 1,
      msg: 'Method not allowed',
      data: null,
    });
  }

  const { email } = req.body;

  if (!email) {
    return res.json({
      code: 1,
      msg: '请输入邮箱地址',
      data: null,
    });
  }

  const newMember = addMember(email);

  if (!newMember) {
    return res.json({
      code: 1,
      msg: '该成员已在共享列表中',
      data: null,
    });
  }

  res.json({
    code: 0,
    msg: '邀请发送成功',
    data: newMember,
  });
}
