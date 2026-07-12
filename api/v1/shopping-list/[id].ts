import { VercelRequest, VercelResponse } from '@vercel/node';
import { updateShoppingItem, removeShoppingItem } from '../_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { completed } = req.body;
    const item = updateShoppingItem(String(id), completed);

    if (!item) {
      return res.json({
        code: 1,
        msg: '商品不存在',
        data: null,
      });
    }

    return res.json({
      code: 0,
      msg: '更新成功',
      data: item,
    });
  }

  if (req.method === 'DELETE') {
    const success = removeShoppingItem(String(id));

    if (!success) {
      return res.json({
        code: 1,
        msg: '商品不存在',
        data: null,
      });
    }

    return res.json({
      code: 0,
      msg: '删除成功',
      data: null,
    });
  }

  res.status(405).json({
    code: 1,
    msg: 'Method not allowed',
    data: null,
  });
}
