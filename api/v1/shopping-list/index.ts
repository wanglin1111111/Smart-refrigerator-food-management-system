import { VercelRequest, VercelResponse } from '@vercel/node';
import { getShoppingList, addShoppingItem } from '../_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.json({
      code: 0,
      msg: 'success',
      data: getShoppingList(),
    });
  }

  if (req.method === 'POST') {
    const { name, quantity = '1' } = req.body;

    if (!name) {
      return res.json({
        code: 1,
        msg: '请输入商品名称',
        data: null,
      });
    }

    const newItem = addShoppingItem(name, quantity);

    return res.json({
      code: 0,
      msg: '添加成功',
      data: newItem,
    });
  }

  res.status(405).json({
    code: 1,
    msg: 'Method not allowed',
    data: null,
  });
}
