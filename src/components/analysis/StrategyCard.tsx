import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle, Clock, Scale } from "lucide-react";
import type { Estrategia } from "@/lib/types";

interface StrategyCardProps {
  strategy: Estrategia;
  index: number;
}

const prioridadeBadge = {
  URGENTE: "bg-red-500/10 text-red-400 border-red-500/20",
  IMPORTANTE: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  DESEJAVEL: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const complexidadeBadge = {
  BAIXA: "text-emerald-400",
  MEDIA: "text-yellow-400",
  ALTA: "text-red-400",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const StrategyCard = ({ strategy, index }: StrategyCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-card hover:border-primary/20 transition-colors"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <button
        className="w-full p-5 text-left flex items-start gap-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded border ${
                prioridadeBadge[strategy.prioridade]
              }`}
            >
              {strategy.prioridade}
            </span>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted/50">
              {strategy.categoria.replace(/_/g, " ")}
            </span>
          </div>
          <h3 className="font-heading font-semibold text-foreground mb-1">
            {strategy.titulo}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {strategy.explicacao}
          </p>
        </div>
        <div className="text-right shrink-0 flex flex-col items-end gap-2">
          <p className="font-mono font-bold text-emerald-400 text-lg">
            {formatCurrency(strategy.economia_estimada_anual)}
            <span className="text-xs text-muted-foreground font-normal">/ano</span>
          </p>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-border/30 pt-4">
              {/* Situação atual vs proposta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <p className="text-xs text-red-400 font-medium mb-1">Situação Atual</p>
                  <p className="text-sm text-foreground">{strategy.situacao_atual}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-xs text-emerald-400 font-medium mb-1">Com a Estratégia</p>
                  <p className="text-sm text-foreground">{strategy.situacao_proposta}</p>
                </div>
              </div>

              {/* Economia mensal */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Economia mensal:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {formatCurrency(strategy.economia_estimada_mensal)}
                </span>
              </div>

              {/* Passos de execução */}
              {strategy.passos_execucao?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Passos para implementar:</p>
                  <ol className="space-y-1.5">
                    {strategy.passos_execucao.map((passo, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary font-mono font-bold text-xs mt-0.5 shrink-0">
                          {i + 1}.
                        </span>
                        {passo}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/20">
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  <span>
                    Complexidade:{" "}
                    <span className={complexidadeBadge[strategy.complexidade]}>
                      {strategy.complexidade}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Prazo: {strategy.prazo_implementacao}</span>
                </div>
              </div>

              {/* Fundamentação legal */}
              {strategy.fundamentacao_legal && (
                <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                  <span className="font-medium text-foreground">Base legal: </span>
                  {strategy.fundamentacao_legal}
                </div>
              )}

              {/* Riscos */}
              {strategy.riscos && (
                <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/5 rounded-lg p-3 border border-yellow-500/10">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{strategy.riscos}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StrategyCard;
