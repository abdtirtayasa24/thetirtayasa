const CHAT_SESSION_STORAGE_KEY = "tirtayasa-ai-session-id";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function hasBrowserStorage() {
  return typeof globalThis.localStorage !== "undefined";
}

export function getStoredChatSessionId(): string | null {
  if (!hasBrowserStorage()) {
    return null;
  }

  const sessionId = globalThis.localStorage.getItem(CHAT_SESSION_STORAGE_KEY);
  if (!sessionId || !UUID_RE.test(sessionId)) {
    return null;
  }

  return sessionId;
}

export function storeChatSessionId(sessionId: string): void {
  if (!hasBrowserStorage() || !UUID_RE.test(sessionId)) {
    return;
  }

  globalThis.localStorage.setItem(CHAT_SESSION_STORAGE_KEY, sessionId);
}
