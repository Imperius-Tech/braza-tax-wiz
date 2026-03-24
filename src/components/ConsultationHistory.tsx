import { motion } from "framer-motion";
import { Clock, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { CachedConsultation } from "@/hooks/useConsultationCache";

interface ConsultationHistoryProps {
  history: CachedConsultation[];
  onSelect: (consultation: CachedConsultation) => void;
  onRemove: (id: string) => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min atras`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atras`;
  const days = Math.floor(hrs / 24);
  return `${days}d atras`;
}

const ConsultationHistory = ({ history, onSelect, onRemove }: ConsultationHistoryProps) => {
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <motion.div
      className="mb-6 bg-card border border-border/50 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">Consultas Recentes</span>
          <span className="text-xs text-muted-foreground">({history.length})</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t border-border/30 px-2 py-2 space-y-1 max-h-48 overflow-y-auto">
          {history.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors group"
            >
              <button
                onClick={() => onSelect(c)}
                className="flex-1 text-left"
              >
                <p className="text-sm text-foreground font-medium truncate">{c.label}</p>
                <p className="text-[10px] text-muted-foreground">
                  {timeAgo(c.timestamp)}
                  {c.resultado ? " — com resultado" : " — rascunho"}
                </p>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(c.id);
                }}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ConsultationHistory;
