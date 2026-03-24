import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  FileBarChart,
  Users,
  Building,
  CalendarCheck,
  Home,
} from "lucide-react";
import logo from "@/assets/logo.png";

const modules = [
  { path: "/", label: "Painel", icon: Home },
  { path: "/diagnostico", label: "Diagnostico Tributario", icon: Search },
  { path: "/financeiro", label: "Gestao Financeira", icon: FileBarChart },
  { path: "/departamento-pessoal", label: "Departamento Pessoal", icon: Users },
  { path: "/abertura-empresa", label: "Abertura de Empresa", icon: Building },
  { path: "/fiscal", label: "Gestao Fiscal", icon: CalendarCheck },
];

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Imperius Tech" className="w-9 h-9 rounded-lg" />
          <div>
            <h1 className="font-heading text-base font-bold text-foreground leading-tight">
              Cacador de Leoes
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">by Imperius Tech</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {modules.map((m) => {
            const active = location.pathname === m.path;
            return (
              <Link
                key={m.path}
                to={m.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <m.icon className="w-3.5 h-3.5" />
                {m.label}
              </Link>
            );
          })}
        </nav>

        {/* Badge + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
            Brasil 2026
          </span>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm px-4 pb-3 pt-1">
          {modules.map((m) => {
            const active = location.pathname === m.path;
            return (
              <Link
                key={m.path}
                to={m.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <m.icon className="w-4 h-4" />
                {m.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default Header;
