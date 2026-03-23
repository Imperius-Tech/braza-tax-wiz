import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CompanyData, AnaliseResponse } from "@/lib/types";

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

    // Simular progressão visual dos steps enquanto a API processa
    timersRef.current.push(setTimeout(() => {
      setState((prev) => prev.isLoading ? { ...prev, step: 2 } : prev);
    }, 8000));

    timersRef.current.push(setTimeout(() => {
      setState((prev) => prev.isLoading ? { ...prev, step: 3 } : prev);
    }, 35000));

    try {
      let documento_base64: string | null = null;
      let documento_nome: string | null = null;

      if (file) {
        documento_base64 = await fileToBase64(file);
        documento_nome = file.name;
      }

      const { data: response, error } = await supabase.functions.invoke(
        "analyze-company",
        {
          body: {
            empresa: data,
            documento_base64,
            documento_nome,
          },
        }
      );

      if (error) throw new Error(error.message);
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Erro ao ler arquivo. Tente novamente."));
    reader.readAsDataURL(file);
  });
}
