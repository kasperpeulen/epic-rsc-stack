import { Form, isRouteErrorResponse, Link, useRouteError } from "react-router";
import type { Route } from "./+types/error";
import { data } from "react-router";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Error Boundary Demo | Epic RSC Stack" },
    { name: "description", content: "Demonstrating route-level error boundaries" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const errorType = url.searchParams.get("error");

  if (errorType === "loader-404") {
    throw data("Resource not found in loader", { status: 404 });
  }

  if (errorType === "loader-500") {
    throw data("Internal server error in loader", { status: 500 });
  }

  if (errorType === "loader-throw") {
    throw new Error("Unexpected error thrown in loader!");
  }

  return { loadedAt: new Date().toISOString() };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const errorType = formData.get("errorType");

  if (errorType === "action-400") {
    throw data("Bad request in action", { status: 400 });
  }

  if (errorType === "action-500") {
    throw data("Server error in action", { status: 500 });
  }

  if (errorType === "action-throw") {
    throw new Error("Unexpected error thrown in action!");
  }

  return { success: true };
}

export function ErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred.";
  let status: number | undefined;
  let statusText: string | undefined;
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    statusText = error.statusText;
    message = error.data;
    title = `${status} ${statusText}`;
  } else if (error instanceof Error) {
    message = error.message;
    stack = error.stack;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Boundary Demo</h1>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🚨</div>
          <div>
            <h2 className="text-xl font-bold text-red-900 mb-2">{title}</h2>
            <p className="text-red-700">{message}</p>
            {stack && (
              <pre className="mt-4 p-3 bg-red-100 rounded text-xs text-red-800 overflow-x-auto">
                {stack}
              </pre>
            )}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-900 mb-2">Error Caught!</h3>
        <p className="text-yellow-800 text-sm">
          This error was caught by the route&apos;s ErrorBoundary component. The rest of the app
          continues to work normally. Each route can have its own ErrorBoundary to handle errors in
          isolation.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          to="/demos/error"
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          ← Try Again
        </Link>
        <Link
          to="/demos"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back to Demos
        </Link>
      </div>
    </div>
  );
}

export default function ErrorDemo({ loaderData }: Route.ComponentProps) {
  const { loadedAt } = loaderData;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Boundary Demo</h1>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-red-900 mb-2">How it works</h2>
        <p className="text-red-800 text-sm">
          React Router v7 supports route-level error boundaries. When a{" "}
          <code className="bg-red-100 px-1 rounded">loader</code>,{" "}
          <code className="bg-red-100 px-1 rounded">action</code>, or component throws an error, the{" "}
          <code className="bg-red-100 px-1 rounded">ErrorBoundary</code> export catches it and
          renders fallback UI.
        </p>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Page loaded at: <strong>{loadedAt}</strong>
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Loader errors */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loader Errors</h3>
          <p className="text-sm text-gray-600 mb-4">
            Errors thrown in the loader function before rendering.
          </p>
          <div className="space-y-2">
            <Link
              to="/demos/error?error=loader-404"
              className="block w-full text-center px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            >
              Trigger 404 (Not Found)
            </Link>
            <Link
              to="/demos/error?error=loader-500"
              className="block w-full text-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Trigger 500 (Server Error)
            </Link>
            <Link
              to="/demos/error?error=loader-throw"
              className="block w-full text-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Throw Error Object
            </Link>
          </div>
        </div>

        {/* Action errors */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Errors</h3>
          <p className="text-sm text-gray-600 mb-4">
            Errors thrown in the action function during form submission.
          </p>
          <div className="space-y-2">
            <Form method="post">
              <input type="hidden" name="errorType" value="action-400" />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                Trigger 400 (Bad Request)
              </button>
            </Form>
            <Form method="post">
              <input type="hidden" name="errorType" value="action-500" />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Trigger 500 (Server Error)
              </button>
            </Form>
            <Form method="post">
              <input type="hidden" name="errorType" value="action-throw" />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Throw Error Object
              </button>
            </Form>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Code Example</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto">
          {`export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <div>{error.status}: {error.data}</div>;
  }

  return <div>Something went wrong</div>;
}

// In loader or action:
throw data("Not found", { status: 404 });`}
        </pre>
      </div>
    </div>
  );
}
