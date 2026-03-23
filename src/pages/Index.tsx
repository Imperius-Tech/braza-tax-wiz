import { motion } from "framer-motion";
import { Bot, TrendingDown, Shield, Zap } from "lucide-react";
import Header from "@/components/Header";
import CompanyForm from "@/components/CompanyForm";
import AnalysisProgress from "@/components/analysis/AnalysisProgress";
import AnalysisResult from "@/components/analysis/AnalysisResult";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useToast } from "@/hooks/use-toast";
import type { CompanyData } from "@/lib/types";

const features = [
  { icon: TrendingDown, label: "Redução de Impostos" },
  { icon: Shield, label: "100% Legal" },
  { icon: Zap, label: "Resultado em Segundos" },
];

const Index = () => {
  const { step, isLoading, error, result, analyze, reset } = useAnalysis();
  const { toast } = useToast();

  const handleSubmit = async (data: CompanyData, file: File | null) => {
    try {
      await analyze(data, file);
    } catch (err) {
      toast({
        title: "Erro na análise",
        description: err instanceof Error ? err.message : "Tente novamente em instantes.",
        variant: "destructive",
      });
    }
  };

  const showForm = !isLoading && !result;
  const showProgress = isLoading;
  const showResult = !!result;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-10 max-w-4xl">
        {showForm && (
          <>
            {/* Hero */}
            <motion.div
              className="text-center mb-8 md:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
                <Bot className="w-4 h-4" />
                Assistente Tributário Inteligente
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Diagnóstico Tributário
                <span className="text-gradient"> Inteligente</span>
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Descubra quanto sua empresa pode economizar em impostos com estratégias 100% legais.
              </p>

              <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
                {features.map((f) => (
                  <div key={f.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <f.icon className="w-3.5 h-3.5 text-primary" />
                    {f.label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Form Card */}
            <motion.div
              className="bg-card border border-border/50 rounded-2xl p-5 md:p-8 shadow-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CompanyForm onSubmit={handleSubmit} isLoading={isLoading} />
            </motion.div>

            {error && (
              <motion.div
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}

            <p className="text-center text-xs text-muted-foreground mt-8">
              As estratégias são sugestões baseadas em inteligência artificial e não substituem consultoria tributária profissional.
            </p>
          </>
        )}

        {showProgress && <AnalysisProgress currentStep={step} />}

        {showResult && result && (
          <motion.div
            className="bg-card border border-border/50 rounded-2xl p-5 md:p-8 shadow-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnalysisResult
              resultado={result.resultado}
              tempoMs={result.tempo_processamento_ms}
              onReset={reset}
            />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;
