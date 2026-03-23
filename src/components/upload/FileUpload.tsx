import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const FileUpload = ({ file, onFileChange }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (f: File): boolean => {
    if (f.type !== "application/pdf") {
      setError("Apenas arquivos PDF são aceitos.");
      return false;
    }
    if (f.size > MAX_SIZE) {
      setError(`Arquivo muito grande (${(f.size / 1024 / 1024).toFixed(1)}MB). Máximo: 2MB.`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && validateFile(droppedFile)) {
        onFileChange(droppedFile);
      }
    },
    [onFileChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      onFileChange(selectedFile);
    }
    // Reset input para permitir selecionar o mesmo arquivo novamente
    e.target.value = "";
  };

  if (file) {
    return (
      <motion.div
        className="border border-primary/30 bg-primary/5 rounded-xl p-5 flex items-center gap-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="p-3 rounded-lg bg-primary/10">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(0)} KB
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { onFileChange(null); setError(null); }}
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : error
            ? "border-red-500/50 hover:border-red-500/70"
            : "border-border/50 hover:border-primary/30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("pdf-upload")?.click()}
      >
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">
          Arraste o PDF aqui ou clique para selecionar
        </p>
        <p className="text-xs text-muted-foreground">
          Balanço, DRE, balancete ou declarações recentes (PDF, max. 2MB)
        </p>
      </div>

      {error && (
        <motion.div
          className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
