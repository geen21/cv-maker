"use client";

import React, { useState, useRef, useEffect } from "react";
import { CVData } from "@/types/cv";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  onCvDataUpdate: (data: CVData) => void;
  cvData: CVData | null;
}

export default function ChatPanel({ onCvDataUpdate, cvData }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Paste a CV below and I'll format it into the 21Datas template.\n\nYou can also ask me to modify sections afterwards.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          currentCvData: cvData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onCvDataUpdate(data.cvData);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "CV generated — preview is on the left.\n\nYou can ask me to modify any section, e.g.:\n• Change the job title\n• Add a reference\n• Translate to English",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${data.error}`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-900">Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-lg text-[13px] leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-[#022bfe] text-white"
                  : "bg-[#f7f7f8] text-gray-700"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#f7f7f8] rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-[#022bfe] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-[#022bfe] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-[#022bfe] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-100"
      >
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste CV content or ask a modification..."
            className="flex-1 resize-none border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#022bfe] focus:border-[#022bfe] min-h-[40px] max-h-[200px] placeholder:text-gray-300"
            rows={2}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-[#022bfe] text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-30 transition-opacity self-end"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
