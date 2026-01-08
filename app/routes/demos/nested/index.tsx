import { Link } from "react-router";
import type { Route } from "./+types/index";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Nested Routes Demo | Epic RSC Stack" },
    { name: "description", content: "Demonstrating nested routes and dynamic parameters" },
  ];
}

export function ServerComponent() {
  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">🗂️</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Category</h2>
      <p className="text-gray-600 mb-4">
        Choose a category from the sidebar to see nested routing in action.
      </p>
      <p className="text-sm text-gray-500">
        This is the index route for <code className="bg-gray-100 px-1 rounded">/demos/nested</code>
      </p>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left">
        <h3 className="font-semibold text-gray-700 mb-2">URL Structure</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <code className="bg-gray-200 px-1 rounded">/demos/nested</code> → Index (this page)
          </li>
          <li>
            <code className="bg-gray-200 px-1 rounded">/demos/nested/:categoryId</code> → Category
            page
          </li>
          <li>
            <code className="bg-gray-200 px-1 rounded">/demos/nested/:categoryId/:itemId</code> →
            Item detail
          </li>
        </ul>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <Link
          to="/demos/nested/electronics"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Browse Electronics
        </Link>
        <Link
          to="/demos/nested/books"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Browse Books
        </Link>
      </div>
    </div>
  );
}
