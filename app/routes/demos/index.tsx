import { Link } from "react-router";
import type { Route } from "./+types/index";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "React Router Demos | Epic RSC Stack" },
    { name: "description", content: "Explore React Router v7 features with RSC" },
  ];
}

const routerFeatures = [
  {
    title: "Server Loader",
    description:
      "Fetch data on the server before rendering. Data is serialized and passed to components.",
    path: "/demos/loader",
    color: "bg-blue-500",
  },
  {
    title: "Server Action (Form)",
    description:
      "Handle form submissions with server-side actions. Automatic revalidation after mutations.",
    path: "/demos/action",
    color: "bg-green-500",
  },
  {
    title: "Client-Only (non-RSC)",
    description: "Routes that run entirely in the browser using clientLoader and clientAction.",
    path: "/demos/client",
    color: "bg-purple-500",
  },
  {
    title: "Nested Routes",
    description: "Build complex layouts with nested routes and dynamic parameters.",
    path: "/demos/nested",
    color: "bg-orange-500",
  },
  {
    title: "Error Boundary",
    description: "Gracefully handle errors with route-level error boundaries.",
    path: "/demos/error",
    color: "bg-red-500",
  },
];

const rscFeatures = [
  {
    title: "Server Actions",
    description:
      'Functions marked with "use server" that run on the server. useTransition, useOptimistic, and more.',
    path: "/demos/rsc-actions",
    color: "bg-indigo-500",
  },
  {
    title: "Promise Streaming",
    description:
      "Pass promises from Server to Client Components. Use the use() hook to unwrap them with Suspense.",
    path: "/demos/rsc-promises",
    color: "bg-cyan-500",
  },
];

export function ServerComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">React Router v7 + RSC Demos</h1>
      <p className="text-gray-600 mb-8">
        Explore the features of React Router v7 with React Server Components. Each demo showcases
        different capabilities of the framework.
      </p>

      {/* React Router Section */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wider mb-4">
          React Router Features
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {routerFeatures.map((feature) => (
            <FeatureCard key={feature.path} {...feature} />
          ))}
        </div>
      </section>

      {/* RSC Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wider mb-4">
          React Server Components
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {rscFeatures.map((feature) => (
            <FeatureCard key={feature.path} {...feature} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  path,
  color,
}: {
  title: string;
  description: string;
  path: string;
  color: string;
}) {
  return (
    <Link
      to={path}
      className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
    >
      <div className="flex items-start gap-4">
        <div className={`${color} w-2 h-full min-h-[60px] rounded-full`} />
        <div>
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}
