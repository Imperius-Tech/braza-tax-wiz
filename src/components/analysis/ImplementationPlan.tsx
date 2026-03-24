import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  ChevronDown,
  MessageSquare,
  Lightbulb,
  CheckSquare,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  PlanoEstrategia,
  ProtocoloFeedback,
  EstrategiaRelacionamento,
} from "@/lib/types";

interface ImplementationPlanProps {
  planos: PlanoEstrategia[];
  protocolo: ProtocoloFeedback | null;
  relacionamento: EstrategiaRelacionamento | null;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" /> Copiado
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" /> Copiar
        </>
      )}
    </button>
  );
};

const ImplementationPlan = ({
  planos,
  protocolo,
  relacionamento,
}: ImplementationPlanProps) => {
  const [expandedPlano, setExpandedPlano] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"planos" | "protocolo" | "relacionamento">("planos");

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: "planos" as const, label: "Plano de Ação", icon: ClipboardList },
          { key: "protocolo" as const, label: "Protocolo de Feedback", icon: MessageSquare },
          { key: "relacionamento" as const, label: "Relacionamento", icon: Lightbulb },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
            className={
              activeTab === tab.key
                ? "gradient-brand text-primary-foreground shrink-0"
                : "border-border/50 text-muted-foreground shrink-0"
            }
          >
            <tab.icon className="w-4 h-4 mr-1.5" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Planos de Ação */}
      {activeTab === "planos" && (
        <div className="space-y-3">
          {planos.map((plano, idx) => (
            <div
              key={idx}
              className="bg-card border border-border/50 rounded-xl overflow-hidden"
            >
              <button
                className="w-full p-4 text-left flex items-center gap-3"
                onClick={() =>
                  setExpandedPlano(expandedPlano === idx ? null : idx)
                }
              >
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <ClipboardList className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-semibold text-foreground text-sm">
                    {plano.estrategia}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {plano.duracao_total}
                    </span>
                    <span>{plano.fases.length} fases</span>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedPlano === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedPlano === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-4">
                      {plano.fases.map((fase) => (
                        <div
                          key={fase.fase}
                          className="relative pl-6 border-l-2 border-primary/20"
                        >
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                            <span className="text-[8px] font-bold text-primary">
                              {fase.fase}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h5 className="font-semibold text-foreground text-sm">
                                {fase.titulo}
                              </h5>
                              <span className="text-xs text-muted-foreground">
                                {fase.duracao}
                              </span>
                            </div>

                            {/* Tarefas */}
                            <div className="space-y-1.5">
                              {fase.tarefas.map((tarefa, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                  <CheckSquare className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
                                  {tarefa}
                                </div>
                              ))}
                            </div>

                            {/* Mensagem para o cliente */}
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  Mensagem para o cliente
                                </span>
                                <CopyButton text={fase.mensagem_cliente} />
                              </div>
                              <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                                {fase.mensagem_cliente}
                              </p>
                            </div>

                            {/* Dica */}
                            <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/5 rounded-lg p-2.5 border border-yellow-500/10">
                              <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span>{fase.dica_relacionamento}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Protocolo de Feedback */}
      {activeTab === "protocolo" && protocolo && (
        <div className="space-y-4">
          <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Frequência</p>
                <p className="text-sm font-medium text-foreground">
                  {protocolo.frequencia}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Canais</p>
                <p className="text-sm font-medium text-foreground">
                  {protocolo.canais.join(", ")}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Indicadores de Acompanhamento
              </p>
              <div className="space-y-1.5">
                {protocolo.indicadores_acompanhamento.map((ind, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
                    {ind}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Modelo de Relatório Mensal
                </span>
                <CopyButton text={protocolo.modelo_relatorio_mensal} />
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                {protocolo.modelo_relatorio_mensal}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estratégia de Relacionamento */}
      {activeTab === "relacionamento" && relacionamento && (
        <div className="space-y-4">
          {/* Primeiro contato */}
          <div className="bg-card border border-border/50 rounded-xl p-5">
            <h4 className="font-heading font-semibold text-foreground text-sm mb-3">
              Primeiro Contato com o Cliente
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {relacionamento.primeiro_contato}
            </p>
          </div>

          {/* Objeções comuns */}
          <div className="bg-card border border-border/50 rounded-xl p-5">
            <h4 className="font-heading font-semibold text-foreground text-sm mb-3">
              Objeções Comuns e Respostas
            </h4>
            <div className="space-y-3">
              {relacionamento.objecoes_comuns.map((obj, i) => (
                <div key={i} className="space-y-2">
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                    <p className="text-xs text-red-400 font-medium mb-1">
                      Cliente diz:
                    </p>
                    <p className="text-sm text-foreground italic">
                      "{obj.objecao}"
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-xs text-emerald-400 font-medium mb-1">
                      Resposta sugerida:
                    </p>
                    <p className="text-sm text-foreground">{obj.resposta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upsell e Retenção */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm mb-2">
                Venda de Serviços Adicionais
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {relacionamento.upsell}
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm mb-2">
                Retenção do Cliente
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {relacionamento.retencao}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ImplementationPlan;
