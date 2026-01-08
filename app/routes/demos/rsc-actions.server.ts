"use server";

// Server actions - these run on the server and can be imported by client components

let counterValue = 0;
const messages: Array<{ id: string; message: string; timestamp: string }> = [];

export async function incrementCounter() {
  // Simulate database latency
  await new Promise((resolve) => setTimeout(resolve, 200));
  counterValue++;
  return counterValue;
}

export async function decrementCounter() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  counterValue = Math.max(0, counterValue - 1);
  return counterValue;
}

export async function resetCounter() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  counterValue = 0;
  return counterValue;
}

export async function getCounter() {
  return counterValue;
}

export async function addMessage(formData: FormData) {
  const message = formData.get("message") as string;
  if (!message?.trim()) {
    return { error: "Message is required" };
  }

  await new Promise((resolve) => setTimeout(resolve, 150));

  const newMessage = {
    id: crypto.randomUUID(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
  };

  messages.unshift(newMessage);
  // Keep only last 10 messages
  if (messages.length > 10) messages.pop();

  return { success: true, message: newMessage };
}

export async function getMessages() {
  return [...messages];
}

export async function deleteMessage(id: string) {
  const index = messages.findIndex((m) => m.id === id);
  if (index !== -1) {
    messages.splice(index, 1);
  }
  return { success: true };
}

// Simulated slow data fetch
export async function fetchUserStats() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    totalUsers: 1234,
    activeToday: 456,
    newThisWeek: 78,
  };
}

export async function fetchRecentActivity() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return [
    { id: 1, action: "User signup", user: "alice@example.com", time: "2 min ago" },
    { id: 2, action: "Purchase completed", user: "bob@example.com", time: "5 min ago" },
    { id: 3, action: "Comment added", user: "carol@example.com", time: "12 min ago" },
    { id: 4, action: "Profile updated", user: "david@example.com", time: "1 hour ago" },
  ];
}
