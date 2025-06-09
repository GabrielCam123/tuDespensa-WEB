import React from "react";
import Pagina_Inicio from "./pages/Pagina_Inicio";
import { Sobre_Nosotros } from "./pages/Sobre_Nosotros";
import { Planes } from "./pages/Planes";
import RecetasWebFree from "./pages/recetasWebFree";
import { Ingresar } from "./pages/Ingresar";
import { Registrar } from "./pages/Registrar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Administracion } from "./pages/Administracion";
import Contactanos from "./pages/Contactanos";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import NotFound from "./pages/NotFound";
import { InicioAdministrador } from "./components/InicioAdministrador";
import { Ingredientes } from "./pages/Ingredientes";
import { Gestion_recetas } from "./pages/Gestion_recetas";
import { Detalles_receta } from "./components/Detalles_receta";
import { Perfil_de_Usuario } from "./pages/Perfil_de_usuario";
import { PerfilUsuario } from "./pages/PerfilUsuarios";
import CrearUnUsuario from "./components/CrearUnUsuario";
import { EditarPerfilUsuarios } from "./components/EditarPerfilUsuarios";
import ReporteEjecutivo from "./components/ReporteEjecutivo";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Pagina_Inicio />} />
          <Route path="/sobre_nosotros" element={<Sobre_Nosotros />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/recetas" element={<RecetasWebFree />} />
          <Route path="/contactanos" element={<Contactanos />} />
          <Route path="/ingresar" element={<Ingresar />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="*" element={<NotFound />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/administracion" element={<Administracion />}>
              <Route index element={<InicioAdministrador />} />
              <Route path="ingredientes" element={<Ingredientes />} />
              <Route path="gestion_recetas" element={<Gestion_recetas />} />
              <Route path="gestion_recetas/:id" element={<Detalles_receta />} />
              <Route path="perfil" element={<Perfil_de_Usuario />} />
              <Route path="perfil/:id" element={<PerfilUsuario />} />
              <Route path="crear_un_usuario" element={<CrearUnUsuario />} />
              <Route path="editar/:id" element={<EditarPerfilUsuarios />} />
              <Route path="reporte" element={<ReporteEjecutivo/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
