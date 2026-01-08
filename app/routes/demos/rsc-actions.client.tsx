"use client";

import { useState, useTransition, useOptimistic } from "react";
import {
  incrementCounter,
  decrementCounter,
  resetCounter,
  addMessage,
  deleteMessage,
} from "./rsc-actions.server";

// Counter component using server actions with useTransition
export function Counter({ initialValue }: { initialValue: number }) {
  const [count, setCount] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  const handleIncrement = () => {
    startTransition(async () => {
      const newCount = await incrementCounter();
      setCount(newCount);
    });
  };

  const handleDecrement = () => {
    startTransition(async () => {
      const newCount = await decrementCounter();
      setCount(newCount);
    });
  };

  const handleReset = () => {
    startTransition(async () => {
      const newCount = await resetCounter();
      setCount(newCount);
    });
  };

  return (
    <div className="text-center">
      <div
        className={`text-6xl font-bold mb-6 transition-opacity ${isPending ? "opacity-50" : ""}`}
      >
        <span className="text-indigo-600">{count}</span>
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={handleDecrement}
          disabled={isPending || count === 0}
          className="w-12 h-12 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors text-xl font-bold"
        >
          -
        </button>
        <button
          onClick={handleReset}
          disabled={isPending}
          className="px-4 h-12 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleIncrement}
          disabled={isPending}
          className="w-12 h-12 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 transition-colors text-xl font-bold"
        >
          +
        </button>
      </div>
      {isPending && <p className="text-sm text-gray-500 mt-2">Updating...</p>}
    </div>
  );
}

// Message list with optimistic updates
type Message = { id: string; message: string; timestamp: string };

export function MessageList({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [isPending, startTransition] = useTransition();

  // Optimistic state for immediate feedback
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message | { type: "delete"; id: string }) => {
      if ("type" in newMessage && newMessage.type === "delete") {
        return state.filter((m) => m.id !== newMessage.id);
      }
      return [newMessage as Message, ...state];
    },
  );

  const handleSubmit = async (formData: FormData) => {
    const messageText = formData.get("message") as string;
    if (!messageText?.trim()) return;

    // Add optimistic message immediately
    const optimisticMessage: Message = {
      id: `optimistic-${Date.now()}`,
      message: messageText,
      timestamp: new Date().toISOString(),
    };

    startTransition(async () => {
      addOptimisticMessage(optimisticMessage);
      const result = await addMessage(formData);
      if ("message" in result && result.message) {
        const newMessage = result.message;
        setMessages((prev) => [newMessage, ...prev.slice(0, 9)]);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      addOptimisticMessage({ type: "delete", id });
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    });
  };

  return (
    <div>
      <form action={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          name="message"
          placeholder="Type a message..."
          required
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </form>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {optimisticMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-opacity ${
              msg.id.startsWith("optimistic") ? "bg-indigo-50 opacity-70" : "bg-gray-50"
            }`}
          >
            <div>
              <span className="text-gray-900">{msg.message}</span>
              <span className="text-gray-400 text-xs ml-2">
                {msg.id.startsWith("optimistic")
                  ? "Sending..."
                  : new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            {!msg.id.startsWith("optimistic") && (
              <button
                onClick={() => handleDelete(msg.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
        {optimisticMessages.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">No messages yet. Send one above!</p>
        )}
      </div>
    </div>
  );
}

// Form with pending state using useFormStatus (React 19)
export function SubscribeForm() {
  const [result, setResult] = useState<{ success?: boolean; email?: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;

    startTransition(async () => {
      // Simulate server action
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResult({ success: true, email });
    });
  };

  if (result?.success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
        <p className="text-green-700">
          Subscribed <strong>{result.email}</strong>
        </p>
        <button
          onClick={() => setResult(null)}
          className="mt-2 text-sm text-green-600 hover:underline"
        >
          Subscribe another
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        required
        disabled={isPending}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
