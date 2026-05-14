import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "../types"
import { parseCommandAI } from "./aicommandparser";
const ADMIN_PASSWORD = "maittic2024";
const HISTORY_KEY = "maittic_admin_history";

function generateId() {
  return Math.random().toString(36).slice(2);
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// Simple Markdown renderer for bold, italic, code, strikethrough, bullets
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Convert inline markdown
    let processed = line
      .replace(/~~([^~]+)~~/g, '<s class="text-slate-400">$1</s>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-violet-700 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');

    // Bullet
    if (processed.startsWith("• ")) {
      return (
        <div key={i} className="flex gap-2 text-sm text-slate-700">
          <span className="text-violet-400 mt-0.5 shrink-0">•</span>
          <span dangerouslySetInnerHTML={{ __html: processed.slice(2) }} />
        </div>
      );
    }

    // Numbered
    if (/^\d+\./.test(processed)) {
      return (
        <div key={i} className="flex gap-2 text-sm text-slate-700">
          <span dangerouslySetInnerHTML={{ __html: processed }} />
        </div>
      );
    }

    // Empty line
    if (processed.trim() === "") return <div key={i} className="h-1" />;

    return (
      <div
        key={i}
        className="text-sm text-slate-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: processed }}
      />
    );
  });
}

const QUICK_COMMANDS = [
  { label: "📊 Stats", cmd: "stats" },
  { label: "📦 List Products", cmd: "list products" },
  { label: "🏪 List Stores", cmd: "list stores" },
  { label: "🗂️ Categories", cmd: "list categories" },
  { label: "👁️ Most Viewed", cmd: "stats most viewed" },
  { label: "📉 Price Drops", cmd: "stats price drops" },
  { label: "🆕 Recent", cmd: "stats recent" },
  { label: "❓ Help", cmd: "help" },
];

