import { PawPrint, FacebookIcon, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full bg-background border-t mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo and Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Link to="/" className="flex items-center gap-2 text-foreground flex-shrink-0">
              <PawPrint className="w-8 h-8 text-primary" />
              <span className="font-bold text-lg">Rukayun</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-0 sm:ml-4 sm:border-l sm:pl-4">
              &copy; {new Date().getFullYear()} Rukayun. Todos los derechos reservados.
            </p>
          </div>

          {/* Navigation Links
          <div className="flex flex-col items-center gap-2">
            <h4 className="font-semibold mb-2">Navegación</h4>
            <Link to="/animales" className="text-muted-foreground hover:text-primary transition-colors">Animales</Link>
            <Link to="/educacion" className="text-muted-foreground hover:text-primary transition-colors">Educación</Link>
            <Link to="/contacto" className="text-muted-foreground hover:text-primary transition-colors">Contacto</Link>
          </div> */}

          {/* Social Media */}
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">Síguenos</h4>
            <div className="flex gap-4 ml-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><FacebookIcon /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 