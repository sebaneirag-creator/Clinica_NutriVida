import { Route, Routes } from "react-router";
import { Layout } from "./components/layout/Layout";
import { RutaProtegida } from "./components/layout/RutaProtegida";
import AdminCategorias from "./pages/AdminCategorias";
import AdminPanel from "./pages/AdminPanel";
import AdminServicios from "./pages/AdminServicios";
import AdminUsuarios from "./pages/AdminUsuarios";
import Carrito from "./pages/Carrito";
import DetalleServicio from "./pages/DetalleServicio";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import NoEncontrado from "./pages/NoEncontrado";
import Perfil from "./pages/Perfil";
import Registro from "./pages/Registro";
import Servicios from "./pages/Servicios";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Públicas: los tres roles (y visitantes) pueden navegar y comprar */}
        <Route path="/" element={<Inicio />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/servicios/:id" element={<DetalleServicio />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Cualquier usuario con sesión */}
        <Route element={<RutaProtegida />}>
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Administrador y vendedor */}
        <Route element={<RutaProtegida roles={["administrador", "vendedor"]} />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/servicios" element={<AdminServicios />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        </Route>

        {/* Solo administrador */}
        <Route element={<RutaProtegida roles={["administrador"]} />}>
          <Route path="/admin/categorias" element={<AdminCategorias />} />
        </Route>

        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
};

export default App;
