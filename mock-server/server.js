import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const mockRecipes = [
  {
    id: '1',
    title: '西红柿炒蛋',
    description: '家常经典，营养丰富',
    cookTimeMinutes: 15,
    difficulty: 'easy',
    ingredients: [
      { name: '西红柿', quantity: '2个' },
      { name: '鸡蛋', quantity: '3个' },
      { name: '葱花', quantity: '少许' },
      { name: '盐', quantity: '适量' },
      { name: '食用油', quantity: '适量' },
    ],
    steps: [
      '西红柿洗净切块，鸡蛋打散备用',
      '锅中倒油烧热，倒入鸡蛋液炒至定型盛出',
      '锅中再倒少许油，放入西红柿块翻炒出汁',
      '加入炒好的鸡蛋，加盐调味，翻炒均匀',
      '撒上葱花，出锅装盘',
    ],
    tags: ['家常菜', '快手菜'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tomato%20scrambled%20eggs%20chinese%20dish%20food%20photography&image_size=square',
    matchedIngredientIds: [],
    missingIngredientNames: ['鸡蛋', '葱花', '盐', '食用油'],
  },
  {
    id: '2',
    title: '青椒土豆丝',
    description: '酸辣爽口，下饭神器',
    cookTimeMinutes: 12,
    difficulty: 'easy',
    ingredients: [
      { name: '土豆', quantity: '2个' },
      { name: '青椒', quantity: '2个' },
      { name: '蒜', quantity: '2瓣' },
      { name: '干辣椒', quantity: '2个' },
      { name: '醋', quantity: '适量' },
      { name: '盐', quantity: '适量' },
    ],
    steps: [
      '土豆去皮切丝，青椒切丝，蒜切末',
      '土豆丝放入清水中浸泡去淀粉',
      '锅中倒油烧热，放入蒜末和干辣椒爆香',
      '加入土豆丝翻炒至半熟',
      '加入青椒丝继续翻炒',
      '加盐和醋调味，翻炒均匀即可出锅',
    ],
    tags: ['家常菜', '下饭'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shredded%20potato%20with%20green%20pepper%20chinese%20dish%20food%20photography&image_size=square',
    matchedIngredientIds: [],
    missingIngredientNames: ['青椒', '蒜', '干辣椒', '醋', '盐'],
  },
  {
    id: '3',
    title: '蒜蓉西兰花',
    description: '清淡健康，营养均衡',
    cookTimeMinutes: 10,
    difficulty: 'easy',
    ingredients: [
      { name: '西兰花', quantity: '1颗' },
      { name: '蒜', quantity: '3瓣' },
      { name: '盐', quantity: '适量' },
      { name: '食用油', quantity: '适量' },
      { name: '蚝油', quantity: '少许' },
    ],
    steps: [
      '西兰花切成小朵，洗净沥干',
      '锅中烧开水，放入西兰花焯水1分钟捞出',
      '锅中倒油烧热，放入蒜末爆香',
      '加入西兰花翻炒均匀',
      '加盐和蚝油调味，翻炒片刻即可出锅',
    ],
    tags: ['素菜', '健康'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=garlic%20broccoli%20chinese%20vegetable%20dish%20food%20photography&image_size=square',
    matchedIngredientIds: [],
    missingIngredientNames: ['西兰花', '蒜', '盐', '食用油', '蚝油'],
  },
  {
    id: '4',
    title: '黄瓜炒肉',
    description: '清爽可口，荤素搭配',
    cookTimeMinutes: 15,
    difficulty: 'medium',
    ingredients: [
      { name: '黄瓜', quantity: '2根' },
      { name: '猪肉', quantity: '200克' },
      { name: '姜', quantity: '2片' },
      { name: '蒜', quantity: '2瓣' },
      { name: '生抽', quantity: '适量' },
      { name: '料酒', quantity: '适量' },
      { name: '盐', quantity: '适量' },
    ],
    steps: [
      '猪肉切片，用生抽和料酒腌制10分钟',
      '黄瓜洗净切片，姜蒜切末',
      '锅中倒油烧热，放入姜蒜末爆香',
      '加入肉片翻炒至变色',
      '加入黄瓜片继续翻炒',
      '加盐调味，翻炒均匀即可出锅',
    ],
    tags: ['家常菜', '荤素搭配'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cucumber%20stir%20fry%20with%20pork%20chinese%20dish%20food%20photography&image_size=square',
    matchedIngredientIds: [],
    missingIngredientNames: ['黄瓜', '猪肉', '姜', '蒜', '生抽', '料酒', '盐'],
  },
  {
    id: '5',
    title: '蛋炒饭',
    description: '简单快捷，美味饱腹',
    cookTimeMinutes: 10,
    difficulty: 'easy',
    ingredients: [
      { name: '米饭', quantity: '1碗' },
      { name: '鸡蛋', quantity: '2个' },
      { name: '葱花', quantity: '少许' },
      { name: '盐', quantity: '适量' },
      { name: '食用油', quantity: '适量' },
    ],
    steps: [
      '鸡蛋打散备用',
      '锅中倒油烧热，倒入鸡蛋液炒至定型',
      '加入米饭翻炒均匀',
      '加盐调味，继续翻炒至米饭粒粒分明',
      '撒上葱花，出锅装盘',
    ],
    tags: ['快手菜', '主食'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=egg%20fried%20rice%20chinese%20food%20photography&image_size=square',
    matchedIngredientIds: [],
    missingIngredientNames: ['米饭', '鸡蛋', '葱花', '盐', '食用油'],
  },
];

const aiGeneratedRecipes = [
  {
    id: 'ai-1',
    title: '创意番茄蛋饼',
    description: '将西红柿和鸡蛋完美融合，做成美味的蛋饼',
    cookTimeMinutes: 20,
    difficulty: 'medium',
    ingredients: [
      { name: '西红柿', quantity: '2个' },
      { name: '鸡蛋', quantity: '3个' },
      { name: '面粉', quantity: '50克' },
      { name: '水', quantity: '适量' },
      { name: '盐', quantity: '适量' },
      { name: '葱花', quantity: '少许' },
    ],
    steps: [
      '西红柿洗净切块，放入搅拌机打成泥',
      '鸡蛋打散，加入西红柿泥、面粉和水搅拌均匀',
      '加入盐调味，撒上葱花',
      '平底锅倒油烧热，倒入面糊摊成薄饼',
      '小火煎至两面金黄，出锅切块',
    ],
    tags: ['创意菜', '早餐'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tomato%20egg%20pancake%20chinese%20breakfast%20food%20photography&image_size=square',
    matchedIngredientIds: [],
    missingIngredientNames: ['鸡蛋', '面粉', '水', '盐', '葱花'],
  },
  {
    id: 'ai-2',
    title: '土豆泥沙拉',
    description: '土豆泥搭配蔬菜，清爽美味',
    cookTimeMinutes: 25,
    difficulty: 'easy',
    ingredients: [
      { name: '土豆', quantity: '2个' },
      { name: '黄瓜', quantity: '1根' },
      { name: '胡萝卜', quantity: '半根' },
      { name: '沙拉酱', quantity: '适量' },
      { name: '盐', quantity: '适量' },
      { name: '黑胡椒', quantity: '少许' },
    ],
    steps: [
      '土豆去皮切块，蒸熟后压成泥',
      '黄瓜和胡萝卜洗净切丁',
      '将蔬菜丁加入土豆泥中',
      '加入沙拉酱、盐和黑胡椒调味',
      '搅拌均匀，冷藏后口感更佳',
    ],
    tags: ['沙拉', '凉菜'],
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=potato%20salad%20with%20vegetables%20food%20photography&image_size=square',
    matchedIngredientIds: [],
    missingIngredientNames: ['土豆', '黄瓜', '胡萝卜', '沙拉酱', '盐', '黑胡椒'],
  },
];

let mockShoppingList = [
  { id: '1', name: '牛奶', quantity: '1盒', completed: false, addedAt: Date.now() - 86400000 },
  { id: '2', name: '面包', quantity: '1袋', completed: true, addedAt: Date.now() - 172800000 },
  { id: '3', name: '鸡蛋', quantity: '10个', completed: false, addedAt: Date.now() - 43200000 },
];

let mockMembers = [
  { id: '1', email: 'family1@example.com', name: '家庭成员1', role: 'member', joinedAt: Date.now() - 86400000 },
  { id: '2', email: 'family2@example.com', name: '家庭成员2', role: 'member', joinedAt: Date.now() - 172800000 },
];

app.post('/api/v1/recipes/match', (req, res) => {
  const { ingredients } = req.body;
  
  if (!ingredients || !Array.isArray(ingredients)) {
    return res.json({
      code: 1,
      msg: '缺少食材参数',
      data: [],
    });
  }

  const ingredientNames = ingredients.map((i) => i.name).map((n) => n.toLowerCase());

  const matchedRecipes = mockRecipes.filter((recipe) => {
    const recipeIngredients = recipe.ingredients.map((i) => i.name.toLowerCase());
    return recipeIngredients.some((ri) => ingredientNames.some((iname) => ri.includes(iname) || iname.includes(ri)));
  });

  res.json({
    code: 0,
    msg: 'success',
    data: matchedRecipes,
  });
});

app.post('/api/v1/recipes/generate', (req, res) => {
  const { ingredients } = req.body;
  
  if (!ingredients || !Array.isArray(ingredients)) {
    return res.json({
      code: 1,
      msg: '缺少食材参数',
      data: [],
    });
  }

  res.json({
    code: 0,
    msg: 'success',
    data: aiGeneratedRecipes,
  });
});

app.get('/api/v1/shopping-list', (req, res) => {
  res.json({
    code: 0,
    msg: 'success',
    data: mockShoppingList,
  });
});

app.post('/api/v1/shopping-list', (req, res) => {
  const { name, quantity = '1' } = req.body;
  
  if (!name) {
    return res.json({
      code: 1,
      msg: '请输入商品名称',
      data: null,
    });
  }

  const newItem = {
    id: crypto.randomUUID(),
    name,
    quantity,
    completed: false,
    addedAt: Date.now(),
  };

  mockShoppingList.push(newItem);

  res.json({
    code: 0,
    msg: '添加成功',
    data: newItem,
  });
});

app.put('/api/v1/shopping-list/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const item = mockShoppingList.find((i) => i.id === id);

  if (!item) {
    return res.json({
      code: 1,
      msg: '商品不存在',
      data: null,
    });
  }

  item.completed = completed;

  res.json({
    code: 0,
    msg: '更新成功',
    data: item,
  });
});

app.delete('/api/v1/shopping-list/:id', (req, res) => {
  const { id } = req.params;

  const initialLength = mockShoppingList.length;
  mockShoppingList = mockShoppingList.filter((i) => i.id !== id);

  if (mockShoppingList.length === initialLength) {
    return res.json({
      code: 1,
      msg: '商品不存在',
      data: null,
    });
  }

  res.json({
    code: 0,
    msg: '删除成功',
    data: null,
  });
});

app.post('/api/v1/fridge/share', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      code: 1,
      msg: '请输入邮箱地址',
      data: null,
    });
  }

  const existingMember = mockMembers.find((m) => m.email === email);

  if (existingMember) {
    return res.json({
      code: 1,
      msg: '该成员已在共享列表中',
      data: null,
    });
  }

  const newMember = {
    id: crypto.randomUUID(),
    email,
    name: email.split('@')[0],
    role: 'member',
    joinedAt: Date.now(),
  };

  mockMembers.push(newMember);

  res.json({
    code: 0,
    msg: '邀请发送成功',
    data: newMember,
  });
});

app.get('/api/v1/fridge/members', (req, res) => {
  res.json({
    code: 0,
    msg: 'success',
    data: mockMembers,
  });
});

app.delete('/api/v1/fridge/members/:id', (req, res) => {
  const { id } = req.params;

  const initialLength = mockMembers.length;
  mockMembers = mockMembers.filter((m) => m.id !== id);

  if (mockMembers.length === initialLength) {
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
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock Server running on http://localhost:${PORT}`);
  console.log(`              or http://192.168.0.177:${PORT} (LAN)`);
  console.log('Available APIs:');
  console.log('  POST   /api/v1/recipes/match     - 食材匹配菜谱');
  console.log('  POST   /api/v1/recipes/generate   - AI生成菜谱');
  console.log('  GET    /api/v1/shopping-list      - 获取购物清单');
  console.log('  POST   /api/v1/shopping-list      - 添加购物清单');
  console.log('  PUT    /api/v1/shopping-list/:id  - 更新购物清单');
  console.log('  DELETE /api/v1/shopping-list/:id  - 删除购物清单');
  console.log('  POST   /api/v1/fridge/share       - 邀请共享成员');
  console.log('  GET    /api/v1/fridge/members     - 获取共享成员');
  console.log('  DELETE /api/v1/fridge/members/:id - 移除共享成员');
});
