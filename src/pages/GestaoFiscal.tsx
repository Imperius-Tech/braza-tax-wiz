import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Building2,
  ArrowRight,
  Loader2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Shield,
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
import { Switch } from "@/components/ui/switch";
import ConsultationHistory from "@/components/ConsultationHistory";
import { useConsultationCache, useFormDraft } from "@/hooks/useConsultationCache";

const steps = [
  { label: "Analisando perfil fiscal da empresa" },
  { label: "Mapeando obrigacoes e prazos" },
  { label: "Gerando diagnostico de conformidade" },
];

const defaultFiscalForm = {
  nomeEmpresa: "",
  cnpj: "",
  regimeTributario: "",
  setor: "",
  estado: "",
  municipio: "",
  temInscricaoEstadual: false,
  temFuncionarios: false,
  numFuncionarios: "",
  cnaesPrincipais: "",
  faturamentoMensal: "",
  observacoes: "",
};

const GestaoFiscal = () => {
  const { step, isLoading, error, result, analyze, reset } = useModuleAnalysis("fiscal");
  const { history, save, remove } = useConsultationCache("fiscal");
  const { loadDraft, saveDraft, clearDraft } = useFormDraft("fiscal");
  const { toast } = useToast();
  const [form, setForm] = useState(() => {
    const draft = loadDraft();
    return draft ? { ...defaultFiscalForm, ...draft } : { ...defaultFiscalForm };
  });

  useEffect(() => {
    const timer = setTimeout(() => saveDraft(form), 500);
    return () => clearTimeout(timer);
  }, [form]);

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await analyze(form);
      save(form.nomeEmpresa || "Diagnostico Fiscal", form, res?.resultado ?? null);
      clearDraft();
    } catch (err) {
      save(form.nomeEmpresa || "Fiscal (erro)", form, null);
      toast({
        title: "Erro na analise",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSelectHistory = (c: any) => {
    setForm({ ...defaultFiscalForm, ...c.dados });
    reset();
  };

  const isValid = form.nomeEmpresa && form.regimeTributario && form.estado;
  const showForm = !isLoading && !result;
  const res = result?.resultado;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-10 max-w-4xl">
        {showForm && (
          <>
            <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-400/10 text-rose-400 text-sm font-medium mb-5">
                <CalendarCheck className="w-4 h-4" />
                Gestao Fiscal Inteligente
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Gestao <span className="text-gradient">Fiscal</span>
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Calendario de obrigacoes, diagnostico de conformidade e alertas de prazos personalizados.
              </p>
            </motion.div>

            <ConsultationHistory history={history} onSelect={handleSelectHistory} onRemove={remove} />

            <motion.div className="bg-card border border-border/50 rounded-2xl p-5 md:p-8 shadow-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-4 h-4 text-rose-400" />
                    <h3 className="font-heading font-semibold text-foreground text-sm">Dados da Empresa</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Razao Social *</Label>
                      <Input placeholder="Empresa XYZ Ltda" value={form.nomeEmpresa} onChange={(e) => update("nomeEmpresa", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">CNPJ</Label>
                      <Input placeholder="00.000.000/0000-00" value={form.cnpj} onChange={(e) => update("cnpj", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Regime Tributario *</Label>
                      <Select onValueChange={(v) => update("regimeTributario", v)} required>
                        <SelectTrigger className="bg-secondary border-border/50"><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                          <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                          <SelectItem value="lucro_real">Lucro Real</SelectItem>
                          <SelectItem value="mei">MEI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Setor</Label>
                      <Select onValueChange={(v) => update("setor", v)}>
                        <SelectTrigger className="bg-secondary border-border/50"><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comercio">Comercio</SelectItem>
                          <SelectItem value="servicos">Servicos</SelectItem>
                          <SelectItem value="industria">Industria</SelectItem>
                          <SelectItem value="tecnologia">Tecnologia</SelectItem>
                          <SelectItem value="saude">Saude</SelectItem>
                          <SelectItem value="agronegocio">Agronegocio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">CNAEs principais</Label>
                      <Input placeholder="Ex: 6201-5/01, 4751-2/01" value={form.cnaesPrincipais} onChange={(e) => update("cnaesPrincipais", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Faturamento Mensal</Label>
                      <Input placeholder="R$ 100.000" value={form.faturamentoMensal} onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "");
                        update("faturamentoMensal", digits ? "R$ " + Number(digits).toLocaleString("pt-BR") : "");
                      }} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3 mt-5">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/30">
                      <p className="text-sm text-foreground">Possui Inscricao Estadual (IE)?</p>
                      <Switch checked={form.temInscricaoEstadual} onCheckedChange={(v) => update("temInscricaoEstadual", v)} />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/30">
                      <p className="text-sm text-foreground">Possui funcionarios (CLT)?</p>
                      <Switch checked={form.temFuncionarios} onCheckedChange={(v) => update("temFuncionarios", v)} />
                    </div>
                    {form.temFuncionarios && (
                      <div className="space-y-2 ml-4">
                        <Label className="text-sm text-muted-foreground">Quantos funcionarios?</Label>
                        <Input type="number" placeholder="Ex: 5" value={form.numFuncionarios} onChange={(e) => update("numFuncionarios", e.target.value)} className="bg-secondary border-border/50 focus:border-primary w-32" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Observacoes</Label>
                  <Textarea placeholder="Ex: Temos incentivo de ICMS, importamos materias primas..." value={form.observacoes} onChange={(e) => update("observacoes", e.target.value)} className="bg-secondary border-border/50 focus:border-primary min-h-[60px]" />
                </div>

                <Button type="submit" disabled={isLoading || !isValid} className="w-full gradient-brand text-primary-foreground font-heading font-semibold text-base h-12 shadow-brand hover:opacity-90 transition-opacity disabled:opacity-50">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowRight className="w-5 h-5 mr-2" />}
                  {isLoading ? "Analisando..." : "Gerar Diagnostico Fiscal"}
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

        {isLoading && <ModuleProgress currentStep={step} steps={steps} title="Analisando obrigacoes fiscais..." />}

        {result && res && <FiscalResult resultado={res} tempoMs={result.tempo_processamento_ms} onReset={reset} />}
      </main>
    </div>
  );
};

/* ============ RESULT ============ */
function FiscalResult({ resultado, tempoMs, onReset }: { resultado: Record<string, any>; tempoMs: number; onReset: () => void }) {
  const [expandedSection, setExpandedSection] = useState<string | null>("calendario");

  const calendario = resultado.calendario_obrigacoes || [];
  const diagnostico = resultado.diagnostico_conformidade || [];
  const alertas = resultado.alertas_urgentes || [];
  const recomendacoes = resultado.recomendacoes || [];
  const obrigacoes = resultado.obrigacoes_aplicaveis || [];

  const toggle = (s: string) => setExpandedSection(expandedSection === s ? null : s);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">{resultado.empresa || "Diagnostico Fiscal"}</h2>
          <p className="text-xs text-muted-foreground">Processado em {(tempoMs / 1000).toFixed(1)}s</p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /> Nova Consulta
        </Button>
      </div>

      {/* Score Conformidade */}
      {resultado.score_conformidade != null && (
        <div className={`rounded-2xl p-5 text-center border ${
          resultado.score_conformidade >= 80 ? "bg-emerald-500/10 border-emerald-500/20" :
          resultado.score_conformidade >= 50 ? "bg-amber-500/10 border-amber-500/20" :
          "bg-red-500/10 border-red-500/20"
        }`}>
          <p className="text-sm text-muted-foreground mb-1">Score de Conformidade Fiscal</p>
          <p className={`font-heading text-4xl font-bold ${
            resultado.score_conformidade >= 80 ? "text-emerald-400" :
            resultado.score_conformidade >= 50 ? "text-amber-400" : "text-red-400"
          }`}>
            {resultado.score_conformidade}%
          </p>
          {resultado.resumo_score && <p className="text-xs text-muted-foreground mt-2">{resultado.resumo_score}</p>}
        </div>
      )}

      {/* Alertas Urgentes */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((a: any, i: number) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-red-400 font-medium">{a.titulo || a}</p>
                {a.descricao && <p className="text-red-400/70 text-xs mt-0.5">{a.descricao}</p>}
                {a.prazo && <p className="text-red-400/70 text-xs mt-0.5">Prazo: {a.prazo}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calendario */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
        <button onClick={() => toggle("calendario")} className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors">
          <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-rose-400" /> Calendario de Obrigacoes Mensais
          </h3>
          {expandedSection === "calendario" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expandedSection === "calendario" && (
          <div className="px-5 pb-5 space-y-2">
            {calendario.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 border border-border/20">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-medium">Dia</span>
                  <span className="text-lg font-bold leading-tight">{item.dia || "—"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.obrigacao}</p>
                  {item.descricao && <p className="text-xs text-muted-foreground truncate">{item.descricao}</p>}
                </div>
                {item.multa && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 shrink-0">
                    Multa: {item.multa}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Obrigacoes Aplicaveis */}
      {obrigacoes.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <button onClick={() => toggle("obrigacoes")} className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" /> Obrigacoes Aplicaveis ({obrigacoes.length})
            </h3>
            {expandedSection === "obrigacoes" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {expandedSection === "obrigacoes" && (
            <div className="px-5 pb-5 space-y-2">
              {obrigacoes.map((ob: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-secondary/30 border border-border/20">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{ob.nome}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      ob.periodicidade === "mensal" ? "bg-blue-400/10 text-blue-400" :
                      ob.periodicidade === "anual" ? "bg-purple-400/10 text-purple-400" :
                      "bg-amber-400/10 text-amber-400"
                    }`}>
                      {ob.periodicidade}
                    </span>
                  </div>
                  {ob.descricao && <p className="text-xs text-muted-foreground mt-1">{ob.descricao}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Diagnostico */}
      {diagnostico.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <button onClick={() => toggle("diagnostico")} className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> Diagnostico de Conformidade
            </h3>
            {expandedSection === "diagnostico" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {expandedSection === "diagnostico" && (
            <div className="px-5 pb-5 space-y-2">
              {diagnostico.map((d: any, i: number) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${
                  d.status === "ok" ? "bg-emerald-500/5" : d.status === "atencao" ? "bg-amber-500/5" : "bg-red-500/5"
                }`}>
                  {d.status === "ok" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  ) : d.status === "atencao" ? (
                    <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{d.item}</p>
                    {d.descricao && <p className="text-xs text-muted-foreground mt-0.5">{d.descricao}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recomendacoes */}
      {recomendacoes.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-3">Recomendacoes</h3>
          <div className="space-y-2">
            {recomendacoes.map((r: any, i: number) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-muted-foreground">{typeof r === "string" ? r : r.descricao}</span>
              </div>
            ))}
          </div>
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
        Analise baseada na legislacao vigente. Consulte seu contador para validar prazos e obrigacoes especificas.
      </p>
    </motion.div>
  );
}

export default GestaoFiscal;
