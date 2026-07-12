import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/page/page-header';
import { Empty } from '@/components/shared/feedback/empty';
import { Button } from '@/components/shared/buttons/button';
import { useShoppingListStore } from '@/store/shopping-list-store';

export function ShoppingListPage() {
  const navigate = useNavigate();
  const [newItem, setNewItem] = useState('');

  const items = useShoppingListStore((state) => state.items);
  const addItem = useShoppingListStore((state) => state.addItem);
  const removeItem = useShoppingListStore((state) => state.removeItem);
  const toggleItem = useShoppingListStore((state) => state.toggleItem);
  const clearCompleted = useShoppingListStore((state) => state.clearCompleted);

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    addItem(newItem);
    setNewItem('');
  };

  const completedCount = items.filter((item) => item.checked).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PageHeader
        title="购物清单"
        subtitle={`${items.length} 项待购 · ${completedCount} 项已购`}
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

      <form className="mt-6 flex gap-2" onSubmit={handleAdd}>
        <input
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
          placeholder="输入需要购买的食材..."
          className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <Button type="submit">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {items.length === 0 ? (
        <Empty
          message="购物清单是空的"
          actionLabel="去菜谱页看看"
          onAction={() => navigate('/recipes')}
        />
      ) : (
        <div className="mt-6 space-y-2">
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                    item.checked
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {item.checked && <Check className="h-3 w-3 text-white" />}
                </button>

                <span
                  className={`flex-1 text-sm ${
                    item.checked ? 'line-through text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {item.name}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-danger transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          {completedCount > 0 && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={clearCompleted}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              清除已购 ({completedCount})
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
