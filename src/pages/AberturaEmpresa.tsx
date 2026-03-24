import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building,
  Briefcase,
  ArrowRight,
  Loader2,
  RotateCcw,
  DollarSign,
  FileText,
  CheckCircle2,
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import ModuleProgress from "@/components/ModuleProgress";
import Roadmap from "@/components/Roadmap";
import ConsultationHistory from "@/components/ConsultationHistory";
import { useModuleAnalysis } from "@/hooks/useModuleAnalysis";
import { useConsultationCache, useFormDraft } from "@/hooks/useConsultationCache";
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

const formatCurrency = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return "R$ " + Number(digits).toLocaleString("pt-BR");
};

const steps = [
  { label: "Analisando perfil do negocio" },
  { label: "Selecionando CNAE e regime ideal" },
  { label: "Gerando checklist e contrato social" },
];

const defaultForm = {
    descricaoAtividade: "",
    tipoNegocio: "",
    nomeDesejado: "",
    numSocios: "",
    capitalSocial: "",
    faturamentoEstimado: "",
    numFuncionarios: "",
    estado: "",
    municipio: "",
    endereco: "",
    vendeOuPresta: "",
    observacoes: "",
  };

const AberturaEmpresa = () => {
  const { step, isLoading, error, result, analyze, reset } = useModuleAnalysis("abertura_empresa");
  const { history, save, remove } = useConsultationCache("abertura_empresa");
  const { loadDraft, saveDraft, clearDraft } = useFormDraft("abertura_empresa");
  const { toast } = useToast();
  const [form, setForm] = useState(() => {
    const draft = loadDraft();
    return draft ? { ...defaultForm, ...draft } : { ...defaultForm };
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
      const res = await analyze(form);
      save(form.nomeDesejado || form.descricaoAtividade.slice(0, 30) || "Abertura", form, res?.resultado ?? null);
      clearDraft();
    } catch (err) {
      save(form.nomeDesejado || "Abertura (erro)", form, null);
      toast({
        title: "Erro na analise",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSelectHistory = (c: any) => {
    setForm({ ...defaultForm, ...c.dados });
    reset();
  };

  const isValid = form.descricaoAtividade && form.estado;
  const showForm = !isLoading && !result;
  const res = result?.resultado;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-10 max-w-4xl">
        {showForm && (
          <>
            <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 text-amber-400 text-sm font-medium mb-5">
                <Building className="w-4 h-4" />
                Assistente de Abertura
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Abertura de <span className="text-gradient">Empresa</span>
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Descreva o negocio e receba: CNAE ideal, melhor regime tributario, contrato social e checklist completo.
              </p>
            </motion.div>

            <ConsultationHistory history={history} onSelect={handleSelectHistory} onRemove={remove} />

            <motion.div className="bg-card border border-border/50 rounded-2xl p-5 md:p-8 shadow-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Descricao do Negocio */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    <h3 className="font-heading font-semibold text-foreground text-sm">Sobre o Negocio</h3>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Descreva a atividade do negocio *</Label>
                      <Textarea placeholder="Ex: Vou abrir uma loja de roupas online com entrega propria. Tambem pretendo vender em marketplace..." value={form.descricaoAtividade} onChange={(e) => update("descricaoAtividade", e.target.value)} className="bg-secondary border-border/50 focus:border-primary min-h-[80px]" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Nome desejado para a empresa</Label>
                        <Input placeholder="Ex: Moda Express" value={form.nomeDesejado} onChange={(e) => update("nomeDesejado", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Vende produtos, presta servicos ou ambos?</Label>
                        <Select onValueChange={(v) => update("vendeOuPresta", v)}>
                          <SelectTrigger className="bg-secondary border-border/50"><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="produtos">Vende Produtos</SelectItem>
                            <SelectItem value="servicos">Presta Servicos</SelectItem>
                            <SelectItem value="ambos">Ambos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dados financeiros e socios */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-amber-400" />
                    <h3 className="font-heading font-semibold text-foreground text-sm">Socios e Financeiro</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Numero de Socios</Label>
                      <Input placeholder="Ex: 2" type="number" value={form.numSocios} onChange={(e) => update("numSocios", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Capital Social</Label>
                      <Input placeholder="R$ 50.000" value={form.capitalSocial} onChange={(e) => updateCurrency("capitalSocial", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Faturamento Mensal Estimado</Label>
                      <Input placeholder="R$ 30.000" value={form.faturamentoEstimado} onChange={(e) => updateCurrency("faturamentoEstimado", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Funcionarios previstos</Label>
                      <Input placeholder="Ex: 3" type="number" value={form.numFuncionarios} onChange={(e) => update("numFuncionarios", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                  </div>
                </div>

                {/* Localizacao */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <h3 className="font-heading font-semibold text-foreground text-sm">Localizacao</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Estado *</Label>
                      <Select onValueChange={(v) => update("estado", v)} required>
                        <SelectTrigger className="bg-secondary border-border/50"><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                            <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Municipio</Label>
                      <Input placeholder="Ex: Sao Paulo" value={form.municipio} onChange={(e) => update("municipio", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Observacoes</Label>
                  <Textarea placeholder="Informacoes adicionais..." value={form.observacoes} onChange={(e) => update("observacoes", e.target.value)} className="bg-secondary border-border/50 focus:border-primary min-h-[60px]" />
                </div>

                <Button type="submit" disabled={isLoading || !isValid} className="w-full gradient-brand text-primary-foreground font-heading font-semibold text-base h-12 shadow-brand hover:opacity-90 transition-opacity disabled:opacity-50">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowRight className="w-5 h-5 mr-2" />}
                  {isLoading ? "Analisando..." : "Gerar Plano de Abertura"}
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

        {isLoading && <ModuleProgress currentStep={step} steps={steps} title="Gerando plano de abertura..." />}

        {result && res && <AberturaResult resultado={res} tempoMs={result.tempo_processamento_ms} onReset={reset} />}
      </main>
    </div>
  );
};

/* ============ RESULT ============ */
function AberturaResult({ resultado, tempoMs, onReset }: { resultado: Record<string, any>; tempoMs: number; onReset: () => void }) {
  const [expandedSection, setExpandedSection] = useState<string | null>("cnae");

  const cnaes = resultado.cnaes_recomendados || [];
  const regimeComparativo = resultado.regime_comparativo || [];
  const checklist = resultado.checklist_abertura || [];
  const contratoSocial = resultado.contrato_social || null;
  const custos = resultado.custos_estimados || [];
  const alertas = resultado.alertas || [];
  const tipoSocietario = resultado.tipo_societario_recomendado || null;

  const fmtBRL = (v: number) => v != null ? "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "—";

  const toggle = (s: string) => setExpandedSection(expandedSection === s ? null : s);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">{resultado.nome_empresa || "Plano de Abertura"}</h2>
          <p className="text-xs text-muted-foreground">Processado em {(tempoMs / 1000).toFixed(1)}s</p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /> Nova Consulta
        </Button>
      </div>

      {/* Tipo Societario */}
      {tipoSocietario && (
        <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-amber-400 mb-2">Tipo Societario Recomendado</h3>
          <p className="text-sm text-foreground font-medium">{tipoSocietario.tipo}</p>
          <p className="text-sm text-muted-foreground mt-1">{tipoSocietario.justificativa}</p>
        </div>
      )}

      {/* CNAEs */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
        <button onClick={() => toggle("cnae")} className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors">
          <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-400" /> CNAEs Recomendados
          </h3>
          {expandedSection === "cnae" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expandedSection === "cnae" && (
          <div className="px-5 pb-5 space-y-3">
            {cnaes.map((cnae: any, i: number) => (
              <div key={i} className={`p-3 rounded-xl border ${i === 0 ? "border-amber-400/30 bg-amber-400/5" : "border-border/30 bg-secondary/30"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-amber-400 font-medium">{i === 0 ? "CNAE Principal" : `CNAE Secundario ${i}`}</span>
                    <p className="text-sm font-medium text-foreground mt-0.5">{cnae.codigo} — {cnae.descricao}</p>
                  </div>
                </div>
                {cnae.observacao && <p className="text-xs text-muted-foreground mt-1.5">{cnae.observacao}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Regime Comparativo */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
        <button onClick={() => toggle("regime")} className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors">
          <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Comparativo de Regime Tributario
          </h3>
          {expandedSection === "regime" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expandedSection === "regime" && (
          <div className="px-5 pb-5 space-y-3">
            {regimeComparativo.map((r: any, i: number) => (
              <div key={i} className={`p-4 rounded-xl border ${r.recomendado ? "border-emerald-400/30 bg-emerald-400/5" : "border-border/30 bg-secondary/30"}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{r.regime}</p>
                  {r.recomendado && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 font-medium">Recomendado</span>}
                </div>
                <p className="text-lg font-heading font-bold text-foreground">{fmtBRL(r.imposto_mensal_estimado)}<span className="text-xs text-muted-foreground font-normal">/mes</span></p>
                {r.observacao && <p className="text-xs text-muted-foreground mt-1">{r.observacao}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roadmap de Abertura */}
      {checklist.length > 0 && (
        <Roadmap
          title={`Roadmap de Abertura (${checklist.length} etapas)`}
          steps={checklist.map((item: any) => ({
            etapa: item.etapa,
            detalhes: item.detalhes,
            prazo: item.prazo,
          }))}
          prazoTotal={resultado.prazo_total || undefined}
        />
      )}

      {/* Custos */}
      {custos.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <button onClick={() => toggle("custos")} className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" /> Custos Estimados
            </h3>
            {expandedSection === "custos" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {expandedSection === "custos" && (
            <div className="px-5 pb-5 space-y-1.5">
              {custos.map((c: any, i: number) => (
                <div key={i} className="flex justify-between text-sm py-1.5 px-3 rounded-lg hover:bg-secondary/50">
                  <span className="text-muted-foreground">{c.item}</span>
                  <span className="text-foreground font-medium">{fmtBRL(c.valor)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contrato Social */}
      {contratoSocial && (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <button onClick={() => toggle("contrato")} className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" /> Modelo de Contrato Social
            </h3>
            {expandedSection === "contrato" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {expandedSection === "contrato" && (
            <div className="px-5 pb-5">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-secondary/50 p-4 rounded-xl border border-border/30 max-h-96 overflow-y-auto">{contratoSocial}</pre>
            </div>
          )}
        </div>
      )}

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((a: any, i: number) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl text-sm bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{typeof a === "string" ? a : a.mensagem}</span>
            </div>
          ))}
        </div>
      )}

      {/* Resumo */}
      {resultado.resumo && (
        <div className="bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-3">Resumo</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{resultado.resumo}</p>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Recomendacoes geradas por IA. Valide com o orgao competente antes de iniciar o processo.
      </p>
    </motion.div>
  );
}

export default AberturaEmpresa;
