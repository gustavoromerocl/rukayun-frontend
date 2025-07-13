import { Layout } from "@/components/layout/Layout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Home from "@/pages/Home";
import Animals from "@/pages/Animals";
import Education from "@/pages/Education";
import Contact from "@/pages/Contact";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Dashboard pages
import Overview from "@/pages/dashboard/Overview";
import Animales from "@/pages/dashboard/Animales";
import Solicitudes from "@/pages/dashboard/Solicitudes";
import Seguimiento from "@/pages/dashboard/Seguimiento";
import Perfil from "@/pages/dashboard/Perfil";
import Configuracion from "@/pages/dashboard/Configuracion";
import Usuarios from "@/pages/dashboard/Usuarios";
import Organizaciones from "@/pages/dashboard/Organizaciones";
import { RequireAuth, RequireAdmin } from "@/components/RequireAuth";
import { InitialLoadWrapper } from "@/components/InitialLoadWrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="animales" element={<Animals />} />
          <Route path="educacion" element={<Education />} />
          <Route path="contacto" element={<Contact />} />
        </Route>
        {/* Dashboard layout protegido */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <InitialLoadWrapper>
              <DashboardLayout />
            </InitialLoadWrapper>
          </RequireAuth>
        }>
          <Route index element={<Overview />} />
          <Route path="animales" element={<Animales />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="seguimiento" element={<Seguimiento />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="usuarios" element={
            <RequireAdmin>
              <Usuarios />
            </RequireAdmin>
          } />
          <Route path="organizaciones" element={
            <RequireAdmin>
              <Organizaciones />
            </RequireAdmin>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;