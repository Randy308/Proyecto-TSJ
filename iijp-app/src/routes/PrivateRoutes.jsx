import { Outlet, Route } from "react-router-dom";
import LayoutUser from "../layouts/LayoutUser";
import LayoutAdmin from "../layouts/LayoutAdmin";
import { PanelUser } from "../pages/user/PanelUser";
import PanelAdmin from "../pages/admin/PanelAdmin";
import ProtectedRoutes from "../auth/ProtectedRoutes";
import SubirResoluciones from "../pages/datos/SubirResoluciones";
import TablaCSV from "../pages/datos/TablaCSV";
import TablaJurisprudenciaCSV from "../pages/datos/TablaJurisprudenciaCSV";
import WebScrapping from "../pages/datos/WebScrapping";
import Usuarios from "../pages/admin/usuarios/Usuarios";
import ListaRoles from "../pages/admin/Roles/ListaRoles";

const PrivateRoutes = () => {
    return (

        <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<LayoutUser />}>
                <Route path="user" element={<PanelUser />} />
                <Route path="dashboard" element={<PanelAdmin />} />
                <Route path="subir-resoluciones" element={<SubirResoluciones />} />
                <Route path="admin/subir/autos-supremos" element={<TablaCSV />} />
                <Route path="admin/subir/jurisprudencia" element={<TablaJurisprudenciaCSV />} />
                <Route path="admin/subir" element={<TablaCSV />} />
                <Route path="admin/subir-automatico" element={<WebScrapping />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="roles" element={<ListaRoles />} />
            </Route>
        </Route>

    );
};

export default PrivateRoutes;
