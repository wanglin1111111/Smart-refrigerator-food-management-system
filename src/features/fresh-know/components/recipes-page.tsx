import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, XCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFridgeStore } from '@/store/fridge-store';
import { PageHeader } from '@/components/shared/page/page-header';
import { Empty } from '@/components/shared/feedback/empty';
import { Loading } from '@/components/shared/feedback/loading';
import { ErrorMessage } from '@/components/shared/feedback/error-message';
import { Button } from '@/components/shared/buttons/button';
import type { Recipe } from '@/features/fresh-know/types';
import { fetchRecipes, generateRecipeByAI } from '@/features/fresh-know/api';
import { useShoppingListStore } from '@/store/shopping-list-store';
import { Analytics } from '@/lib/analytics';

export function RecipesPage() {
  const navigate = useNavigate();
  const ingredients = useFridgeStore((state) => state.ingredients);
  const addShoppingItem = useShoppingListStore((state) => state.addItem);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const fridgeIngredientNames = useMemo(
    () => ingredients.map((item) => item.name),
    [ingredients]
  );

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchRecipes(ingredients)
      .then((data) => {
        setRecipes(data);
        if (data.length > 0) {
          Analytics.generateRecipe('match');
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ingredients]);

  const handleAiGenerate = async () => {
    setAiLoading(true);
    setAiError(null);

    try {
      const aiRecipes = await generateRecipeByAI(ingredients);
      if (aiRecipes.length > 0) {
        setRecipes((prev) => [...prev, ...aiRecipes]);
        Analytics.generateRecipe('ai');
      } else {
        setAiError('AI 未能生成菜谱，请稍后重试');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        setAiError('网络连接失败，请检查网络后重试');
      } else {
        setAiError(`AI 生成失败：${errorMessage}`);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddToShoppingList = (itemName: string) => {
    addShoppingItem(itemName);
    Analytics.addToShoppingList(itemName);
  };

  if (ingredients.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <PageHeader
          title="今晚吃什么"
          subtitle="根据冰箱现有食材智能推荐"
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
        <Empty
          message="冰箱里还没有食材，先添加一些食材吧"
          actionLabel="添加食材"
          onAction={() => navigate('/add')}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <PageHeader
          title="今晚吃什么"
          subtitle="根据冰箱现有食材智能推荐"
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
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <PageHeader
          title="今晚吃什么"
          subtitle="根据冰箱现有食材智能推荐"
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
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PageHeader
        title="今晚吃什么"
        subtitle="根据冰箱现有食材智能推荐"
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

      <div className="mt-6 space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAiGenerate}
          disabled={aiLoading}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {aiLoading ? 'AI 生成中...' : 'AI 智能生成菜谱'}
        </Button>

        {aiError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-700">{aiError}</p>
              <Button
                variant="ghost"
                onClick={handleAiGenerate}
                disabled={aiLoading}
              >
                重试
              </Button>
            </div>
          </div>
        )}

        {recipes.length === 0 ? (
          <Empty message="暂无匹配的菜谱，试试 AI 生成吧" />
        ) : (
          <ul className="space-y-4">
            {recipes.map((recipe) => (
              <li
                key={recipe.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{recipe.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{recipe.description}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      预计用时 {recipe.cookTimeMinutes} 分钟 ·{' '}
                      {recipe.difficulty === 'easy'
                        ? '简单'
                        : recipe.difficulty === 'medium'
                        ? '中等'
                        : '困难'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-gray-500">所需食材</p>
                  <div className="flex flex-wrap gap-2">
                    {fridgeIngredientNames.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs text-green-700"
                      >
                        ✓ {name}
                      </span>
                    ))}
                    {recipe.missingIngredientNames.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleAddToShoppingList(name)}
                        className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600 hover:border-primary hover:text-primary transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5 text-gray-400" />
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-primary">
                    查看步骤
                  </summary>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-700">
                    {recipe.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
