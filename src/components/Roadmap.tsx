import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ChevronDown, ChevronUp, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RoadmapStep {
  etapa: string;
  detalhes?: string;
  prazo?: string;
  responsavel?: string;
}

interface RoadmapProps {
  title: string;
  steps: RoadmapStep[];
  prazoTotal?: string;
  color?: string;
}

const Roadmap = ({ title, steps, prazoTotal, color = "primary" }: RoadmapProps) => {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyRoadmap = () => {
    const text = steps
      .map(
        (s, i) =>
          `${i + 1}. ${s.etapa}${s.prazo ? ` (${s.prazo})` : ""}${s.detalhes ? `\n   ${s.detalhes}` : ""}`
      )
      .join("\n\n");

    const full = `${title}\n${prazoTotal ? `Prazo total estimado: ${prazoTotal}\n` : ""}\n${text}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 flex-1"
        >
          <MapPin className={`w-4 h-4 text-${color}`} />
          <h3 className="font-heading font-semibold text-foreground text-sm">{title}</h3>
          {prazoTotal && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium ml-2">
              {prazoTotal}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyRoadmap}
            className="h-7 px-2 text-xs gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copiado" : "Copiar"}
          </Button>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground cursor-pointer" onClick={() => setExpanded(false)} />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground cursor-pointer" onClick={() => setExpanded(true)} />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-border/50" />

            <div className="space-y-0">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="relative flex gap-4 pb-5 last:pb-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {/* Circle */}
                  <div className="relative z-10 w-8 h-8 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 border-2 border-background">
                    {i + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{step.etapa}</p>
                      {step.prazo && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {step.prazo}
                        </span>
                      )}
                    </div>
                    {step.detalhes && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.detalhes}</p>
                    )}
                    {step.responsavel && (
                      <p className="text-[10px] text-primary mt-1">Responsavel: {step.responsavel}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
