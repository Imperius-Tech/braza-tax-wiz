import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
          <div>
            <h1 className="font-heading text-lg font-bold text-foreground">TributoFox</h1>
            <p className="text-xs text-muted-foreground">Agente Tributário Inteligente</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
            Brasil
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
