import { Link, Outlet, useParams, useLocation } from "react-router";

// Sample data for the demo
const categories = [
  { id: "electronics", name: "Electronics", icon: "💻" },
  { id: "books", name: "Books", icon: "📚" },
  { id: "clothing", name: "Clothing", icon: "👕" },
  { id: "sports", name: "Sports", icon: "⚽" },
];

export default function NestedLayout() {
  const params = useParams();
  const location = useLocation();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Nested Routes Demo</h1>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-orange-900 mb-2">How it works</h2>
        <p className="text-orange-800 text-sm">
          Nested routes allow you to compose layouts. Each level can have its own loader, action,
          and error boundary. The URL segments map to nested components with{" "}
          <code className="bg-orange-100 px-1 rounded">&lt;Outlet /&gt;</code>.
        </p>
        <div className="mt-2 font-mono text-xs text-orange-700 bg-orange-100 p-2 rounded">
          Current path: {location.pathname}
          {params.categoryId && ` → category: ${params.categoryId}`}
          {params.itemId && ` → item: ${params.itemId}`}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Category sidebar */}
        <nav className="w-48 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Categories
          </h3>
          <ul className="space-y-1">
            {categories.map((category) => {
              const isActive = params.categoryId === category.id;
              return (
                <li key={category.id}>
                  <Link
                    to={`/demos/nested/${category.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-orange-100 text-orange-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Nested content */}
        <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-200 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
