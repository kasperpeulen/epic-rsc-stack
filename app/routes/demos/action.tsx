import { Form, useNavigation } from "react-router";
import type { Route } from "./+types/action";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Server Action Demo | Epic RSC Stack" },
    { name: "description", content: "Demonstrating server-side form actions" },
  ];
}

// In-memory storage (resets on server restart)
let todos: Array<{ id: string; text: string; completed: boolean; createdAt: string }> = [
  { id: "1", text: "Learn React Router v7", completed: true, createdAt: new Date().toISOString() },
  {
    id: "2",
    text: "Build something awesome",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

// Server loader - provides initial data
export async function loader() {
  return { todos: [...todos] };
}

// Server action - handles form submissions
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add") {
    const text = formData.get("text");
    if (typeof text === "string" && text.trim()) {
      todos.push({
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      });
    }
    return { success: true, action: "added" };
  }

  if (intent === "toggle") {
    const id = formData.get("id");
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
    return { success: true, action: "toggled" };
  }

  if (intent === "delete") {
    const id = formData.get("id");
    todos = todos.filter((t) => t.id !== id);
    return { success: true, action: "deleted" };
  }

  if (intent === "clear-completed") {
    todos = todos.filter((t) => !t.completed);
    return { success: true, action: "cleared" };
  }

  return { success: false, error: "Unknown action" };
}

export default function ActionDemo({ loaderData }: Route.ComponentProps) {
  const { todos } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Server Action Demo</h1>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-green-900 mb-2">How it works</h2>
        <p className="text-green-800 text-sm">
          The <code className="bg-green-100 px-1 rounded">action</code> function handles form
          submissions on the server. After the action completes, the loader automatically reruns to
          fetch fresh data. The UI updates without a full page reload.
        </p>
      </div>

      {/* Add todo form */}
      <Form method="post" className="mb-6">
        <input type="hidden" name="intent" value="add" />
        <div className="flex gap-2">
          <input
            type="text"
            name="text"
            placeholder="What needs to be done?"
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Todo"}
          </button>
        </div>
      </Form>

      {/* Stats */}
      <div className="flex gap-4 mb-4 text-sm text-gray-600">
        <span>{pendingCount} pending</span>
        <span>{completedCount} completed</span>
        {completedCount > 0 && (
          <Form method="post" className="inline">
            <input type="hidden" name="intent" value="clear-completed" />
            <button type="submit" className="text-red-600 hover:text-red-700 underline">
              Clear completed
            </button>
          </Form>
        )}
      </div>

      {/* Todo list */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {todos.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">No todos yet. Add one above!</div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
              {/* Toggle form */}
              <Form method="post">
                <input type="hidden" name="intent" value="toggle" />
                <input type="hidden" name="id" value={todo.id} />
                <button
                  type="submit"
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 hover:border-green-500"
                  }`}
                >
                  {todo.completed && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              </Form>

              {/* Todo text */}
              <span
                className={`flex-1 ${todo.completed ? "line-through text-gray-400" : "text-gray-900"}`}
              >
                {todo.text}
              </span>

              {/* Delete form */}
              <Form method="post">
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value={todo.id} />
                <button
                  type="submit"
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete todo"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </Form>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Code Example</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto">
          {`export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  await db.todo.create({ text: formData.get("text") });
  return { success: true };
}

// Form automatically triggers action and revalidates loader
<Form method="post">
  <input name="text" />
  <button type="submit">Add</button>
</Form>`}
        </pre>
      </div>
    </div>
  );
}
