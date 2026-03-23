import { motion } from "framer-motion";
import { RotateCcw, AlertTriangle, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import EconomySummary from "./EconomySummary";
import StrategyCard from "./StrategyCard";
import type { AnaliseResultado } from "@/lib/types";

interface AnalysisResultProps {
  resultado: AnaliseResultado;
  tempoMs: number;
  onReset: () => void;
}

const AnalysisResult = ({ resultado, tempoMs, onReset }: AnalysisResultProps) => {
  return (
    <div className="space-y-8">
      {/* Header com botão nova análise */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Diagnóstico Tributário
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Análise concluída em {(tempoMs / 1000).toFixed(0)}s
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onReset}
          className="border-border/50 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Nova Análise
        </Button>
      </div>

      {/* Resumo de economia */}
      <EconomySummary resultado={resultado} />

      {/* Resumo executivo */}
      {resultado.resumo_executivo && (
        <motion.div
          className="bg-card border border-border/50 rounded-xl p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-heading font-semibold text-foreground mb-2">Resumo</h3>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {resultado.resumo_executivo}
          </p>
        </motion.div>
      )}

      {/* Grid de estratégias */}
      <div>
        <h3 className="font-heading font-semibold text-foreground mb-4">
          Estratégias Identificadas
        </h3>
        <div className="space-y-3">
          {resultado.estrategias.map((strategy, i) => (
            <StrategyCard key={i} strategy={strategy} index={i} />
          ))}
        </div>
      </div>

      {/* Impacto da Reforma Tributária */}
      {resultado.impacto_reforma_tributaria && (
        <motion.div
          className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <h3 className="font-heading font-semibold text-foreground">
              Impacto da Reforma Tributária (2026–2033)
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {resultado.impacto_reforma_tributaria.resumo}
          </p>
          {resultado.impacto_reforma_tributaria.acoes_recomendadas?.length > 0 && (
            <ul className="space-y-1.5">
              {resultado.impacto_reforma_tributaria.acoes_recomendadas.map((acao, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                  {acao}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        className="text-center space-y-4 pt-4 border-t border-border/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xs text-muted-foreground">
          {resultado.disclaimer}
        </p>

        {resultado.cta && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <p className="text-sm text-foreground mb-3">{resultado.cta.texto}</p>
            <Button
              asChild={!!resultado.cta.link}
              className="gradient-brand text-primary-foreground font-semibold hover:opacity-90"
            >
              {resultado.cta.link ? (
                <a href={resultado.cta.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Agendar Sessão Estratégica
                </a>
              ) : (
                <span>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Agendar Sessão Estratégica
                </span>
              )}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AnalysisResult;
