import { useState } from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  AlertTriangle,
  Calendar,
  ExternalLink,
  BookOpen,
  ClipboardList,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EconomySummary from "./EconomySummary";
import StrategyCard from "./StrategyCard";
import ImplementationPlan from "./ImplementationPlan";
import StrategyChat from "@/components/StrategyChat";
import type { AnaliseResultado } from "@/lib/types";

interface AnalysisResultProps {
  resultado: AnaliseResultado;
  tempoMs: number;
  onReset: () => void;
}

const AnalysisResult = ({ resultado, tempoMs, onReset }: AnalysisResultProps) => {
  const [showPlan, setShowPlan] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  const hasPlan =
    resultado.plano_implementacao && resultado.plano_implementacao.length > 0;

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

      {/* Botões de ação */}
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {hasPlan && (
          <Button
            onClick={() => setShowPlan(!showPlan)}
            className={
              showPlan
                ? "gradient-brand text-primary-foreground"
                : "bg-card border border-primary/30 text-primary hover:bg-primary/10"
            }
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            {showPlan ? "Ocultar Plano" : "Ver Plano de Implementação"}
            {showPlan ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </Button>
        )}

        {resultado.glossario && resultado.glossario.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowGlossary(!showGlossary)}
            className="border-border/50 text-muted-foreground hover:text-foreground"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {showGlossary ? "Ocultar Glossário" : "Glossário de Termos"}
            {showGlossary ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </Button>
        )}
      </motion.div>

      {/* Plano de Implementação (expandível) */}
      {showPlan && hasPlan && (
        <ImplementationPlan
          planos={resultado.plano_implementacao!}
          protocolo={resultado.protocolo_feedback}
          relacionamento={resultado.estrategia_relacionamento}
        />
      )}

      {/* Glossário (expandível) */}
      {showGlossary && resultado.glossario && (
        <motion.div
          className="bg-card border border-border/50 rounded-xl p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">
              Glossário de Termos
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resultado.glossario.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-secondary/50 border border-border/30"
              >
                <p className="text-sm font-semibold text-primary mb-1">
                  {item.termo}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.definicao}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chat Comparativo de Estrategia */}
      <StrategyChat
        empresaContext={JSON.stringify({
          razao_social: resultado.empresa.razao_social,
          regime_tributario: resultado.empresa.regime_tributario,
          faturamento_mensal: resultado.empresa.faturamento_mensal,
          setor: resultado.empresa.setor,
          estado: resultado.empresa.estado,
          municipio: resultado.empresa.municipio,
        })}
        resultadoContext={resultado.estrategias
          .map((e) => `- ${e.titulo}: economia R$ ${e.economia_estimada_anual}/ano`)
          .join("\n")}
      />

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
              Impacto da Reforma Tributária (2026-2033)
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {resultado.impacto_reforma_tributaria.resumo}
          </p>
          {resultado.impacto_reforma_tributaria.acoes_recomendadas?.length > 0 && (
            <ul className="space-y-1.5">
              {resultado.impacto_reforma_tributaria.acoes_recomendadas.map(
                (acao, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                    {acao}
                  </li>
                )
              )}
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
        <p className="text-xs text-muted-foreground">{resultado.disclaimer}</p>

        {resultado.cta && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <p className="text-sm text-foreground mb-3">{resultado.cta.texto}</p>
            <Button
              asChild={!!resultado.cta.link}
              className="gradient-brand text-primary-foreground font-semibold hover:opacity-90"
            >
              {resultado.cta.link ? (
                <a
                  href={resultado.cta.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
