import { Suspense } from "react";
import type { Route } from "./+types/rsc-actions";
import { Counter, MessageList, SubscribeForm } from "./rsc-actions.client";
import { getCounter, getMessages, fetchUserStats, fetchRecentActivity } from "./rsc-actions.server";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "RSC Server Actions Demo | Epic RSC Stack" },
    { name: "description", content: "React Server Components with server actions" },
  ];
}

// Main Server Component
export async function ServerComponent() {
  // Fetch initial data on the server
  const [initialCount, initialMessages] = await Promise.all([getCounter(), getMessages()]);

  const serverTime = new Date().toISOString();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">RSC Server Actions Demo</h1>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-indigo-900 mb-2">How it works</h2>
        <p className="text-indigo-800 text-sm">
          Server Actions are async functions marked with{" "}
          <code className="bg-indigo-100 px-1 rounded">&quot;use server&quot;</code>. They run on
          the server and can be called from client components. This page was server-rendered at{" "}
          <strong>{serverTime}</strong>.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Counter with Server Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Counter with useTransition</h3>
          <p className="text-sm text-gray-600 mb-4">
            Server actions with <code className="bg-gray-100 px-1 rounded">useTransition</code> for
            non-blocking updates.
          </p>
          <Counter initialValue={initialCount} />
        </div>

        {/* Subscribe Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Form with Pending State</h3>
          <p className="text-sm text-gray-600 mb-4">
            Forms can show pending state while the server action processes.
          </p>
          <SubscribeForm />
        </div>
      </div>

      {/* Message List with Optimistic Updates */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Optimistic Updates with useOptimistic
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Messages appear instantly using{" "}
          <code className="bg-gray-100 px-1 rounded">useOptimistic</code>, then sync with the
          server.
        </p>
        <MessageList initialMessages={initialMessages} />
      </div>

      {/* Async Server Components with Suspense */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Streaming with Suspense</h2>
        <p className="text-sm text-gray-600 mb-4">
          Async server components stream their content as data becomes available. Each section loads
          independently.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <Suspense fallback={<StatsLoadingSkeleton />}>
            <UserStatsCard />
          </Suspense>

          <Suspense fallback={<ActivityLoadingSkeleton />}>
            <RecentActivityCard />
          </Suspense>
        </div>
      </div>

      {/* Code Examples */}
      <div className="mt-6 space-y-4">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">
            Server Action (rsc-actions.server.ts)
          </h3>
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {`"use server";

export async function incrementCounter() {
  await db.counter.increment();
  return await db.counter.get();
}`}
          </pre>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">
            Client Component (rsc-actions.client.tsx)
          </h3>
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {`"use client";
import { useTransition } from "react";
import { incrementCounter } from "./rsc-actions.server";

export function Counter({ initialValue }) {
  const [count, setCount] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const newCount = await incrementCounter();
      setCount(newCount);
    });
  };

  return <button onClick={handleClick}>{count}</button>;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// Async Server Component - fetches slow data
async function UserStatsCard() {
  const stats = await fetchUserStats();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-indigo-600">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Users</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{stats.activeToday}</div>
          <div className="text-sm text-gray-500">Active Today</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-600">{stats.newThisWeek}</div>
          <div className="text-sm text-gray-500">New This Week</div>
        </div>
      </div>
    </div>
  );
}

// Another async server component
async function RecentActivityCard() {
  const activity = await fetchRecentActivity();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activity.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <div>
              <span className="font-medium text-gray-900">{item.action}</span>
              <span className="text-gray-500 ml-2">{item.user}</span>
            </div>
            <span className="text-gray-400">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading skeletons
function StatsLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Loading stats (1.5s)...</p>
    </div>
  );
}

function ActivityLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Loading activity (2s)...</p>
    </div>
  );
}
