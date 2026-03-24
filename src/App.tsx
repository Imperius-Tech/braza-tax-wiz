import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard.tsx";
import DiagnosticoTributario from "./pages/DiagnosticoTributario.tsx";
import GestaoFinanceira from "./pages/GestaoFinanceira.tsx";
import DepartamentoPessoal from "./pages/DepartamentoPessoal.tsx";
import AberturaEmpresa from "./pages/AberturaEmpresa.tsx";
import GestaoFiscal from "./pages/GestaoFiscal.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/diagnostico" element={<DiagnosticoTributario />} />
          <Route path="/financeiro" element={<GestaoFinanceira />} />
          <Route path="/departamento-pessoal" element={<DepartamentoPessoal />} />
          <Route path="/abertura-empresa" element={<AberturaEmpresa />} />
          <Route path="/fiscal" element={<GestaoFiscal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
