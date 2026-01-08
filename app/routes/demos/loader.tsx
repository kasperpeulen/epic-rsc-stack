import type { Route } from "./+types/loader";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Server Loader Demo | Epic RSC Stack" },
    { name: "description", content: "Demonstrating server-side data loading" },
  ];
}

// Server loader - runs on the server before rendering
export async function loader({ request }: Route.LoaderArgs) {
  // Simulate database/API call
  await new Promise((resolve) => setTimeout(resolve, 100));

  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q") || "";

  // Sample data - in real app this would come from database
  const allUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    { id: 3, name: "Carol Williams", email: "carol@example.com", role: "Editor" },
    { id: 4, name: "David Brown", email: "david@example.com", role: "User" },
    { id: 5, name: "Eva Martinez", email: "eva@example.com", role: "Admin" },
  ];

  const users = searchQuery
    ? allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allUsers;

  return {
    users,
    searchQuery,
    loadedAt: new Date().toISOString(),
    serverInfo: {
      nodeVersion: process.version,
      platform: process.platform,
    },
  };
}

export default function LoaderDemo({ loaderData }: Route.ComponentProps) {
  const { users, searchQuery, loadedAt, serverInfo } = loaderData;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Server Loader Demo</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-blue-900 mb-2">How it works</h2>
        <p className="text-blue-800 text-sm">
          The <code className="bg-blue-100 px-1 rounded">loader</code> function runs on the server
          before rendering. Data is automatically serialized and passed to the component. This page
          was loaded at <strong>{loadedAt}</strong> on Node {serverInfo.nodeVersion} (
          {serverInfo.platform}).
        </p>
      </div>

      {/* Search form - uses GET to update URL params */}
      <form method="get" className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search users..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.role === "Admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "Editor"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No users found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Code Example</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto">
          {`export async function loader({ request }: Route.LoaderArgs) {
  const users = await db.user.findMany();
  return { users };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <UserList users={loaderData.users} />;
}`}
        </pre>
      </div>
    </div>
  );
}
