import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calculator,
  ArrowRight,
  Loader2,
  RotateCcw,
  DollarSign,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CalendarDays,
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

const formatCurrency = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return "R$ " + Number(digits).toLocaleString("pt-BR");
};

const steps = [
  { label: "Analisando dados do funcionario" },
  { label: "Calculando verbas e encargos" },
  { label: "Gerando relatorio detalhado" },
];

const operacoes = [
  { value: "rescisao", label: "Calculo de Rescisao" },
  { value: "ferias", label: "Calculo de Ferias" },
  { value: "decimo_terceiro", label: "Calculo de 13o Salario" },
  { value: "custo_funcionario", label: "Custo Total de Funcionario" },
  { value: "admissao", label: "Checklist de Admissao" },
  { value: "folha", label: "Simulacao de Folha de Pagamento" },
];

const DepartamentoPessoal = () => {
  const { step, isLoading, error, result, analyze, reset } = useModuleAnalysis("departamento_pessoal");
  const { toast } = useToast();

  const [form, setForm] = useState({
    operacao: "",
    nomeEmpresa: "",
    regimeTributario: "",
    nomeFuncionario: "",
    cargo: "",
    salarioBase: "",
    dataAdmissao: "",
    dataDemissao: "",
    tipoDemissao: "",
    horasExtras: "",
    faltas: "",
    dependentes: "",
    valeTransporte: "",
    valeRefeicao: "",
    planoSaude: "",
    observacoes: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const updateCurrency = (field: string, raw: string) =>
    update(field, formatCurrency(raw));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await analyze(form);
    } catch (err) {
      toast({
        title: "Erro no calculo",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const isValid = form.operacao && form.salarioBase;
  const showForm = !isLoading && !result;
  const res = result?.resultado;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-10 max-w-4xl">
        {showForm && (
          <>
            <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-400/10 text-purple-400 text-sm font-medium mb-5">
                <Users className="w-4 h-4" />
                Departamento Pessoal Inteligente
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Departamento <span className="text-gradient">Pessoal</span>
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Calcule rescisao, ferias, 13o salario, custo de funcionario e gere documentos automaticamente.
              </p>
            </motion.div>

            <motion.div className="bg-card border border-border/50 rounded-2xl p-5 md:p-8 shadow-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Tipo de Operacao */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-4 h-4 text-purple-400" />
                    <h3 className="font-heading font-semibold text-foreground text-sm">Tipo de Operacao</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {operacoes.map((op) => (
                      <button
                        key={op.value}
                        type="button"
                        onClick={() => update("operacao", op.value)}
                        className={`p-3 rounded-xl text-xs font-medium text-left transition-colors border ${
                          form.operacao === op.value
                            ? "bg-primary/15 border-primary/30 text-primary"
                            : "bg-secondary/50 border-border/30 text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dados Empresa */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <h3 className="font-heading font-semibold text-foreground text-sm">Dados</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Nome da Empresa</Label>
                      <Input placeholder="Empresa XYZ Ltda" value={form.nomeEmpresa} onChange={(e) => update("nomeEmpresa", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
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
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Nome do Funcionario</Label>
                      <Input placeholder="Joao da Silva" value={form.nomeFuncionario} onChange={(e) => update("nomeFuncionario", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Cargo</Label>
                      <Input placeholder="Analista Administrativo" value={form.cargo} onChange={(e) => update("cargo", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Salario Base (R$) *</Label>
                      <Input placeholder="R$ 3.000" value={form.salarioBase} onChange={(e) => updateCurrency("salarioBase", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Data de Admissao</Label>
                      <Input type="date" value={form.dataAdmissao} onChange={(e) => update("dataAdmissao", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>

                    {(form.operacao === "rescisao") && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Data de Demissao</Label>
                          <Input type="date" value={form.dataDemissao} onChange={(e) => update("dataDemissao", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Tipo de Demissao</Label>
                          <Select onValueChange={(v) => update("tipoDemissao", v)}>
                            <SelectTrigger className="bg-secondary border-border/50"><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sem_justa_causa">Sem Justa Causa</SelectItem>
                              <SelectItem value="pedido_demissao">Pedido de Demissao</SelectItem>
                              <SelectItem value="justa_causa">Justa Causa</SelectItem>
                              <SelectItem value="acordo_mutuo">Acordo Mutuo (CLT 484-A)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Horas Extras (mes)</Label>
                      <Input placeholder="Ex: 10" type="number" value={form.horasExtras} onChange={(e) => update("horasExtras", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Dependentes (IRRF)</Label>
                      <Input placeholder="Ex: 2" type="number" value={form.dependentes} onChange={(e) => update("dependentes", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                    </div>

                    {(form.operacao === "custo_funcionario" || form.operacao === "folha") && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Vale Transporte (R$)</Label>
                          <Input placeholder="R$ 300" value={form.valeTransporte} onChange={(e) => updateCurrency("valeTransporte", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Vale Refeicao (R$)</Label>
                          <Input placeholder="R$ 600" value={form.valeRefeicao} onChange={(e) => updateCurrency("valeRefeicao", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Plano de Saude (R$)</Label>
                          <Input placeholder="R$ 400" value={form.planoSaude} onChange={(e) => updateCurrency("planoSaude", e.target.value)} className="bg-secondary border-border/50 focus:border-primary" />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Observacoes</Label>
                  <Textarea placeholder="Informacoes adicionais..." value={form.observacoes} onChange={(e) => update("observacoes", e.target.value)} className="bg-secondary border-border/50 focus:border-primary min-h-[60px]" />
                </div>

                <Button type="submit" disabled={isLoading || !isValid} className="w-full gradient-brand text-primary-foreground font-heading font-semibold text-base h-12 shadow-brand hover:opacity-90 transition-opacity disabled:opacity-50">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowRight className="w-5 h-5 mr-2" />}
                  {isLoading ? "Calculando..." : "Calcular"}
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

        {isLoading && <ModuleProgress currentStep={step} steps={steps} title="Calculando..." />}

        {result && res && <DPResult resultado={res} tempoMs={result.tempo_processamento_ms} onReset={reset} />}
      </main>
    </div>
  );
};

/* ============ RESULT ============ */
function DPResult({ resultado, tempoMs, onReset }: { resultado: Record<string, any>; tempoMs: number; onReset: () => void }) {
  const [showDetalhes, setShowDetalhes] = useState(false);
  const verbas = resultado.verbas || [];
  const descontos = resultado.descontos || [];
  const encargos = resultado.encargos || [];
  const documentos = resultado.documentos || [];
  const checklist = resultado.checklist || [];
  const alertas = resultado.alertas || [];

  const fmtBRL = (v: number) => v != null ? "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "—";

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">{resultado.titulo || "Resultado"}</h2>
          <p className="text-xs text-muted-foreground">
            {resultado.funcionario && `${resultado.funcionario} — `}Processado em {(tempoMs / 1000).toFixed(1)}s
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /> Novo Calculo
        </Button>
      </div>

      {/* Valor Total */}
      {resultado.valor_total != null && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center">
          <p className="text-sm text-emerald-400 mb-1">{resultado.label_total || "Valor Total"}</p>
          <p className="font-heading text-3xl font-bold text-emerald-400">{fmtBRL(resultado.valor_total)}</p>
          {resultado.valor_mensal != null && (
            <p className="text-xs text-emerald-400/70 mt-1">Custo mensal: {fmtBRL(resultado.valor_mensal)}</p>
          )}
        </div>
      )}

      {/* Verbas */}
      {verbas.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Verbas / Proventos
          </h3>
          <div className="space-y-1.5">
            {verbas.map((v: any, i: number) => (
              <div key={i} className="flex justify-between text-sm py-1.5 px-3 rounded-lg hover:bg-secondary/50">
                <span className="text-muted-foreground">{v.descricao}</span>
                <span className="text-emerald-400 font-medium">{fmtBRL(v.valor)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Descontos */}
      {descontos.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-red-400" /> Descontos
          </h3>
          <div className="space-y-1.5">
            {descontos.map((d: any, i: number) => (
              <div key={i} className="flex justify-between text-sm py-1.5 px-3 rounded-lg hover:bg-secondary/50">
                <span className="text-muted-foreground">{d.descricao}</span>
                <span className="text-red-400 font-medium">- {fmtBRL(d.valor)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Encargos */}
      {encargos.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" /> Encargos do Empregador
          </h3>
          <div className="space-y-1.5">
            {encargos.map((enc: any, i: number) => (
              <div key={i} className="flex justify-between text-sm py-1.5 px-3 rounded-lg hover:bg-secondary/50">
                <span className="text-muted-foreground">{enc.descricao}</span>
                <span className="text-amber-400 font-medium">{fmtBRL(enc.valor)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist */}
      {checklist.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-purple-400" /> Checklist
          </h3>
          <div className="space-y-2">
            {checklist.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-muted-foreground">{typeof item === "string" ? item : item.descricao}</span>
              </div>
            ))}
          </div>
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

      {/* Fundamentacao */}
      {resultado.fundamentacao_legal && (
        <div className="bg-card border border-border/50 rounded-2xl p-5">
          <button onClick={() => setShowDetalhes(!showDetalhes)} className="w-full flex items-center justify-between">
            <h3 className="font-heading font-semibold text-foreground text-sm">Fundamentacao Legal</h3>
            {showDetalhes ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {showDetalhes && (
            <p className="text-sm text-muted-foreground mt-3 whitespace-pre-line">{resultado.fundamentacao_legal}</p>
          )}
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
        Calculos baseados na CLT e tabelas vigentes. Confirme com a convencao coletiva aplicavel.
      </p>
    </motion.div>
  );
}

export default DepartamentoPessoal;
