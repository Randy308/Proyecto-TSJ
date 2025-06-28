import { Route, Routes } from "react-router-dom";
import { ProtectedRoutes } from "../auth";
import { LayoutUser } from "../layouts";

const PrivateRoutes = (
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

export default PrivateRoutes;
