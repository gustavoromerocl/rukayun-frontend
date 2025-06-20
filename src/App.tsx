import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Animals from "@/pages/Animals";
import Education from "@/pages/Education";
import Contact from "@/pages/Contact";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="animales" element={<Animals />} />
          <Route path="educacion" element={<Education />} />
          <Route path="contacto" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;