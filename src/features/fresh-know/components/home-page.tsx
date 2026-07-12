import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ChefHat,
  ShoppingCart,
  AlertTriangle,
  Plus,
  Camera,
  ScanLine,
  Sparkles,
  Carrot,
  Beef,
  Fish,
  Milk,
  Apple,
  Wheat,
  Droplets,
  Snowflake,
  Coffee,
  Box,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { useFridgeStore } from '@/store/fridge-store';
import { PageHeader } from '@/components/shared/page/page-header';
import { Button } from '@/components/shared/buttons/button';
import type { FreshnessStatus, IngredientCategory } from '@/types';
import { INGREDIENT_CATEGORY_LABELS } from '@/types';
import { fetchRecipes } from '../api';
import type { Recipe } from '../types';

const STATUS_CONFIG: Record<
  FreshnessStatus,
  { label: string; className: string; barClassName: string; bgGradient: string }
> = {
  fresh: {
    label: '新鲜',
    className: 'text-emerald-700',
    barClassName: 'bg-emerald-500',
    bgGradient: 'from-emerald-50 to-white',
  },
  expiring_soon: {
    label: '临期',
    className: 'text-amber-700',
    barClassName: 'bg-amber-500',
    bgGradient: 'from-amber-50 to-white',
  },
  expired: {
    label: '已过期',
    className: 'text-red-700',
    barClassName: 'bg-red-500',
    bgGradient: 'from-red-50 to-white',
  },
};

const CATEGORY_ICONS: Record<IngredientCategory, React.ComponentType<{ className?: string }>> = {
  vegetable: Carrot,
  meat: Beef,
  seafood: Fish,
  dairy: Milk,
  fruit: Apple,
  grain: Wheat,
  condiment: Droplets,
  frozen: Snowflake,
  beverage: Coffee,
  other: Box,
};