export default function AdminChat() {
  const [authed, setAuthed] = useState(() => {
    return sessionStorage.getItem("maittic_admin_authed") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = sessionStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
      }
    } catch { /* ignore */ }
    return [];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist chat history
  useEffect(() => {
    if (authed) {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages, authed]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Welcome message
  useEffect(() => {
    if (authed && messages.length === 0) {
      pushBot({
        type: "info",
        content: `**👋 Welcome to MaitTic Admin Console**

I can help you manage your price comparison website. Here's what you can do:

• Add / update / delete products
• Manage stores and categories
• View stats and analytics

Type \`help\` for all available commands or use the quick buttons below.`,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  function pushBot(partial: Omit<ChatMessage, "id" | "timestamp" | "role">) {
    const msg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      timestamp: new Date(),
      ...partial,
    };
    setMessages((prev) => [...prev, msg]);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("maittic_admin_authed", "true");
      setAuthed(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
      setPasswordInput("");
    }
  }

  const handleSend = useCallback(
    (text?: string) => {
      const cmd = (text ?? input).trim();
      if (!cmd) return;

      const handleSend = useCallback(
    async (text?: string) => {
      ...
      setIsTyping(true);
      const result = await parseCommandAI(cmd);
      const botMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        timestamp: new Date(),
        ...result,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    },
    [input]
  );
      setMessages((prev) => [...prev, userMsg]);
      setCmdHistory((prev) => [cmd, ...prev.slice(0, 49)]);
      setHistoryIdx(-1);
      setInput("");

      setIsTyping(true);
      setTimeout(() => {
        const result = parseCommand(cmd);
        const botMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          timestamp: new Date(),
          ...result,
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 400);
    },
    [input]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(nextIdx);
      setInput(cmdHistory[nextIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(nextIdx);
      setInput(nextIdx === -1 ? "" : cmdHistory[nextIdx]);
    }
  }

  function clearHistory() {
    setMessages([]);
    sessionStorage.removeItem(HISTORY_KEY);
    setTimeout(() => {
      pushBot({
        type: "info",
        content: "🧹 Chat history cleared. Type `help` to get started.",
      });
    }, 100);
  }

  function handleLogout() {
    sessionStorage.removeItem("maittic_admin_authed");
    sessionStorage.removeItem(HISTORY_KEY);
    setAuthed(false);
    setMessages([]);
  }

  // ---- Login Screen ----
  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center p-4">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Lock icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-violet-500/20 border border-violet-500/40 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">Admin Console</h1>
              <p className="text-slate-400 text-sm">MaitTic • Restricted Access</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password..."
                    autoFocus
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {passwordError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl py-3 transition-all duration-200 shadow-lg shadow-violet-900/50 hover:shadow-violet-700/50"
              >
                Enter Console
              </button>
            </form>

            <p className="text-center text-slate-600 text-xs mt-6">
              🔒 This area is restricted to administrators only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---- Chat UI ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex flex-col">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/50">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-none">MaitTic Admin</h1>
            <p className="text-violet-400 text-xs mt-0.5">Chat Console</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Live</span>
          </div>
          <button
            onClick={clearHistory}
            title="Clear history"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </button>
          <a
            href="/"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
            title="Back to site"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </a>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative z-10">
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <p className="text-slate-400 text-sm">Loading console…</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <div className="flex items-end gap-3">
            <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-900/50">
              <span className="text-sm">🤖</span>
            </div>
            <div className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick Commands */}
      <div className="relative z-10 px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_COMMANDS.map((qc) => (
            <button
              key={qc.cmd}
              onClick={() => handleSend(qc.cmd)}
              className="shrink-0 text-xs bg-white/5 hover:bg-violet-600/30 border border-white/10 hover:border-violet-500/50 text-slate-300 hover:text-white rounded-full px-3 py-1.5 transition-all whitespace-nowrap"
            >
              {qc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10 px-4 pb-6 pt-2">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-3 px-4 py-3 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
          <span className="text-violet-400 font-mono text-sm shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command… (↑↓ for history)"
            className="flex-1 bg-transparent text-white placeholder-slate-600 text-sm focus:outline-none font-mono"
            autoFocus
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-8 h-8 bg-violet-600 hover:bg-violet-500 disabled:bg-white/10 disabled:text-slate-600 rounded-xl flex items-center justify-center text-white transition-all shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <p className="text-center text-slate-700 text-xs mt-2">
          Press Enter to send • ↑/↓ navigate history • Type <code className="text-violet-600">help</code> for all commands
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex items-end gap-3 flex-row-reverse">
        <div className="w-8 h-8 bg-slate-600 rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        </div>
        <div className="bg-violet-600 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-lg shadow-lg shadow-violet-900/30">
          <p className="text-white text-sm font-mono">{message.content}</p>
          <p className="text-violet-300 text-xs mt-1 text-right">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    );
  }

  const borderColor =
    message.type === "success"
      ? "border-emerald-500/30"
      : message.type === "error"
      ? "border-red-500/30"
      : "border-white/10";

  const headerColor =
    message.type === "success"
      ? "bg-emerald-500/10"
      : message.type === "error"
      ? "bg-red-500/10"
      : "bg-white/5";

  const headerIcon =
    message.type === "success" ? (
      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    ) : message.type === "error" ? (
      <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ) : null;

  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-900/50">
        <span className="text-sm">🤖</span>
      </div>
      <div
        className={`bg-white/5 backdrop-blur-sm border ${borderColor} rounded-2xl rounded-bl-sm max-w-2xl overflow-hidden shadow-lg`}
      >
        {(message.type === "success" || message.type === "error") && (
          <div className={`flex items-center gap-2 px-4 py-2 ${headerColor} border-b border-white/5`}>
            {headerIcon}
            <span className={`text-xs font-semibold uppercase tracking-wide ${message.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
              {message.type === "success" ? "Success" : "Error"}
            </span>
          </div>
        )}
        <div className="px-4 py-3 space-y-1">
          {renderMarkdown(message.content)}
        </div>
        <div className="px-4 pb-2">
          <p className="text-slate-600 text-xs">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    </div>
  );
}
