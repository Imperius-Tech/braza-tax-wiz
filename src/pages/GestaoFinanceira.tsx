import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileBarChart,
  Building2,
  DollarSign,
  ArrowRight,
  Loader2,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Header from "@/components/Header";
import ModuleProgress from "@/components/ModuleProgress";
import { useModuleAnalysis } from "@/hooks/useModuleAnalysis";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUpload from "@/components/upload/FileUpload";
import ConsultationHistory from "@/components/ConsultationHistory";
import { useConsultationCache, useFormDraft } from "@/hooks/useConsultationCache";

const formatCurrency = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return "R$ " + Number(digits).toLocaleString("pt-BR");
};

const steps = [
  { label: "Extraindo dados financeiros" },
  { label: "Calculando DRE e indicadores" },
  { label: "Gerando analise e recomendacoes" },
];

const defaultFinForm = {
    nomeEmpresa: "",
    cnpj: "",
    periodo: "",
    regimeTributario: "",
    receitaBruta: "",
    custoMercadorias: "",
    despesasOperacionais: "",
    despesasAdministrativas: "",
    despesasFinanceiras: "",
    folhaPagamento: "",
    impostosSobreVendas: "",
    outrasReceitas: "",
    observacoes: "",
  };

const GestaoFinanceira = () => {
  const { step, isLoading, error, result, analyze, reset } = useModuleAnalysis("financeiro");
  const { history, save, remove } = useConsultationCache("financeiro");
  const { loadDraft, saveDraft, clearDraft } = useFormDraft("financeiro");
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState(() => {
    const draft = loadDraft();
    return draft ? { ...defaultFinForm, ...draft } : { ...defaultFinForm };
  });

  useEffect(() => {
    const timer = setTimeout(() => saveDraft(form), 500);
    return () => clearTimeout(timer);
  }, [form]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const updateCurrency = (field: string, raw: string) =>
    update(field, formatCurrency(raw));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await analyze(form, file);
      save(form.nomeEmpresa || "Analise Financeira", form, res?.resultado ?? null);
      clearDraft();
    } catch (err) {
      save(form.nomeEmpresa || "Financeiro (erro)", form, null);
      toast({
        title: "Erro na analise financeira",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSelectHistory = (c: any) => {
    setForm({ ...defaultFinForm, ...c.dados });
    reset();
  };

  const isValid = form.nomeEmpresa && form.receitaBruta && form.periodo;
  const showForm = !isLoading && !result;
  const res = result?.resultado;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-10 max-w-4xl">
        {showForm && (
          <>
            <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-400/10 text-blue-400 text-sm font-medium mb-5">
                <FileBarChart className="w-4 h-4" />
                Gestao Financeira Inteligente
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Analise Financeira <span className="text-gradient">e DRE</span>
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Gere a DRE da empresa, analise indicadores e receba recomendacoes para melhorar os resultados.
              </p>
            </motion.div>

            <ConsultationHistory history={history} onSelect={handleSelectHistory} onRemove={remove} />

            <motion.div
              className="bg-card border border-border/50 rounded-2xl p-5 md:p-8 shadow-card"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Dados da Empresa */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <h3 className="font-heading font-semibold text-foreground text-sm">Dados da Empresa</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Razao Social *</Label>
                      <Input placeholder="Nome da empresa" value={form.nomeEmpresa} onChange={(e) => update("nomeEmpresa", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">CNPJ</Label>
                      <Input placeholder="00.000.000/0000-00" value={form.cnpj} onChange={(e) => update("cnpj", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Periodo de Referencia *</Label>
                      <Select onValueChange={(v) => update("periodo", v)} required>
                        <SelectTrigger className="bg-secondary border-border/50"><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="janeiro_2026">Janeiro 2026</SelectItem>
                          <SelectItem value="fevereiro_2026">Fevereiro 2026</SelectItem>
                          <SelectItem value="marco_2026">Marco 2026</SelectItem>
                          <SelectItem value="1_trimestre_2026">1o Trimestre 2026</SelectItem>
                          <SelectItem value="2025_anual">Ano 2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Regime Tributario</Label>
                      <Select onValueChange={(v) => update("regimeTributario", v)}>
                        <SelectTrigger className="bg-secondary border-border/50"><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                          <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                          <SelectItem value="lucro_real">Lucro Real</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Dados Financeiros */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    <h3 className="font-heading font-semibold text-foreground text-sm">Dados Financeiros do Periodo</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Informe os valores do periodo selecionado. Quanto mais dados, melhor a analise.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Receita Bruta *</Label>
                      <Input placeholder="R$ 500.000" value={form.receitaBruta} onChange={(e) => updateCurrency("receitaBruta", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Impostos sobre Vendas</Label>
                      <Input placeholder="R$ 50.000" value={form.impostosSobreVendas} onChange={(e) => updateCurrency("impostosSobreVendas", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Custo das Mercadorias/Servicos (CMV)</Label>
                      <Input placeholder="R$ 200.000" value={form.custoMercadorias} onChange={(e) => updateCurrency("custoMercadorias", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Despesas Operacionais</Label>
                      <Input placeholder="R$ 80.000" value={form.despesasOperacionais} onChange={(e) => updateCurrency("despesasOperacionais", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Despesas Administrativas</Label>
                      <Input placeholder="R$ 30.000" value={form.despesasAdministrativas} onChange={(e) => updateCurrency("despesasAdministrativas", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Folha de Pagamento</Label>
                      <Input placeholder="R$ 60.000" value={form.folhaPagamento} onChange={(e) => updateCurrency("folhaPagamento", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Despesas Financeiras</Label>
                      <Input placeholder="R$ 5.000" value={form.despesasFinanceiras} onChange={(e) => updateCurrency("despesasFinanceiras", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Outras Receitas</Label>
                      <Input placeholder="R$ 10.000" value={form.outrasReceitas} onChange={(e) => updateCurrency("outrasReceitas", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                  </div>
                </div>

                {/* Documento + Obs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Observacoes</Label>
                    <Textarea placeholder="Informacoes adicionais sobre o periodo..." value={form.observacoes} onChange={(e) => update("observacoes", e.target.value)} className="bg-secondary border-border/50 focus:border-primary min-h-[60px]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Balancete ou Extrato (PDF, opcional)</Label>
                    <FileUpload file={file} onFileChange={setFile} />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading || !isValid} className="w-full gradient-brand text-primary-foreground font-heading font-semibold text-base h-12 shadow-brand hover:opacity-90 transition-opacity disabled:opacity-50">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowRight className="w-5 h-5 mr-2" />}
                  {isLoading ? "Analisando..." : "Gerar Analise Financeira"}
                </Button>
              </form>
            </motion.div>

            {error && (
              <motion.div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.div>
            )}
          </>
        )}

        {isLoading && <ModuleProgress currentStep={step} steps={steps} title="Gerando analise financeira..." />}

        {result && res && <FinanceiroResult resultado={res} tempoMs={result.tempo_processamento_ms} onReset={reset} />}
      </main>
    </div>
  );
};

/* ============ RESULT COMPONENT ============ */
function FinanceiroResult({ resultado, tempoMs, onReset }: { resultado: Record<string, any>; tempoMs: number; onReset: () => void }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const dre = resultado.dre || {};
  const indicadores = resultado.indicadores || [];
  const recomendacoes = resultado.recomendacoes || [];
  const alertas = resultado.alertas || [];

  const fmtBRL = (v: number) => v != null ? "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "—";

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">{resultado.empresa || "Analise Financeira"}</h2>
          <p className="text-xs text-muted-foreground">Processado em {(tempoMs / 1000).toFixed(1)}s</p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /> Nova Analise
        </Button>
      </div>

      {/* DRE */}
      <div className="bg-card border border-border/50 rounded-2xl p-5">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileBarChart className="w-4 h-4 text-blue-400" /> DRE — Demonstracao do Resultado
        </h3>
        <div className="space-y-2 text-sm">
          {[
            { label: "Receita Bruta", value: dre.receita_bruta, bold: true },
            { label: "(-) Deducoes / Impostos sobre Vendas", value: dre.deducoes, negative: true },
            { label: "= Receita Liquida", value: dre.receita_liquida, bold: true, highlight: true },
            { label: "(-) Custo dos Produtos/Servicos", value: dre.cmv, negative: true },
            { label: "= Lucro Bruto", value: dre.lucro_bruto, bold: true, highlight: true },
            { label: "(-) Despesas Operacionais", value: dre.despesas_operacionais, negative: true },
            { label: "(-) Despesas Administrativas", value: dre.despesas_administrativas, negative: true },
            { label: "(-) Folha de Pagamento", value: dre.folha_pagamento, negative: true },
            { label: "= Resultado Operacional (EBITDA)", value: dre.ebitda, bold: true, highlight: true },
            { label: "(-) Despesas Financeiras", value: dre.despesas_financeiras, negative: true },
            { label: "(+) Outras Receitas", value: dre.outras_receitas },
            { label: "= Resultado Liquido", value: dre.resultado_liquido, bold: true, highlight: true, final: true },
          ].map((row, i) => (
            <div
              key={i}
              className={`flex justify-between py-1.5 px-3 rounded-lg ${
                row.final
                  ? (row.value >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")
                  : row.highlight ? "bg-secondary/80" : ""
              } ${row.bold ? "font-semibold" : "text-muted-foreground"}`}
            >
              <span>{row.label}</span>
              <span>{row.value != null ? fmtBRL(row.value) : "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores */}
      {indicadores.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {indicadores.map((ind: any, i: number) => (
            <div key={i} className="bg-card border border-border/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{ind.nome}</p>
              <p className={`font-heading font-bold text-lg ${
                ind.status === "bom" ? "text-emerald-400" : ind.status === "atencao" ? "text-amber-400" : ind.status === "critico" ? "text-red-400" : "text-foreground"
              }`}>
                {ind.valor}
              </p>
              {ind.referencia && <p className="text-[10px] text-muted-foreground mt-0.5">Ref: {ind.referencia}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((a: any, i: number) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl text-sm ${
              a.tipo === "critico" ? "bg-red-500/10 text-red-400" : a.tipo === "atencao" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
            }`}>
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{a.mensagem}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recomendacoes */}
      {recomendacoes.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Recomendacoes
          </h3>
          <div className="space-y-3">
            {recomendacoes.map((rec: any, i: number) => (
              <div key={i} className="border border-border/30 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
                  onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      rec.impacto === "alto" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {rec.impacto === "alto" ? "Alto Impacto" : "Melhoria"}
                    </span>
                    <span className="text-sm font-medium text-foreground">{rec.titulo}</span>
                  </div>
                  {expandedIdx === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>
                {expandedIdx === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground whitespace-pre-line">
                    {rec.descricao}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumo */}
      {resultado.resumo_executivo && (
        <div className="bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-3">Resumo Executivo</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{resultado.resumo_executivo}</p>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Analise gerada por inteligencia artificial. Valide os dados com o balancete contabil.
      </p>
    </motion.div>
  );
}

export default GestaoFinanceira;
