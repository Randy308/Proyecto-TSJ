import { Route, Routes } from "react-router-dom";
import LayoutUser from "../layouts/LayoutUser";
import { PanelUser } from "../pages/user/PanelUser";
import PanelAdmin from "../pages/admin/PanelAdmin";
import SubirDatos from "../pages/datos/SubirDatos";
import TablaCSV from "../pages/datos/TablaCSV";
import TablaJurisprudenciaCSV from "../pages/datos/TablaJurisprudenciaCSV";
import WebScrapping from "../pages/datos/WebScrapping";
import Usuarios from "../pages/admin/usuarios/Usuarios";
import ListaRoles from "../pages/admin/Roles/ListaRoles";
import Notificaciones from "../pages/notificaciones/Notificaciones";
import { ProtectedRoutes } from "../auth/ProtectedRoutes";


export const PrivateRoutes = (
  
    <>
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<LayoutUser />}>
         
          <Route path="dashboard" element={<PanelAdmin />} />
          <Route path="admin/resoluciones" element={<SubirDatos />} />
          <Route path="admin/subir-autos-supremos" element={<TablaCSV />} />
          <Route
            path="admin/subir-jurisprudencia"
            element={<TablaJurisprudenciaCSV />}
          />
          <Route path="admin/subir-jurisprudencias" element={<TablaCSV />} />
          <Route path="admin/realizar-web-scrapping" element={<WebScrapping />} />

          <Route path="admin/usuarios" element={<Usuarios />} />
          <Route path="admin/roles" element={<ListaRoles />} />
          <Route path="user/notificaciones" element={<Notificaciones />} />
        </Route>
      </Route>
    </>
  
);