function AnimatedNumber({ value, duration = 600 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const startValue = useRef(0);

  useEffect(() => {
    startValue.current = displayValue;
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.round(startValue.current + (value - startValue.current) * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

function FridgeEmptyIllustration() {
  return (
    <div className="relative mb-4">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fridgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect x="30" y="15" width="60" height="90" rx="10" fill="url(#fridgeGrad)" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.4" />
        <rect x="30" y="45" width="60" height="2" fill="#22c55e" fillOpacity="0.3" />
        <circle cx="82" cy="32" r="3" fill="#22c55e" fillOpacity="0.5" />
        <circle cx="82" cy="70" r="3" fill="#22c55e" fillOpacity="0.5" />
        <path d="M50 55 L55 60 L70 45" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
        <circle cx="55" cy="75" r="8" fill="#22c55e" fillOpacity="0.1" />
        <path d="M52 75 L54 77 L58 73" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
      </svg>
      <div className="absolute -top-1 -right-1 animate-bounce">
        <Sparkles className="h-5 w-5 text-amber-400" />
      </div>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const ingredients = useFridgeStore((state) => state.ingredients);
  const getFreshnessStatus = useFridgeStore((state) => state.getFreshnessStatus);
  const [fabOpen, setFabOpen] = useState(false);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  const expiringCount = useMemo(
    () =>
      ingredients.filter((item) => {
        const status = getFreshnessStatus(item);
        return status === 'expiring_soon' || status === 'expired';
      }).length,
    [ingredients, getFreshnessStatus]
  );

  const sortedIngredients = useMemo(() => {
    return [...ingredients].sort((a, b) => {
      const statusOrder = { expired: 0, expiring_soon: 1, fresh: 2 };
      const statusA = statusOrder[getFreshnessStatus(a)];
      const statusB = statusOrder[getFreshnessStatus(b)];
      if (statusA !== statusB) return statusA - statusB;
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    });
  }, [ingredients, getFreshnessStatus]);

  useEffect(() => {
    if (ingredients.length > 0 && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      setRecipesLoading(true);
      fetchRecipes(ingredients)
        .then((recipes) => {
          setRecommendedRecipes(recipes.slice(0, 2));
        })
        .catch(() => {
          setRecommendedRecipes([]);
        })
        .finally(() => {
          setRecipesLoading(false);
        });
    }
    if (ingredients.length === 0) {
      hasFetchedRef.current = false;
      setRecommendedRecipes([]);
    }
  }, [ingredients]);

  const statsCards = [
    {
      icon: Package,
      label: '当前库存',
      value: ingredients.length,
      unit: '种',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-white',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      icon: AlertTriangle,
      label: '临期提醒',
      value: expiringCount,
      unit: '项',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-white',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      icon: ChefHat,
      label: '可做菜谱',
      value: Math.min(ingredients.length * 3, 12),
      unit: '道',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-white',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-2xl px-4 py-6 pb-28">
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

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {statsCards.map((card, index) => (
            <div
              key={card.label}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bgGradient} p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md border border-gray-100`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 transition-opacity group-hover:opacity-20`} />
              <div className="relative">
                <div className={`mb-3 inline-flex rounded-xl ${card.iconBg} p-2.5 ${card.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-gray-500">{card.label}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                    <AnimatedNumber value={card.value} />
                  </span>
                  <span className="text-sm font-medium text-gray-400">{card.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">食材快照</h2>
            <button
              onClick={() => navigate('/add')}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              查看全部 →
            </button>
          </div>

          {ingredients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 rounded-2xl border-2 border-dashed border-gray-200 bg-white/50">
              <FridgeEmptyIllustration />
              <p className="text-base font-medium text-gray-700">冰箱还是空的</p>
              <p className="mt-1 text-sm text-gray-400">快去囤点鲜货吧～</p>
              <button
                onClick={() => navigate('/add')}
                className="mt-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
              >
                添加第一种食材
              </button>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {sortedIngredients.slice(0, 5).map((item, index) => {
                const status = getFreshnessStatus(item);
                const config = STATUS_CONFIG[status];
                const CategoryIcon = CATEGORY_ICONS[item.category];
                const daysLeft = Math.ceil(
                  (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <li
                    key={item.id}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${config.bgGradient} p-4 shadow-sm transition-all duration-200 hover:shadow-md border border-gray-100`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.barClassName}`} />
                    <div className="flex items-center justify-between pl-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ${config.className}`}>
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {item.quantity}{item.unit} · {INGREDIENT_CATEGORY_LABELS[item.category]}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.className} bg-white/80`}>
                          {status === 'expired' ? (
                            '已过期'
                          ) : daysLeft <= 2 ? (
                            <>还剩 {daysLeft} 天</>
                          ) : (
                            <>{daysLeft} 天后过期</>
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
              {ingredients.length > 5 && (
                <button
                  onClick={() => navigate('/add')}
                  className="w-full py-3 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                >
                  还有 {ingredients.length - 5} 种食材...
                </button>
              )}
            </ul>
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">今晚吃什么</h2>
            <button
              onClick={() => navigate('/recipes')}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
            >
              更多菜谱
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {ingredients.length === 0 ? (
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25">
                  <ChefHat className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">添加食材解锁智能推荐</p>
                  <p className="mt-1 text-sm text-gray-500">告诉我你冰箱里有什么，我来帮你想今晚吃什么～</p>
                  <button
                    onClick={() => navigate('/add')}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <Plus className="h-4 w-4" />
                    去添加食材
                  </button>
                </div>
              </div>
            </div>
          ) : recipesLoading ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="animate-pulse space-y-3">
                <div className="h-5 w-32 rounded bg-gray-200" />
                <div className="h-4 w-48 rounded bg-gray-100" />
                <div className="h-4 w-40 rounded bg-gray-100" />
              </div>
            </div>
          ) : recommendedRecipes.length > 0 ? (
            <div className="space-y-3">
              {recommendedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md border border-gray-100 cursor-pointer"
                  onClick={() => navigate('/recipes')}
                >
                  <div className="absolute right-0 top-0 h-20 w-20 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full" />
                  <div className="relative flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      {recipe.imageUrl ? (
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ChefHat className="h-7 w-7 text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{recipe.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{recipe.description}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recipe.cookTimeMinutes}分钟
                        </span>
                        {recipe.missingIngredientNames.length > 0 && (
                          <span className="text-amber-600">
                            缺 {recipe.missingIngredientNames.length} 样
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-emerald-500" />
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate('/recipes')}
                className="w-full mt-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white font-medium shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                一键生成更多菜谱
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25">
                  <ChefHat className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">暂时没有匹配的菜谱</p>
                  <p className="mt-1 text-sm text-gray-500">试试AI创意生成，说不定有惊喜～</p>
                  <button
                    onClick={() => navigate('/recipes')}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI 生成菜谱
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {import.meta.env.VITE_FEEDBACK_URL && (
          <div className="mt-10 text-center">
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

      <div className="fixed bottom-6 right-6 z-50">
        {fabOpen && (
          <div className="absolute bottom-20 right-0 flex flex-col gap-3 items-end">
            <button
              onClick={() => {
                setFabOpen(false);
                navigate('/add');
              }}
              className="group flex items-center gap-3"
            >
              <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                手动录入
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg text-emerald-600 transition-all hover:scale-105 border border-gray-100">
                <Plus className="h-5 w-5" />
              </div>
            </button>
            <button
              onClick={() => {
                setFabOpen(false);
              }}
              className="group flex items-center gap-3"
            >
              <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                拍照识别
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg text-blue-600 transition-all hover:scale-105 border border-gray-100">
                <Camera className="h-5 w-5" />
              </div>
            </button>
            <button
              onClick={() => {
                setFabOpen(false);
              }}
              className="group flex items-center gap-3"
            >
              <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                扫码录入
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg text-purple-600 transition-all hover:scale-105 border border-gray-100">
                <ScanLine className="h-5 w-5" />
              </div>
            </button>
          </div>
        )}

        <button
          onClick={() => setFabOpen(!fabOpen)}
          className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/40 transition-all duration-300 hover:shadow-emerald-500/50 active:scale-95 ${
            fabOpen ? 'rotate-45' : ''
          }`}
        >
          <Plus className="h-7 w-7 transition-transform duration-300" />
          <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-30 animate-ping" />
        </button>
      </div>

      {fabOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setFabOpen(false)}
        />
      )}
    </div>
  );
}
