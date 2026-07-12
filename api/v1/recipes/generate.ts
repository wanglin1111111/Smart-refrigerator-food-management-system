import { VercelRequest, VercelResponse } from '@vercel/node';
import { getAiRecipes } from '../../_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      code: 1,
      msg: 'Method not allowed',
      data: null,
    });
  }

  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients)) {
    return res.json({
      code: 1,
      msg: '缺少食材参数',
      data: [],
    });
  }

  const aiRecipes = getAiRecipes();

  res.json({
    code: 0,
    msg: 'success',
    data: aiRecipes,
  });
}
