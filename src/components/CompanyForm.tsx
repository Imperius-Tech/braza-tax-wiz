import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  DollarSign,
  Users,
  FileText,
  ArrowRight,
  Loader2,
  MapPin,
  Briefcase,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import FileUpload from "@/components/upload/FileUpload";
import type { CompanyData } from "@/lib/types";

interface CompanyFormProps {
  onSubmit: (data: CompanyData, file: File | null) => void;
  isLoading: boolean;
}

const CompanyForm = ({ onSubmit, isLoading }: CompanyFormProps) => {
  const [data, setData] = useState<CompanyData>({
    nomeEmpresa: "",
    cnpj: "",
    regimeTributario: "",
    faturamentoMensal: "",
    setor: "",
    numFuncionarios: "",
    estado: "",
    municipio: "",
    atividadePrincipal: "",
    folhaPagamentoMensal: "",
    proLabore: "",
    numSocios: "",
    exportaServicos: false,
    percentualExportacao: "",
    observacoes: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const update = (field: keyof CompanyData, value: string | boolean) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data, file);
  };

  const isValid =
    data.nomeEmpresa &&
    data.regimeTributario &&
    data.faturamentoMensal &&
    data.setor &&
    data.estado;

  const fieldDelay = (i: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.04 },
  });

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* ===== SEÇÃO 1: DADOS DA EMPRESA ===== */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold text-foreground text-sm">
            Dados da Empresa
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div {...fieldDelay(0)} className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Razão Social *
            </Label>
            <Input
              placeholder="Nome da empresa"
              value={data.nomeEmpresa}
              onChange={(e) => update("nomeEmpresa", e.target.value)}
              className="bg-secondary border-border/50 focus:border-primary"
              required
            />
          </motion.div>

          <motion.div {...fieldDelay(1)} className="space-y-2">
            <Label className="text-sm text-muted-foreground">CNPJ</Label>
            <Input
              placeholder="00.000.000/0000-00"
              value={data.cnpj}
              onChange={(e) => update("cnpj", e.target.value)}
              className="bg-secondary border-border/50 focus:border-primary"
            />
          </motion.div>

          <motion.div {...fieldDelay(2)} className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Regime Tributário *
            </Label>
            <Select
              onValueChange={(v) => update("regimeTributario", v)}
              required
            >
              <SelectTrigger className="bg-secondary border-border/50">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simples_nacional">
                  Simples Nacional
                </SelectItem>
                <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                <SelectItem value="lucro_real">Lucro Real</SelectItem>
                <SelectItem value="mei">MEI</SelectItem>
                <SelectItem value="nao_sei">Não sei</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div {...fieldDelay(3)} className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Setor de Atuação *
            </Label>
            <Select onValueChange={(v) => update("setor", v)} required>
              <SelectTrigger className="bg-secondary border-border/50">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comercio">Comércio</SelectItem>
                <SelectItem value="servicos">Serviços</SelectItem>
                <SelectItem value="industria">Indústria</SelectItem>
                <SelectItem value="tecnologia">Tecnologia</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
                <SelectItem value="educacao">Educação</SelectItem>
                <SelectItem value="agronegocio">Agronegócio</SelectItem>
                <SelectItem value="construcao">Construção Civil</SelectItem>
                <SelectItem value="misto">Misto (Comércio + Serviço)</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div {...fieldDelay(4)} className="space-y-2">
            <Label className="text-sm text-muted-foreground">Estado (UF) *</Label>
            <Select onValueChange={(v) => update("estado", v)} required>
              <SelectTrigger className="bg-secondary border-border/50">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
                  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
                  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
                ].map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div {...fieldDelay(5)} className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Município
            </Label>
            <Input
              placeholder="Ex: Goiânia"
              value={data.municipio}
              onChange={(e) => update("municipio", e.target.value)}
              className="bg-secondary border-border/50 focus:border-primary"
            />
          </motion.div>
        </div>

        <motion.div {...fieldDelay(6)} className="space-y-2 mt-5">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-primary" /> Atividade
            Principal
          </Label>
          <Input
            placeholder="Ex: desenvolvimento de software, comércio de eletrônicos"
            value={data.atividadePrincipal}
            onChange={(e) => update("atividadePrincipal", e.target.value)}
            className="bg-secondary border-border/50 focus:border-primary"
          />
        </motion.div>
      </div>

      {/* ===== SEÇÃO 2: DADOS FINANCEIROS ===== */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold text-foreground text-sm">
            Dados Financeiros
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Quanto mais dados, mais precisa a análise de economia.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div {...fieldDelay(7)} className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Faturamento Mensal (R$) *
            </Label>
            <Input
              placeholder="Ex: 120000"
              value={data.faturamentoMensal}
              onChange={(e) => update("faturamentoMensal", e.target.value)}
              className="bg-secondary border-border/50 focus:border-primary"
              required
            />
          </motion.div>

          <motion.div {...fieldDelay(8)} className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Folha de Pagamento Mensal (R$)
            </Label>
            <Input
              placeholder="Ex: 25000 (salários + encargos)"
              value={data.folhaPagamentoMensal}
              onChange={(e) => update("folhaPagamentoMensal", e.target.value)}
              className="bg-secondary border-border/50 focus:border-primary"
            />
          </motion.div>

          <motion.div {...fieldDelay(9)} className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Pró-labore Total dos Sócios (R$)
            </Label>
            <Input
              placeholder="Ex: 8000"
              value={data.proLabore}
              onChange={(e) => update("proLabore", e.target.value)}
              className="bg-secondary border-border/50 focus:border-primary"
            />
          </motion.div>

          <motion.div {...fieldDelay(10)} className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-primary" /> Número de Sócios
            </Label>
            <Input
              placeholder="Ex: 2"
              value={data.numSocios}
              onChange={(e) => update("numSocios", e.target.value)}
              className="bg-secondary border-border/50 focus:border-primary"
              type="number"
            />
          </motion.div>

          <motion.div {...fieldDelay(11)} className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-primary" /> Funcionários (CLT)
            </Label>
            <Input
              placeholder="Ex: 4"
              value={data.numFuncionarios}
              onChange={(e) => update("numFuncionarios", e.target.value)}
              className="bg-secondary border-border/50 focus:border-primary"
              type="number"
            />
          </motion.div>
        </div>

        {/* Exportação */}
        <motion.div
          {...fieldDelay(12)}
          className="flex items-center justify-between mt-5 p-4 rounded-xl bg-secondary/50 border border-border/30"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Exporta serviços ou produtos?
              </p>
              <p className="text-xs text-muted-foreground">
                Exportação pode reduzir PIS/COFINS e ISS
              </p>
            </div>
          </div>
          <Switch
            checked={data.exportaServicos}
            onCheckedChange={(v) => update("exportaServicos", v)}
          />
        </motion.div>

        {data.exportaServicos && (
          <motion.div
            className="mt-3 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <Label className="text-sm text-muted-foreground">
              Percentual da receita vinda de exportação (%)
            </Label>
            <Input
              placeholder="Ex: 30"
              value={data.percentualExportacao}
              onChange={(e) => update("percentualExportacao", e.target.value)}
              className="bg-secondary border-border/50 focus:border-primary"
              type="number"
            />
          </motion.div>
        )}
      </div>

      {/* ===== SEÇÃO 3: INFORMAÇÕES ADICIONAIS ===== */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold text-foreground text-sm">
            Informações Adicionais
          </h3>
        </div>

        <motion.div {...fieldDelay(13)} className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Observações (opcional)
          </Label>
          <Textarea
            placeholder="Ex: distribuímos lucros mensalmente, temos incentivos de ICMS, estamos avaliando mudar de regime..."
            value={data.observacoes}
            onChange={(e) => update("observacoes", e.target.value)}
            className="bg-secondary border-border/50 focus:border-primary min-h-[80px]"
          />
        </motion.div>

        <motion.div {...fieldDelay(14)} className="space-y-2 mt-5">
          <Label className="text-sm text-muted-foreground">
            Documento (opcional)
          </Label>
          <FileUpload file={file} onFileChange={setFile} />
        </motion.div>
      </div>

      {/* ===== SUBMIT ===== */}
      <motion.div {...fieldDelay(15)}>
        <Button
          type="submit"
          disabled={isLoading || !isValid}
          className="w-full gradient-brand text-primary-foreground font-heading font-semibold text-base h-12 shadow-brand hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <ArrowRight className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "Analisando..." : "Analisar Empresa"}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default CompanyForm;
