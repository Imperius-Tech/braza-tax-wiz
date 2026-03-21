import { motion } from "framer-motion";
import { TrendingDown, Shield, AlertTriangle, Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StrategyDisplayProps {
  onReset: () => void;
}

const mockStrategies = [
  {
    icon: TrendingDown,
    title: "Otimização do Regime Tributário",
    description:
      "Com base no faturamento informado, a migração para o Lucro Presumido pode gerar economia de até 15% na carga tributária total. Recomenda-se simulação comparativa entre os regimes.",
    impact: "Alto",
    impactColor: "text-green-400",
  },
  {
    icon: Shield,
    title: "Aproveitamento de Créditos de ICMS",
    description:
      "Identificamos potencial de créditos acumulados de ICMS nas operações interestaduais. Revisão das notas fiscais dos últimos 5 anos pode recuperar valores significativos.",
    impact: "Médio",
    impactColor: "text-primary",
  },
  {
    icon: Lightbulb,
    title: "Incentivos Fiscais Regionais",
    description:
      "O estado selecionado oferece programas de incentivo fiscal para o setor informado. A adesão pode resultar em redução de alíquotas de ICMS e isenções parciais.",
    impact: "Alto",
    impactColor: "text-green-400",
  },
  {
    icon: AlertTriangle,
    title: "Revisão de Obrigações Acessórias",
    description:
      "Automatização do SPED e revisão do e-Social podem evitar multas e reduzir custos operacionais com compliance tributário.",
    impact: "Baixo",
    impactColor: "text-muted-foreground",
  },
];

const StrategyDisplay = ({ onReset }: StrategyDisplayProps) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Estratégias Recomendadas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Análise gerada com base nos dados fornecidos
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

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground">
        <p>
          ⚠️ <strong className="text-foreground">Aviso:</strong> Esta é uma demonstração com dados estáticos. Habilite o <strong className="text-primary">Lovable Cloud</strong> para ativar a IA e receber estratégias personalizadas reais.
        </p>
      </div>

      <div className="space-y-4">
        {mockStrategies.map((strategy, i) => (
          <motion.div
            key={strategy.title}
            className="bg-card border border-border/50 rounded-xl p-5 shadow-card hover:border-primary/30 transition-colors"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                <strategy.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-semibold text-foreground">{strategy.title}</h3>
                  <span className={`text-xs font-medium ${strategy.impactColor}`}>
                    Impacto: {strategy.impact}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {strategy.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StrategyDisplay;
