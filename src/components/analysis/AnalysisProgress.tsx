import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, Calculator, FileBarChart, Loader2, CheckCircle2 } from "lucide-react";

interface AnalysisProgressProps {
  currentStep: number;
}

const steps = [
  {
    icon: FileSearch,
    title: "Extraindo dados da empresa",
    description: "Lendo e interpretando as informações financeiras...",
  },
  {
    icon: Calculator,
    title: "Identificando estratégias tributárias",
    description: "Cruzando dados com a legislação e 25 estratégias práticas...",
  },
  {
    icon: FileBarChart,
    title: "Formatando o relatório",
    description: "Organizando estratégias, calculando economia e glossário...",
  },
  {
    icon: FileBarChart,
    title: "Criando plano de implementação",
    description: "Montando passo a passo para o contador executar...",
  },
];

const rotatingMessages = [
  "Cruzando com a legislação vigente...",
  "Identificando oportunidades de economia...",
  "Calculando impacto financeiro...",
  "Verificando incentivos regionais...",
  "Analisando regime tributário ideal...",
  "Comparando cenários tributários...",
];

const AnalysisProgress = ({ currentStep }: AnalysisProgressProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [simulatedStep, setSimulatedStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % rotatingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simular progressão visual dos steps
  useEffect(() => {
    const t1 = setTimeout(() => setSimulatedStep(1), 5000);
    const t2 = setTimeout(() => setSimulatedStep(2), 25000);
    const t3 = setTimeout(() => setSimulatedStep(3), 45000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const activeStep = Math.max(simulatedStep, currentStep);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-full gradient-brand mx-auto mb-4 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">
            Analisando sua empresa
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {rotatingMessages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            return (
              <motion.div
                key={step.title}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  isActive
                    ? "border-primary/30 bg-primary/5"
                    : isCompleted
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-border/30 bg-card/50"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    isActive
                      ? "bg-primary/10"
                      : isCompleted
                      ? "bg-emerald-500/10"
                      : "bg-muted/50"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <step.icon className="w-5 h-5 text-primary" />
                    </motion.div>
                  ) : (
                    <step.icon className="w-5 h-5 text-muted-foreground/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-foreground"
                        : isCompleted
                        ? "text-emerald-400"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {step.title}
                  </p>
                  {isActive && (
                    <motion.p
                      className="text-xs text-muted-foreground mt-0.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {step.description}
                    </motion.p>
                  )}
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisProgress;
