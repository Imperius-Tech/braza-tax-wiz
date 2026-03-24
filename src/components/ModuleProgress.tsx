import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Step {
  label: string;
}

interface ModuleProgressProps {
  currentStep: number;
  steps: Step[];
  title?: string;
}

const loadingMessages = [
  "Analisando os dados informados...",
  "Consultando a legislacao atualizada...",
  "Gerando recomendacoes personalizadas...",
  "Calculando valores e estimativas...",
  "Finalizando o relatorio...",
];

const ModuleProgress = ({ currentStep, steps, title }: ModuleProgressProps) => {
  const msgIndex = Math.min(currentStep - 1, loadingMessages.length - 1);

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <div className="absolute inset-0 w-20 h-20 rounded-full gradient-brand animate-ping opacity-20" />
      </div>

      <h2 className="font-heading text-xl font-bold text-foreground mb-2">
        {title || "Processando..."}
      </h2>
      <p className="text-sm text-muted-foreground mb-8">
        {loadingMessages[msgIndex >= 0 ? msgIndex : 0]}
      </p>

      <div className="w-full max-w-md space-y-3">
        {steps.map((s, i) => {
          const stepNum = i + 1;
          const done = currentStep > stepNum;
          const active = currentStep === stepNum;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                done
                  ? "bg-emerald-500/10 text-emerald-400"
                  : active
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary/50 text-muted-foreground"
              }`}
            >
              {done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : active ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-border" />
              )}
              {s.label}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ModuleProgress;
