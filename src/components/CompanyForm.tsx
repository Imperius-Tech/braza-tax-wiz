import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, DollarSign, Users, FileText, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface CompanyData {
  nomeEmpresa: string;
  cnpj: string;
  regimeTributario: string;
  faturamentoAnual: string;
  setor: string;
  numFuncionarios: string;
  estado: string;
  atividadePrincipal: string;
  observacoes: string;
}

interface CompanyFormProps {
  onSubmit: (data: CompanyData) => void;
  isLoading: boolean;
}

const CompanyForm = ({ onSubmit, isLoading }: CompanyFormProps) => {
  const [data, setData] = useState<CompanyData>({
    nomeEmpresa: "",
    cnpj: "",
    regimeTributario: "",
    faturamentoAnual: "",
    setor: "",
    numFuncionarios: "",
    estado: "",
    atividadePrincipal: "",
    observacoes: "",
  });

  const update = (field: keyof CompanyData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  const fieldDelay = (i: number) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div {...fieldDelay(0)} className="space-y-2">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-primary" /> Nome da Empresa
          </Label>
          <Input
            placeholder="Razão Social"
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
            required
          />
        </motion.div>

        <motion.div {...fieldDelay(2)} className="space-y-2">
          <Label className="text-sm text-muted-foreground">Regime Tributário</Label>
          <Select onValueChange={(v) => update("regimeTributario", v)} required>
            <SelectTrigger className="bg-secondary border-border/50">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simples">Simples Nacional</SelectItem>
              <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
              <SelectItem value="lucro_real">Lucro Real</SelectItem>
              <SelectItem value="mei">MEI</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div {...fieldDelay(3)} className="space-y-2">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-primary" /> Faturamento Anual (R$)
          </Label>
          <Input
            placeholder="Ex: 1.200.000,00"
            value={data.faturamentoAnual}
            onChange={(e) => update("faturamentoAnual", e.target.value)}
            className="bg-secondary border-border/50 focus:border-primary"
            required
          />
        </motion.div>

        <motion.div {...fieldDelay(4)} className="space-y-2">
          <Label className="text-sm text-muted-foreground">Setor de Atuação</Label>
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
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div {...fieldDelay(5)} className="space-y-2">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-primary" /> Nº de Funcionários
          </Label>
          <Input
            placeholder="Ex: 25"
            value={data.numFuncionarios}
            onChange={(e) => update("numFuncionarios", e.target.value)}
            className="bg-secondary border-border/50 focus:border-primary"
            type="number"
          />
        </motion.div>

        <motion.div {...fieldDelay(6)} className="space-y-2">
          <Label className="text-sm text-muted-foreground">Estado (UF)</Label>
          <Select onValueChange={(v) => update("estado", v)} required>
            <SelectTrigger className="bg-secondary border-border/50">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                <SelectItem key={uf} value={uf}>{uf}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div {...fieldDelay(7)} className="space-y-2">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-primary" /> Atividade Principal
          </Label>
          <Input
            placeholder="Descrição da atividade"
            value={data.atividadePrincipal}
            onChange={(e) => update("atividadePrincipal", e.target.value)}
            className="bg-secondary border-border/50 focus:border-primary"
          />
        </motion.div>
      </div>

      <motion.div {...fieldDelay(8)} className="space-y-2">
        <Label className="text-sm text-muted-foreground">Observações Adicionais</Label>
        <Textarea
          placeholder="Informações relevantes sobre a empresa, incentivos fiscais atuais, etc."
          value={data.observacoes}
          onChange={(e) => update("observacoes", e.target.value)}
          className="bg-secondary border-border/50 focus:border-primary min-h-[80px]"
        />
      </motion.div>

      <motion.div {...fieldDelay(9)}>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full gradient-brand text-primary-foreground font-heading font-semibold text-base h-12 shadow-brand hover:opacity-90 transition-opacity"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <ArrowRight className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "Analisando dados..." : "Gerar Estratégia Tributária"}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default CompanyForm;
