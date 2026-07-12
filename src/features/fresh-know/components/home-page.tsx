import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChefHat, ShoppingCart, AlertTriangle } from 'lucide-react';
import { useFridgeStore } from '@/store/fridge-store';
import { PageHeader } from '@/components/shared/page/page-header';
import { Empty } from '@/components/shared/feedback/empty';
import { Button } from '@/components/shared/buttons/button';
import type { FreshnessStatus } from '@/types';

const STATUS_CONFIG: Record<
  FreshnessStatus,
  { label: string; className: string; dotClassName: string }
> = {
  fresh: {
    label: '新鲜',
    className: 'border-green-200 bg-green-50 text-green-700',
    dotClassName: 'bg-green-500',
  },
  expiring_soon: {
    label: '临期',
    className: 'border-orange-200 bg-orange-50 text-orange-700',
    dotClassName: 'bg-orange-500',
  },
  expired: {
    label: '已过期',
    className: 'border-red-200 bg-red-50 text-red-700',
    dotClassName: 'bg-red-500',
  },
};

export function HomePage() {
  const navigate = useNavigate();
  const ingredients = useFridgeStore((state) => state.ingredients);
  const getFreshnessStatus = useFridgeStore((state) => state.getFreshnessStatus);

  const expiringCount = useMemo(
    () =>
      ingredients.filter((item) => {
        const status = getFreshnessStatus(item);
        return status === 'expiring_soon' || status === 'expired';
      }).length,
    [ingredients, getFreshnessStatus]
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PageHeader
        title="我的冰箱"
        subtitle={`共 ${ingredients.length} 种食材`}
        rightAction={
          <Button variant="outline" onClick={() => navigate('/shopping-list')}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            购物清单
          </Button>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">当前库存</p>
              <p className="text-lg font-semibold">{ingredients.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-50 p-2 text-orange-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">临期提醒</p>
              <p className="text-lg font-semibold">{expiringCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-indigo-50 p-2 text-indigo-500">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">智能菜谱</p>
              <p className="text-lg font-semibold">就绪</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">食材快照</h2>
          <Button variant="ghost" onClick={() => navigate('/add')}>
            添加食材
          </Button>
        </div>

        {ingredients.length === 0 ? (
          <Empty
            message="冰箱还是空的，添加第一种食材吧"
            actionLabel="添加食材"
            onAction={() => navigate('/add')}
          />
        ) : (
          <ul className="space-y-2">
            {ingredients.map((item) => {
              const status = getFreshnessStatus(item);
              const config = STATUS_CONFIG[status];

              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${config.dotClassName}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity}
                        {item.unit} · 保质期至 {item.expiryDate}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${config.className}`}
                  >
                    {config.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <Button className="w-full" onClick={() => navigate('/recipes')}>
          <ChefHat className="mr-2 h-4 w-4" />
          今晚吃什么
        </Button>
      </div>

      {import.meta.env.VITE_FEEDBACK_URL && (
        <div className="mt-10 pb-4 text-center">
          <a
            href={import.meta.env.VITE_FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            反馈建议
          </a>
        </div>
      )}
    </div>
  );
}
