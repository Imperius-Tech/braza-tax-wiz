import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Send,
  Loader2,
  Bot,
  User,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  valido?: boolean;
}

interface StrategyChatProps {
  empresaContext: string;
  resultadoContext: string;
}

const StrategyChat = ({ empresaContext, resultadoContext }: StrategyChatProps) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("strategy-chat", {
        body: {
          mensagem: text,
          empresa_context: empresaContext,
          resultado_context: resultadoContext,
          historico: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

      if (error) throw error;

      const reply: Message = {
        role: "assistant",
        content: data.resposta || "Nao consegui processar. Tente reformular.",
        valido: data.valido ?? null,
      };
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro ao consultar a IA. Tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold text-foreground text-sm">
            Comparativo de Estrategia
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            Chat com IA
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t border-border/30">
          {/* Intro */}
          {messages.length === 0 && (
            <div className="px-5 py-4 text-center">
              <Bot className="w-8 h-8 text-primary mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Sugira uma estrategia tributaria e a IA vai analisar se faz sentido para esta empresa.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {[
                  "E se mudar para Lucro Presumido?",
                  "Vale a pena abrir filial em outro estado?",
                  "Posso usar holding patrimonial?",
                ].map((sugestao) => (
                  <button
                    key={sugestao}
                    onClick={() => {
                      setInput(sugestao);
                      inputRef.current?.focus();
                    }}
                    className="text-[11px] px-3 py-1.5 rounded-full bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="px-4 py-3 space-y-3 max-h-96 overflow-y-auto">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary/15 text-foreground"
                        : "bg-secondary/80 text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" && msg.valido !== undefined && (
                      <div className={`flex items-center gap-1.5 mb-1.5 text-xs font-medium ${
                        msg.valido ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {msg.valido ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Estrategia Valida
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Nao Recomendada
                          </>
                        )}
                      </div>
                    )}
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-secondary/80 rounded-xl px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Sugira uma estrategia..."
              disabled={loading}
              className="flex-1 bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              size="sm"
              className="gradient-brand text-primary-foreground h-10 w-10 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyChat;
