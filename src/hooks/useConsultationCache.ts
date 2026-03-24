import { useState, useEffect, useCallback } from "react";

export interface CachedConsultation {
  id: string;
  modulo: string;
  label: string;
  dados: Record<string, any>;
  resultado: Record<string, any> | null;
  timestamp: number;
}

const STORAGE_KEY = "cacador_consultas";
const MAX_ITEMS = 20;

function loadAll(): CachedConsultation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(items: CachedConsultation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export function useConsultationCache(modulo: string) {
  const [history, setHistory] = useState<CachedConsultation[]>([]);

  useEffect(() => {
    setHistory(loadAll().filter((c) => c.modulo === modulo));
  }, [modulo]);

  const save = useCallback(
    (label: string, dados: Record<string, any>, resultado: Record<string, any> | null) => {
      const all = loadAll();
      const entry: CachedConsultation = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        modulo,
        label,
        dados,
        resultado,
        timestamp: Date.now(),
      };
      const updated = [entry, ...all.filter((c) => c.id !== entry.id)].slice(0, MAX_ITEMS);
      saveAll(updated);
      setHistory(updated.filter((c) => c.modulo === modulo));
      return entry.id;
    },
    [modulo]
  );

  const remove = useCallback(
    (id: string) => {
      const all = loadAll().filter((c) => c.id !== id);
      saveAll(all);
      setHistory(all.filter((c) => c.modulo === modulo));
    },
    [modulo]
  );

  return { history, save, remove };
}

/** Hook to auto-save form data as you type (debounced) */
export function useFormDraft(modulo: string) {
  const draftKey = `cacador_draft_${modulo}`;

  const loadDraft = useCallback((): Record<string, any> | null => {
    try {
      const raw = localStorage.getItem(draftKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [draftKey]);

  const saveDraft = useCallback(
    (data: Record<string, any>) => {
      localStorage.setItem(draftKey, JSON.stringify(data));
    },
    [draftKey]
  );

  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey);
  }, [draftKey]);

  return { loadDraft, saveDraft, clearDraft };
}
