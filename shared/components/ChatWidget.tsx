"use client";

import { useState } from "react";
import { MessageCircle, X, Minimize2, Send, MessageCircleMore } from "lucide-react";

const TELEGRAM_USERNAME = "otaxonov_o17";
const TELEGRAM_LINK = `https://t.me/${TELEGRAM_USERNAME}`;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#2563EB] rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 hover:shadow-blue-500/50 animate-pulse"
        aria-label="Chatni ochish"
      >
        <MessageCircleMore className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isMinimized
          ? "w-80 h-16"
          : "w-96 h-[320px] max-h-[80vh]"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <div>
              <h3 className="font-bold text-lg">Biz bilan bog{"'"}laning</h3>
              <p className="text-xs text-white/80">Tezkor javob beramiz</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label={isMinimized ? "Kattalashtirish" : "Kichiklashtirish"}
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsMinimized(false);
              }}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center text-center">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Savollaringiz bo{"'"}lsa yoki takliflaringiz bo{"'"}lsa Telegram orqali yozing. Tez orada javob beramiz.
              </p>
            </div>
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0088cc] hover:bg-[#0077b5] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="w-5 h-5" />
              Telegram orqali bog{"'"}laning
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
