import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface ModuleResult {
  modulo: string;
  resultado: Record<string, any>;
  tempo_processamento_ms: number;
  tokens_usados: number;
}

interface ModuleState {
  step: number;
  isLoading: boolean;
  error: string | null;
  result: ModuleResult | null;
}

export function useModuleAnalysis(modulo: string) {
  const [state, setState] = useState<ModuleState>({
    step: 0,
    isLoading: false,
    error: null,
    result: null,
  });
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const analyze = async (dados: Record<string, any>, file?: File | null) => {
    setState({ step: 1, isLoading: true, error: null, result: null });
    clearTimers();

    timersRef.current.push(setTimeout(() => {
      setState((prev) => prev.isLoading ? { ...prev, step: 2 } : prev);
    }, 6000));

    timersRef.current.push(setTimeout(() => {
      setState((prev) => prev.isLoading ? { ...prev, step: 3 } : prev);
    }, 20000));

    try {
      let documento_texto: string | null = null;
      if (file) {
        documento_texto = await extractPdfText(file);
      }

      const { data: response, error } = await supabase.functions.invoke(
        "module-analyze",
        {
          body: {
            modulo,
            dados,
            documento_texto,
          },
        }
      );

      if (error) {
        let detail = error.message;
        try {
          if ("context" in error && typeof (error as any).context?.json === "function") {
            const body = await (error as any).context.json();
            detail = body?.details || body?.error || detail;
          }
        } catch { /* ignore */ }
        throw new Error(detail);
      }
      if (response?.error) throw new Error(response.details || response.error);

      clearTimers();
      setState({
        step: 3,
        isLoading: false,
        error: null,
        result: response as ModuleResult,
      });

      return response as ModuleResult;
    } catch (err) {
      clearTimers();
      const message = err instanceof Error ? err.message : "Erro ao processar";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw err;
    }
  };

  const reset = () => {
    clearTimers();
    setState({ step: 0, isLoading: false, error: null, result: null });
  };

  return { ...state, analyze, reset };
}

async function extractPdfText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(" ");
    pages.push(text);
  }
  return pages.join("\n\n");
}
