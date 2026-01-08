import { Link, Outlet, useParams } from "react-router";
import type { Route } from "./+types/category";
import { data } from "react-router";

// Sample data
const categoriesData: Record<
  string,
  { name: string; description: string; items: Array<{ id: string; name: string; price: number }> }
> = {
  electronics: {
    name: "Electronics",
    description: "Gadgets and tech devices",
    items: [
      { id: "laptop", name: "MacBook Pro", price: 1999 },
      { id: "phone", name: "iPhone 15", price: 999 },
      { id: "headphones", name: "AirPods Pro", price: 249 },
      { id: "tablet", name: "iPad Air", price: 599 },
    ],
  },
  books: {
    name: "Books",
    description: "Reading materials and literature",
    items: [
      { id: "fiction", name: "The Great Gatsby", price: 15 },
      { id: "programming", name: "Clean Code", price: 45 },
      { id: "science", name: "A Brief History of Time", price: 18 },
      { id: "biography", name: "Steve Jobs", price: 25 },
    ],
  },
  clothing: {
    name: "Clothing",
    description: "Fashion and apparel",
    items: [
      { id: "shirt", name: "Cotton T-Shirt", price: 25 },
      { id: "jeans", name: "Denim Jeans", price: 79 },
      { id: "jacket", name: "Leather Jacket", price: 199 },
      { id: "shoes", name: "Running Shoes", price: 129 },
    ],
  },
  sports: {
    name: "Sports",
    description: "Athletic equipment and gear",
    items: [
      { id: "ball", name: "Soccer Ball", price: 35 },
      { id: "racket", name: "Tennis Racket", price: 159 },
      { id: "weights", name: "Dumbbell Set", price: 89 },
      { id: "yoga", name: "Yoga Mat", price: 29 },
    ],
  },
};

export function meta({ params }: Route.MetaArgs) {
  const category = categoriesData[params.categoryId];
  return [{ title: `${category?.name || "Category"} | Nested Routes Demo` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const category = categoriesData[params.categoryId];

  if (!category) {
    throw data("Category not found", { status: 404 });
  }

  return {
    categoryId: params.categoryId,
    ...category,
  };
}

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
  const { categoryId, name, description, items } = loaderData;
  const params = useParams();
  const hasItemSelected = !!params.itemId;

  return (
    <div>
      {/* Category header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/demos/nested" className="hover:text-orange-600">
            Nested
          </Link>
          <span>/</span>
          <span className="text-gray-900">{name}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className={`grid gap-4 ${hasItemSelected ? "md:grid-cols-2" : ""}`}>
        {/* Items list */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Items ({items.length})
          </h3>
          {items.map((item) => {
            const isActive = params.itemId === item.id;
            return (
              <Link
                key={item.id}
                to={`/demos/nested/${categoryId}/${item.id}`}
                className={`block p-3 rounded-lg border transition-all ${
                  isActive
                    ? "border-orange-500 bg-orange-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${isActive ? "text-orange-700" : "text-gray-900"}`}>
                    {item.name}
                  </span>
                  <span className="text-gray-600">${item.price}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Nested item detail outlet */}
        {hasItemSelected && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <Outlet />
          </div>
        )}
      </div>

      {!hasItemSelected && (
        <p className="mt-4 text-sm text-gray-500">
          Click an item to see nested route rendering with{" "}
          <code className="bg-gray-200 px-1 rounded">&lt;Outlet /&gt;</code>
        </p>
      )}
    </div>
  );
}
