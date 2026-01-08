import { Suspense } from "react";
import type { Route } from "./+types/rsc-promises";
import {
  WeatherDisplay,
  StockDisplay,
  UserProfileDisplay,
  DashboardDisplay,
  DeferredContent,
} from "./rsc-promises.client";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "RSC Promise Streaming Demo | Epic RSC Stack" },
    { name: "description", content: "Passing promises from server to client components" },
  ];
}

// Simulated async data fetchers
async function fetchWeatherData(): Promise<{ temp: number; condition: string; location: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    temp: Math.floor(Math.random() * 30) + 10,
    condition: ["Sunny", "Cloudy", "Rainy", "Windy"][Math.floor(Math.random() * 4)],
    location: "San Francisco",
  };
}

async function fetchStockPrice(): Promise<{ symbol: string; price: number; change: number }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    symbol: "ACME",
    price: 150 + Math.random() * 50,
    change: (Math.random() - 0.5) * 10,
  };
}

async function fetchUserProfile(): Promise<{ name: string; avatar: string; role: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    name: "Jane Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: "Senior Engineer",
  };
}

async function fetchNotifications(): Promise<
  Array<{ id: number; title: string; unread: boolean }>
> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return [
    { id: 1, title: "New comment on your PR", unread: true },
    { id: 2, title: "Build succeeded", unread: true },
    { id: 3, title: "Team meeting in 30 min", unread: false },
  ];
}

async function fetchAnalytics(): Promise<{ views: number; clicks: number; conversions: number }> {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  return {
    views: Math.floor(Math.random() * 10000) + 5000,
    clicks: Math.floor(Math.random() * 1000) + 500,
    conversions: Math.floor(Math.random() * 100) + 50,
  };
}

// Server Component that passes promises to client components
export async function ServerComponent() {
  const serverTime = new Date().toISOString();

  // Create promises but DON'T await them - pass them directly to client components
  const weatherPromise = fetchWeatherData();
  const stockPromise = fetchStockPrice();
  const userPromise = fetchUserProfile();
  const notificationsPromise = fetchNotifications();
  const analyticsPromise = fetchAnalytics();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">RSC Promise Streaming Demo</h1>

      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-cyan-900 mb-2">How it works</h2>
        <p className="text-cyan-800 text-sm">
          Server Components can pass <strong>promises</strong> directly to Client Components. The
          client component receives the promise and uses{" "}
          <code className="bg-cyan-100 px-1 rounded">use()</code> to unwrap it. This enables
          streaming - the server sends HTML immediately while data loads in parallel.
        </p>
        <p className="text-cyan-700 text-xs mt-2">Server rendered at: {serverTime}</p>
      </div>

      {/* Single promise examples - each with typed client component */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Single Promise to Client</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-700 mb-3">Weather (1s delay)</h3>
            <Suspense fallback={<LoadingCard label="weather" />}>
              <WeatherDisplay promise={weatherPromise} />
            </Suspense>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-700 mb-3">Stock Price (1.5s delay)</h3>
            <Suspense fallback={<LoadingCard label="stock" />}>
              <StockDisplay promise={stockPromise} />
            </Suspense>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-700 mb-3">User Profile (0.8s delay)</h3>
            <Suspense fallback={<LoadingCard label="profile" />}>
              <UserProfileDisplay promise={userPromise} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Multiple promises in one component */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Multiple Promises in One Component
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          A single client component can receive multiple promises and render them as they resolve.
        </p>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardDisplay notifications={notificationsPromise} analytics={analyticsPromise} />
        </Suspense>
      </div>

      {/* Deferred content pattern */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Deferred Content Pattern</h2>
        <p className="text-sm text-gray-600 mb-4">
          Critical content renders immediately, while non-critical data streams in later.
        </p>
        <DeferredContent
          criticalData={{ title: "Dashboard", lastUpdated: serverTime }}
          deferredPromise={analyticsPromise}
        />
      </div>

      {/* Code examples */}
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Server Component</h3>
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {`// Create promise but DON'T await
const dataPromise = fetchSlowData();

// Pass promise to client component
<Suspense fallback={<Loading />}>
  <ClientComponent promise={dataPromise} />
</Suspense>`}
          </pre>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Client Component</h3>
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {`"use client";
import { use } from "react";

function ClientComponent({ promise }) {
  // use() unwraps the promise (suspends until resolved)
  const data = use(promise);
  return <div>{data.value}</div>;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// Loading components
function LoadingCard({ label }: { label: string }) {
  return (
    <div className="animate-pulse">
      <div className="h-16 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
      <p className="text-xs text-gray-400 mt-2 text-center">Loading {label}...</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div>
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Loading dashboard data...</p>
    </div>
  );
}
