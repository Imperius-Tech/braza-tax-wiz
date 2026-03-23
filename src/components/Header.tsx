import logo from "@/assets/logo.png";

const HunterIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Aba do chapéu */}
    <ellipse cx="32" cy="22" rx="26" ry="5" opacity="0.9" />
    {/* Copa do chapéu */}
    <path d="M20 22 C20 22, 21 8, 32 8 C43 8, 44 22, 44 22 Z" />
    {/* Faixa do chapéu */}
    <rect x="22" y="19" width="20" height="3" rx="1" opacity="0.6" />
    {/* Rosto */}
    <ellipse cx="32" cy="36" rx="11" ry="13" opacity="0.85" />
    {/* Queixo */}
    <path d="M24 44 Q32 54 40 44" opacity="0.7" />
  </svg>
);

const Header = () => {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="/" className="flex items-center gap-3">
          <img src={logo} alt="Imperius Tech" className="w-10 h-10 rounded-lg" />
          <div className="relative">
            <HunterIcon className="absolute -left-2 -top-1 w-10 h-10 text-primary/10 pointer-events-none" />
            <h1 className="font-heading text-lg font-bold text-foreground relative">
              Caçador de Leões
            </h1>
            <p className="text-xs text-muted-foreground relative">by Imperius Tech</p>
          </div>
        </a>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
            Brasil 2026
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
