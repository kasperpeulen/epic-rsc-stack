"use client";

import { Form, useNavigation } from "react-router";
import { useState, useEffect } from "react";
import type { Route } from "./+types/client";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Client-Only Demo | Epic RSC Stack" },
    { name: "description", content: "Demonstrating client-side data loading (non-RSC)" },
  ];
}

// This tells React Router this route runs entirely on the client
export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  // Simulate API call from the browser
  await new Promise((resolve) => setTimeout(resolve, 300));

  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  // Fetch from a public API (runs in browser)
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${query || "react"}&per_page=10`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }

  const data = await response.json();

  return {
    repositories: data.items || [],
    totalCount: data.total_count || 0,
    query,
    loadedAt: new Date().toISOString(),
    isClient: true, // Proves this ran in browser
  };
};

// Mark that we don't have a server loader, so hydration waits for client
clientLoader.hydrate = true as const;

// Client action for form submissions
export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const formData = await request.formData();
  const repoUrl = formData.get("repo") as string;

  // In a real app, this might save to localStorage or call an API
  const starred = JSON.parse(localStorage.getItem("starred-repos") || "[]");

  if (starred.includes(repoUrl)) {
    const updated = starred.filter((r: string) => r !== repoUrl);
    localStorage.setItem("starred-repos", JSON.stringify(updated));
    return { action: "unstarred", repo: repoUrl };
  } else {
    starred.push(repoUrl);
    localStorage.setItem("starred-repos", JSON.stringify(starred));
    return { action: "starred", repo: repoUrl };
  }
};

// Shows while clientLoader is running
export function HydrateFallback() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}

export default function ClientDemo({ loaderData }: Route.ComponentProps) {
  const { repositories, totalCount, query, loadedAt, isClient } = loaderData;
  const navigation = useNavigation();
  const isSearching = navigation.state === "loading";

  const [starredRepos, setStarredRepos] = useState<string[]>([]);

  // Load starred repos from localStorage
  useEffect(() => {
    const starred = JSON.parse(localStorage.getItem("starred-repos") || "[]");
    setStarredRepos(starred);
  }, []);

  const toggleStar = (repoUrl: string) => {
    setStarredRepos((prev) =>
      prev.includes(repoUrl) ? prev.filter((r) => r !== repoUrl) : [...prev, repoUrl],
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Client-Only Demo (non-RSC)</h1>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-purple-900 mb-2">How it works</h2>
        <p className="text-purple-800 text-sm">
          This route uses <code className="bg-purple-100 px-1 rounded">clientLoader</code> instead
          of <code className="bg-purple-100 px-1 rounded">loader</code>. All data fetching happens
          in the browser, not on the server. This is useful for:
        </p>
        <ul className="list-disc list-inside text-purple-800 text-sm mt-2 space-y-1">
          <li>Accessing browser-only APIs (localStorage, geolocation)</li>
          <li>Calling APIs that require client credentials</li>
          <li>SPA-style behavior without server rendering</li>
        </ul>
        <p className="text-purple-800 text-sm mt-2">
          Data loaded at: <strong>{loadedAt}</strong> {isClient && "(in browser)"}
        </p>
      </div>

      {/* Search form */}
      <Form method="get" className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search GitHub repositories..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </Form>

      {/* Results count */}
      <p className="text-sm text-gray-600 mb-4">
        {totalCount.toLocaleString()} repositories found for &quot;{query || "react"}&quot;
      </p>

      {/* Repository list */}
      <div className="space-y-3">
        {repositories.map((repo: any) => (
          <div
            key={repo.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-purple-600 hover:underline"
                >
                  {repo.full_name}
                </a>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {repo.description || "No description"}
                </p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                      {repo.language}
                    </span>
                  )}
                  <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
                  <span>🍴 {repo.forks_count.toLocaleString()}</span>
                </div>
              </div>
              {/* Star button - uses clientAction */}
              <Form method="post" onSubmit={() => toggleStar(repo.html_url)}>
                <input type="hidden" name="repo" value={repo.html_url} />
                <button
                  type="submit"
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    starredRepos.includes(repo.html_url)
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {starredRepos.includes(repo.html_url) ? "★ Saved" : "☆ Save"}
                </button>
              </Form>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Code Example</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto">
          {`// Client-only loader (runs in browser)
export const clientLoader = async ({ request }) => {
  const data = await fetch("https://api.example.com/data");
  return { items: await data.json() };
};

// Shows during client-side loading
export function HydrateFallback() {
  return <Loading />;
}

// clientLoader.hydrate tells React Router to wait for client
clientLoader.hydrate = true;`}
        </pre>
      </div>
    </div>
  );
}
