import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  FileBarChart,
  Users,
  Building,
  CalendarCheck,
  ArrowRight,
  Bot,
} from "lucide-react";
import Header from "@/components/Header";

const modules = [
  {
    path: "/diagnostico",
    icon: Search,
    title: "Diagnostico Tributario",
    description: "Analise completa da empresa com IA. Identifica estrategias de economia tributaria com valores em R$.",
    badge: "Economia em R$",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
  {
    path: "/financeiro",
    icon: FileBarChart,
    title: "Gestao Financeira",
    description: "Gere DRE, analise indicadores financeiros e receba recomendacoes inteligentes para o cliente.",
    badge: "DRE + Analise",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    path: "/departamento-pessoal",
    icon: Users,
    title: "Departamento Pessoal",
    description: "Calcule rescisao, ferias, 13o salario, custo de funcionario e gere documentos automaticamente.",
    badge: "Calculos CLT",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    path: "/abertura-empresa",
    icon: Building,
    title: "Abertura de Empresa",
    description: "Assistente para abertura: escolha de CNAE, regime tributario, contrato social e checklist completo.",
    badge: "Passo a Passo",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  {
    path: "/fiscal",
    icon: CalendarCheck,
    title: "Gestao Fiscal",
    description: "Calendario de obrigacoes, diagnostico de conformidade e alertas de prazos personalizados.",
    badge: "Obrigacoes",
    color: "text-rose-400",
    bgColor: "bg-rose-400/10",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        {/* Hero */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Bot className="w-4 h-4" />
            Plataforma Inteligente para Contadores
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Cacador de
            <span className="text-gradient"> Leoes</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Automatize as tarefas do seu escritorio com inteligencia artificial.
            Escolha um modulo para comecar.
          </p>
        </motion.div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <motion.div
              key={m.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            >
              <Link
                to={m.path}
                className="group block h-full bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/30 hover:bg-[#2E2E2E] transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${m.bgColor}`}>
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${m.bgColor} ${m.color}`}>
                    {m.badge}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-foreground text-sm mb-2">
                  {m.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {m.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Acessar
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Todos os modulos utilizam inteligencia artificial para automatizar e acelerar o trabalho do contador.
        </p>
      </main>
    </div>
  );
};

export default Dashboard;
