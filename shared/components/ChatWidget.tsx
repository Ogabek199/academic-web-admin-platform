"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, isMinimized, sent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !surname.trim() || !telegramUsername.trim()) {
      setError("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/telegram/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim() || "Admin panelga kirish so'rovi",
          name: name.trim(),
          surname: surname.trim(),
          telegramUsername: telegramUsername.trim(),
          isAdminRequest: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Xatolik xabarlarini yaxshiroq ko'rsatish
        let errorMessage = data.error || "Xabar yuborishda xatolik";
        
        if (data.hint) {
          errorMessage += `\n\n💡 Maslahat: ${data.hint}`;
        }
        
        if (data.details) {
          console.error('Telegram API error details:', data.details);
        }
        
        throw new Error(errorMessage);
      }

      setSent(true);
      setMessage("");
      setName("");
      setSurname("");
      setTelegramUsername("");

      // 3 soniyadan keyin yana yozish imkoniyatini berish
      setTimeout(() => {
        setSent(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Xabar yuborishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 hover:shadow-blue-500/50 animate-pulse"
        aria-label="Chatni ochish"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isMinimized
          ? "w-80 h-16"
          : "w-96 h-[600px] max-h-[80vh]"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <h3 className="font-bold text-lg">Biz bilan bog'laning</h3>
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
                setSent(false);
                setError("");
                setName("");
                setSurname("");
                setTelegramUsername("");
                setMessage("");
              }}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
              {sent ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                    <div className="text-green-600 font-semibold mb-2">
                      ✅ Xabar muvaffaqiyatli yuborildi!
                    </div>
                    <p className="text-sm text-gray-600">
                      Tez orada javob beramiz. Rahmat!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        🤖
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          Salom! 👋
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                          Admin panelga kirish uchun quyidagi ma'lumotlarni to'ldiring. 
                          Sizga Telegram orqali parol yuboriladi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Form */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 space-y-2">
                    <div className="font-semibold">{error.split('\n')[0]}</div>
                    {error.includes('💡') && (
                      <div className="text-xs text-red-500 whitespace-pre-line mt-2">
                        {error.split('💡')[1]?.trim()}
                      </div>
                    )}
                    {error.includes('setupUrl') && (
                      <a
                        href="https://api.telegram.org/botAAHAlsF9mbuovyvNZiMta7KXSqbKAO5fa3Q/getUpdates"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs block mt-2"
                      >
                        🔗 Chat ID'ni ko'rish
                      </a>
                    )}
                  </div>
                )}

                  <Input
                    type="text"
                  placeholder="Ismingiz *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-sm"
                    disabled={loading || sent}
                  required
                />
                <Input
                  type="text"
                  placeholder="Familiyangiz *"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="text-sm"
                  disabled={loading || sent}
                  required
                  />
                  <Input
                  type="text"
                  placeholder="Telegram username (@username) *"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                    className="text-sm"
                    disabled={loading || sent}
                  required
                  />
                  <Input
                    type="text"
                  placeholder="Xabar (ixtiyoriy)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  className="text-sm"
                    disabled={loading || sent}
                  />
                  <Button
                    type="submit"
                  disabled={loading || sent || !name.trim() || !surname.trim() || !telegramUsername.trim()}
                  className="w-full flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      So'rov yuborish
                    </>
                    )}
                  </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

