import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, TrendingDown, Shield, Zap } from "lucide-react";
import Header from "@/components/Header";
import CompanyForm, { type CompanyData } from "@/components/CompanyForm";
import StrategyDisplay from "@/components/StrategyDisplay";

const features = [
  { icon: TrendingDown, label: "Redução de Carga Tributária" },
  { icon: Shield, label: "Compliance Fiscal" },
  { icon: Zap, label: "Incentivos Regionais" },
];

const Index = () => {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (_data: CompanyData) => {
    setIsLoading(true);
    // Simula processamento — será substituído pela IA
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-10 max-w-4xl">
        {/* Hero */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Bot className="w-4 h-4" />
            Agente de IA Tributário
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Estratégias tributárias
            <span className="text-gradient"> inteligentes</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Insira os dados da empresa e receba recomendações personalizadas para otimizar a tributação no Brasil.
          </p>

          <div className="flex items-center justify-center gap-6 mt-6">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                <f.icon className="w-3.5 h-3.5 text-primary" />
                {f.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {showResult ? (
            <StrategyDisplay onReset={() => setShowResult(false)} />
          ) : (
            <CompanyForm onSubmit={handleSubmit} isLoading={isLoading} />
          )}
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          As estratégias são sugestões baseadas em IA e não substituem consultoria tributária profissional.
        </p>
      </main>
    </div>
  );
};

export default Index;
