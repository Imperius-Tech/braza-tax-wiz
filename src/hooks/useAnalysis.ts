import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { CompanyData, AnaliseResponse } from "@/lib/types";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface AnalysisState {
  step: number;
  isLoading: boolean;
  error: string | null;
  result: AnaliseResponse | null;
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
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

  const analyze = async (data: CompanyData, file: File | null) => {
    setState({ step: 1, isLoading: true, error: null, result: null });
    clearTimers();

    // Simular progressão visual dos 4 steps enquanto a API processa
    timersRef.current.push(setTimeout(() => {
      setState((prev) => prev.isLoading ? { ...prev, step: 2 } : prev);
    }, 8000));

    timersRef.current.push(setTimeout(() => {
      setState((prev) => prev.isLoading ? { ...prev, step: 3 } : prev);
    }, 30000));

    timersRef.current.push(setTimeout(() => {
      setState((prev) => prev.isLoading ? { ...prev, step: 4 } : prev);
    }, 50000));

    try {
      let documento_texto: string | null = null;
      let documento_nome: string | null = null;

      if (file) {
        documento_texto = await extractPdfText(file);
        documento_nome = file.name;
      }

      const { data: response, error } = await supabase.functions.invoke(
        "analyze-company",
        {
          body: {
            empresa: data,
            documento_texto,
            documento_nome,
          },
        }
      );

      if (error) {
        // Supabase client wraps the error — try to extract the real message
        let detail = error.message;
        try {
          if ("context" in error && typeof (error as any).context?.json === "function") {
            const body = await (error as any).context.json();
            detail = body?.details || body?.error || detail;
          }
        } catch { /* ignore parse errors */ }
        throw new Error(detail);
      }
      if (response?.error) throw new Error(response.details || response.error);

      clearTimers();
      setState({
        step: 4,
        isLoading: false,
        error: null,
        result: response as AnaliseResponse,
      });

      return response as AnaliseResponse;
    } catch (err) {
      clearTimers();
      const message = err instanceof Error ? err.message : "Erro ao processar análise";
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
    const text = content.items
      .map((item: any) => item.str)
      .join(" ");
    pages.push(text);
  }

  return pages.join("\n\n");
}
