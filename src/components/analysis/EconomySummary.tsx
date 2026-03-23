import { motion } from "framer-motion";
import { TrendingUp, Building2, Landmark } from "lucide-react";
import type { AnaliseResultado } from "@/lib/types";

interface EconomySummaryProps {
  resultado: AnaliseResultado;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const regimeLabels: Record<string, string> = {
  simples_nacional: "Simples Nacional",
  lucro_presumido: "Lucro Presumido",
  lucro_real: "Lucro Real",
  mei: "MEI",
  nao_sei: "Não informado",
};

const EconomySummary = ({ resultado }: EconomySummaryProps) => {
  return (
    <div className="space-y-6">
      {/* Cabeçalho da empresa */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-3 rounded-xl bg-primary/10">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            {resultado.empresa.razao_social}
          </h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {resultado.empresa.cnpj && <span>{resultado.empresa.cnpj}</span>}
            <span className="text-primary">
              {regimeLabels[resultado.empresa.regime_tributario] || resultado.empresa.regime_tributario}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Card de economia total */}
      <motion.div
        className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">Economia potencial identificada</span>
        </div>
        <p className="font-mono font-bold text-emerald-400 text-4xl md:text-5xl mb-2">
          {formatCurrency(resultado.economia_total_anual)}
          <span className="text-lg text-emerald-400/60">/ano</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(resultado.economia_total_mensal)}/mês
        </p>
      </motion.div>

      {/* Frase destaque */}
      <motion.div
        className="bg-card border border-border/50 rounded-xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-start gap-3">
          <Landmark className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed">
            {resultado.frase_destaque}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-card border border-border/30 rounded-lg p-3 text-center">
          <p className="font-mono font-bold text-foreground text-lg">
            {resultado.estrategias.length}
          </p>
          <p className="text-xs text-muted-foreground">Estratégias</p>
        </div>
        <div className="bg-card border border-border/30 rounded-lg p-3 text-center">
          <p className="font-mono font-bold text-foreground text-lg">
            {formatCurrency(resultado.empresa.faturamento_mensal)}
          </p>
          <p className="text-xs text-muted-foreground">Faturamento</p>
        </div>
        <div className="bg-card border border-border/30 rounded-lg p-3 text-center">
          <p className="font-mono font-bold text-foreground text-lg">
            {resultado.empresa.estado}
          </p>
          <p className="text-xs text-muted-foreground">Estado</p>
        </div>
      </motion.div>
    </div>
  );
};

export default EconomySummary;
