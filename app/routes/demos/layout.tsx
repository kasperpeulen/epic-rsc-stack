import { Link, Outlet, useLocation } from "react-router";

const demoCategories = [
  {
    label: "Overview",
    items: [{ path: "/demos", label: "All Demos" }],
  },
  {
    label: "React Router",
    items: [
      { path: "/demos/loader", label: "Server Loader" },
      { path: "/demos/action", label: "Server Action (Form)" },
      { path: "/demos/client", label: "Client-Only (non-RSC)" },
      { path: "/demos/nested", label: "Nested Routes" },
      { path: "/demos/error", label: "Error Boundary" },
    ],
  },
  {
    label: "React Server Components",
    items: [
      { path: "/demos/rsc-actions", label: "Server Actions" },
      { path: "/demos/rsc-promises", label: "Promise Streaming" },
    ],
  },
];

export default function DemosLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Epic RSC Stack
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Demos</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <nav className="w-64 flex-shrink-0">
            {demoCategories.map((category) => (
              <div key={category.label} className="mb-6">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {category.label}
                </h3>
                <ul className="space-y-1">
                  {category.items.map((demo) => {
                    const isActive =
                      demo.path === "/demos"
                        ? location.pathname === "/demos"
                        : location.pathname.startsWith(demo.path);
                    return (
                      <li key={demo.path}>
                        <Link
                          to={demo.path}
                          className={`block px-4 py-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {demo.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
