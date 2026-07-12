import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFridgeStore, suggestExpiryDate } from '@/store/fridge-store';
import { Button } from '@/components/shared/buttons/button';
import { PageHeader } from '@/components/shared/page/page-header';
import { INGREDIENT_CATEGORY_LABELS } from '@/types';
import type { IngredientCategory } from '@/types';
import { Analytics } from '@/lib/analytics';

const CATEGORIES = Object.keys(INGREDIENT_CATEGORY_LABELS) as IngredientCategory[];
const COMMON_UNITS = ['个', '根', '把', '袋', '盒', '瓶', '罐', '毫升', '克', '千克', '包'];

export function AddIngredientPage() {
  const navigate = useNavigate();
  const addIngredient = useFridgeStore((state) => state.addIngredient);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<IngredientCategory>('vegetable');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('个');
  const [purchaseDate, setPurchaseDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [expiryDate, setExpiryDate] = useState(() => suggestExpiryDate('vegetable', purchaseDate));

  useEffect(() => {
    setExpiryDate(suggestExpiryDate(category, purchaseDate));
  }, [category, purchaseDate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addIngredient({
      name: name.trim(),
      category,
      quantity: Number(quantity),
      unit,
      purchaseDate,
      expiryDate,
    });

    Analytics.addIngredient(name.trim());

    navigate('/');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PageHeader
        title="添加食材"
        subtitle="快速记录你刚买回家的食材"
        rightAction={
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        }
      />

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">食材名称</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="例如：西红柿"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">分类</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  category === item
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-primary'
                }`}
              >
                {INGREDIENT_CATEGORY_LABELS[item]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">数量</label>
            <input
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              type="number"
              min="0"
              step="0.1"
              placeholder="数量"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">单位</label>
            <select
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {COMMON_UNITS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">购买日期</label>
            <input
              value={purchaseDate}
              onChange={(event) => setPurchaseDate(event.target.value)}
              type="date"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">预计保质期</label>
            <input
              value={expiryDate}
              onChange={(event) => setExpiryDate(event.target.value)}
              type="date"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          确认入库
        </Button>
      </form>
    </div>
  );
}
