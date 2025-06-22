import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PawPrint, LogOut } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, setUser } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const linkClassName = cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    "hover:bg-accent hover:text-accent-foreground",
    "h-10 px-4 py-2"
  );

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 border-b bg-background">
      <Link to="/" className="flex items-center gap-2 text-foreground">
        <PawPrint className="w-8 h-8 text-primary" />
        <span className="font-bold">Rukayun</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link to="/animales" className={linkClassName}>Animales</Link>
        <Link to="/educacion" className={linkClassName}>Educación</Link>
        <Link to="/contacto" className={linkClassName}>Contacto</Link>
        
        <div className="border-l h-6 mx-4" />

        {user ? (
          <>
            <span className="font-medium text-sm">Hola, {user.name.split(' ')[0]}</span>
            <Button onClick={handleLogout} variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
} 