import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col transition-all duration-300 ease-in-out">
      <Navbar />
      <main className="flex-1 transition-opacity duration-300 ease-in-out">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
} 