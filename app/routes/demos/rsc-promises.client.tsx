"use client";

import { use, Suspense, useState } from "react";

// Types for the data
type WeatherData = { temp: number; condition: string; location: string };
type StockData = { symbol: string; price: number; change: number };
type UserProfile = { name: string; avatar: string; role: string };
type Notification = { id: number; title: string; unread: boolean };
type Analytics = { views: number; clicks: number; conversions: number };

// Weather display component
export function WeatherDisplay({ promise }: { promise: Promise<WeatherData> }) {
  const data = use(promise);

  return (
    <div className="text-center">
      <div className="text-4xl mb-2">
        {data.condition === "Sunny" && "☀️"}
        {data.condition === "Cloudy" && "☁️"}
        {data.condition === "Rainy" && "🌧️"}
        {data.condition === "Windy" && "💨"}
      </div>
      <div className="text-2xl font-bold text-gray-900">{data.temp}°C</div>
      <div className="text-sm text-gray-500">{data.location}</div>
    </div>
  );
}

// Stock display component
export function StockDisplay({ promise }: { promise: Promise<StockData> }) {
  const data = use(promise);

  return (
    <div className="text-center">
      <div className="text-sm text-gray-500">{data.symbol}</div>
      <div className="text-2xl font-bold text-gray-900">${data.price.toFixed(2)}</div>
      <div className={`text-sm ${data.change >= 0 ? "text-green-600" : "text-red-600"}`}>
        {data.change >= 0 ? "▲" : "▼"} {Math.abs(data.change).toFixed(2)}%
      </div>
    </div>
  );
}

// User profile display component
export function UserProfileDisplay({ promise }: { promise: Promise<UserProfile> }) {
  const data = use(promise);

  return (
    <div className="flex items-center gap-3">
      <img src={data.avatar} alt={data.name} className="w-12 h-12 rounded-full bg-gray-200" />
      <div>
        <div className="font-medium text-gray-900">{data.name}</div>
        <div className="text-sm text-gray-500">{data.role}</div>
      </div>
    </div>
  );
}

// Dashboard with multiple promises
export function DashboardDisplay({
  notifications,
  analytics,
}: {
  notifications: Promise<Notification[]>;
  analytics: Promise<Analytics>;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Notifications section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Notifications (2s)</h3>
          <Suspense fallback={<NotificationsLoading />}>
            <NotificationsList promise={notifications} />
          </Suspense>
        </div>

        {/* Analytics section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Analytics (2.5s)</h3>
          <Suspense fallback={<AnalyticsLoading />}>
            <AnalyticsDisplay promise={analytics} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function NotificationsList({ promise }: { promise: Promise<Notification[]> }) {
  const notifications = use(promise);

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 rounded-lg ${notification.unread ? "bg-blue-50 border-l-4 border-blue-500" : "bg-gray-50"}`}
        >
          <div className="flex items-center gap-2">
            {notification.unread && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
            <span className={notification.unread ? "font-medium text-gray-900" : "text-gray-600"}>
              {notification.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsDisplay({ promise }: { promise: Promise<Analytics> }) {
  const analytics = use(promise);

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{analytics.views.toLocaleString()}</div>
        <div className="text-xs text-gray-500">Views</div>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">{analytics.clicks.toLocaleString()}</div>
        <div className="text-xs text-gray-500">Clicks</div>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">{analytics.conversions}</div>
        <div className="text-xs text-gray-500">Conversions</div>
      </div>
    </div>
  );
}

function NotificationsLoading() {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  );
}

function AnalyticsLoading() {
  return (
    <div className="grid grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  );
}

// Deferred content pattern - critical data renders immediately, deferred streams in
export function DeferredContent({
  criticalData,
  deferredPromise,
}: {
  criticalData: { title: string; lastUpdated: string };
  deferredPromise: Promise<Analytics>;
}) {
  const [showAnalytics, setShowAnalytics] = useState(true);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Critical content - renders immediately */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{criticalData.title}</h3>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(criticalData.lastUpdated).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            {showAnalytics ? "Hide" : "Show"} Analytics
          </button>
        </div>
        <p className="mt-4 text-gray-600">
          This critical content rendered immediately on the server. The analytics section below
          streams in after a 2.5 second delay.
        </p>
      </div>

      {/* Deferred content - streams in later */}
      {showAnalytics && (
        <div className="p-6 bg-gray-50">
          <Suspense
            fallback={
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Streaming analytics data...
                </p>
              </div>
            }
          >
            <DeferredAnalytics promise={deferredPromise} />
          </Suspense>
        </div>
      )}
    </div>
  );
}

function DeferredAnalytics({ promise }: { promise: Promise<Analytics> }) {
  const analytics = use(promise);

  return (
    <div>
      <h4 className="font-medium text-gray-700 mb-4">Analytics Overview</h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-3xl font-bold text-blue-600">{analytics.views.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Page Views</div>
          <div className="text-xs text-green-600 mt-1">↑ 12% vs last week</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-3xl font-bold text-green-600">
            {analytics.clicks.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">Clicks</div>
          <div className="text-xs text-green-600 mt-1">↑ 8% vs last week</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-3xl font-bold text-purple-600">{analytics.conversions}</div>
          <div className="text-sm text-gray-500 mt-1">Conversions</div>
          <div className="text-xs text-red-600 mt-1">↓ 3% vs last week</div>
        </div>
      </div>
    </div>
  );
}
