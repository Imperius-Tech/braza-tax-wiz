import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 72px)" }}>
        <motion.div
          className="text-center px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading text-6xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-foreground mb-2">Página não encontrada</p>
          <p className="text-muted-foreground mb-6">
            A página que você procura não existe ou foi removida.
          </p>
          <Button
            asChild
            className="gradient-brand text-primary-foreground font-semibold hover:opacity-90"
          >
            <a href="/">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao início
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
