import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HomePage, AddIngredientPage, RecipesPage, ShoppingListPage, SharePage } from '@/features/fresh-know/components';

function NavBar() {
  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-gray-900">
          鲜知 FreshKnow
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            冰箱
          </Link>
          <Link
            to="/recipes"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            菜谱
          </Link>
          <Link
            to="/shopping-list"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            清单
          </Link>
          <Link
            to="/share"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            共享
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddIngredientPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/shopping-list" element={<ShoppingListPage />} />
          <Route path="/share" element={<SharePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
