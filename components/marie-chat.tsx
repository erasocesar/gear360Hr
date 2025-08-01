"use client"

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, X, ArrowRight } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "marie";
  timestamp: Date;
}

interface MarieChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MarieChat({ isOpen, onClose }: MarieChatProps) {
  /**
   * 👉  Un solo `sessionId` por montaje.
   * Si el usuario refresca la página, React se monta de nuevo y
   * se crea otro id (nueva conversación).
   */
  const [sessionId] = useState<string>(() => `gear360hr_${Date.now()}`);

  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: "¡Hola! Soy Marie, tu asistente virtual de Gear360hr. ¿En qué puedo ayudarte hoy? Puedo ayudarte con información sobre nuestros servicios, procesos de selección, o cualquier consulta sobre gestión de talento humano.",
    sender: "marie",
    timestamp: new Date(),
  }]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ────────────────────────────────────────────────────────────
  //  ENVIAR MENSAJE AL WEBHOOK DE n8n
  // ────────────────────────────────────────────────────────────
  const sendMessageToMarie = async (message: string) => {
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      const response = await fetch("https://isagis.app.n8n.cloud/webhook/c9b4472d-b7a4-439d-a2b2-fa88ece909d2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString(),
          sessionId,              // 🔑 SIEMPRE EL MISMO EN TODA LA CONVERSACIÓN
          source: "website_chat",
          user_info: {
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const botText =
        data.chatOutput || data.response || data.message || data.text ||
        "Gracias por tu mensaje. Un especialista de Gear360hr se pondrá en contacto contigo pronto.";

      const marieResponse: Message = {
        id: Date.now() + 1,
        text: botText,
        sender: "marie",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, marieResponse]);
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Disculpa, tengo problemas técnicos. Por favor, contáctanos al 350‑579‑5394 o escribe a contacto@gear360hr.com",
          sender: "marie",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessageToMarie(inputMessage.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="bg-gradient-gear text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gear-pink rounded-full flex items-center justify-center relative">
              <Bot className="h-6 w-6 text-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse m-0.5" />
              </div>
            </div>
            <div>
              <h3 className="font-bold">Marie</h3>
              <p className="text-xs text-white/80">Asistente Virtual • En línea</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-gear-pink transition-colors p-1 rounded-full hover:bg-white/10" aria-label="Cerrar chat">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gear-gray/20">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${m.sender === "user" ? "bg-gear-pink text-white" : "bg-white text-gear-black border border-gray-100"}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                <p className={`text-xs mt-1 ${m.sender === "user" ? "text-white/70" : "text-gray-500"}`}>{m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                <div className="flex space-x-1 items-center">
                  <span className="text-xs text-gray-500 mr-2">Marie está escribiendo</span>
                  <div className="w-2 h-2 bg-gear-purple rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gear-purple rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gear-purple rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 rounded-full border-gear-purple/20 focus:border-gear-purple focus:ring-gear-purple/20"
              disabled={isLoading}
              maxLength={500}
            />
            <Button type="submit" size="sm" className="bg-gear-pink hover:bg-gear-pink/90 text-white rounded-full px-4 min-w-[44px] h-[44px]" disabled={isLoading || !inputMessage.trim()}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">Marie está potenciada por IA. Las respuestas pueden variar.</p>
            <p className="text-xs text-gray-400">{inputMessage.length}/500</p>
          </div>
        </div>
      </div>
    </div>
  );
}
