import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PawPrint, LogOut, Menu, X, Loader2 } from "lucide-react";
import { useMsal } from "@azure/msal-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Navbar() {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogout = () => {
    instance.logoutPopup().then(() => {
      navigate("/");
      setIsMenuOpen(false);
    });
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await instance.loginPopup();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error durante el login:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Obtener información del usuario desde MSAL
  const user = accounts[0];
  const userName = user?.name || user?.username || "Usuario";

  const linkClassName = cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    "hover:bg-accent hover:text-accent-foreground",
    "h-10 px-4 py-2"
  );

  const mobileLinkClassName = cn(
    "block w-full text-left px-4 py-3 text-sm font-medium transition-colors",
    "hover:bg-accent hover:text-accent-foreground",
    "border-b border-border last:border-b-0"
  );

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <PawPrint className="w-8 h-8 text-primary" />
            <span className="font-bold text-lg">Rukayun</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/animales" className={linkClassName}>Animales</Link>
            <Link to="/educacion" className={linkClassName}>Educación</Link>
            <Link to="/contacto" className={linkClassName}>Contacto</Link>
            
            <div className="border-l h-6 mx-4" />

            {user ? (
              <>
                <span className="font-medium text-sm px-3">Hola, {userName.split(' ')[0]}</span>
                <Button onClick={handleLogout} variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button onClick={handleLogin} disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-background border-b border-border transition-all duration-300 ease-in-out",
          isMenuOpen 
            ? "opacity-100 visible translate-y-0" 
            : "opacity-0 invisible -translate-y-2"
        )}>
          <div className="px-4 py-2 space-y-1">
            <Link 
              to="/animales" 
              className={mobileLinkClassName}
              onClick={() => setIsMenuOpen(false)}
            >
              Animales
            </Link>
            <Link 
              to="/educacion" 
              className={mobileLinkClassName}
              onClick={() => setIsMenuOpen(false)}
            >
              Educación
            </Link>
            <Link 
              to="/contacto" 
              className={mobileLinkClassName}
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            
            <div className="border-t border-border my-2" />
            
            {user ? (
              <>
                <div className="px-4 py-3 text-sm font-medium text-muted-foreground">
                  Hola, {userName.split(' ')[0]}
                </div>
                <button 
                  onClick={handleLogout}
                  className={mobileLinkClassName}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  handleLogin();
                  setIsMenuOpen(false);
                }}
                disabled={isLoggingIn}
                className={mobileLinkClassName}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
} 