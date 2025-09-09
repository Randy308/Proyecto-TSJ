import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import My404Component from "./components/My404Component";
import { lazy, Suspense } from "react";
import { ProtectedRoutes } from "./auth/ProtectedRoutes";
import { LayoutUser, LayoutPublic, LayoutAnalisis } from "./layouts/";
import { LoadingPage } from "./pages/LoadingPage";
import { AppProviders } from "./AppProviders";
const PanelAdmin = lazy(() => import("./pages/admin/PanelAdmin"));
const SubirDatos = lazy(() => import("./pages/datos/SubirDatos"));
const TablaCSV = lazy(() => import("./pages/datos/TablaCSV"));
const TablaJurisprudenciaCSV = lazy(
  () => import("./pages/datos/TablaJurisprudenciaCSV")
);

const TablaResuelveFondo = lazy(
  () => import("./pages/datos/TablaResuelveFondo")
);
const Resolucion = lazy(() => import("./pages/resoluciones/Resolucion"));
const WebScrapping = lazy(() => import("./pages/datos/WebScrapping"));
const Usuarios = lazy(() => import("./pages/admin/usuarios/Usuarios"));
const Notificaciones = lazy(
  () => import("./pages/notificaciones/Notificaciones")
);
const Inicio = lazy(() => import("./pages/Inicio"));
const Novedades = lazy(() => import("./pages/Novedades"));
const Jurisprudencia = lazy(() => import("./pages/Jurisprudencia"));
const EstadisticasBasicas = lazy(
  () => import("./analisis/salas/EstadisticasBasicas")
);
const AnalisisBasico = lazy(() => import("./analisis/salas/AnalisisBasico"));
const Busqueda = lazy(() => import("./pages/busqueda/Busqueda"));
const GeneracionRapida = lazy(
  () => import("./pages/cronologia/GeneracionRapida")
);
const CompararDatos = lazy(() => import("./pages/comparar/CompararDatos"));
const CronologiasAvanzadas = lazy(
  () => import("./pages/cronologia/CronologiasAvanzadas")
);
const CronologiasResultados = lazy(
  () => import("./pages/cronologia/CronologiasResultados")
);
const AnalisisAvanzado = lazy(
  () => import("./analisis/playground/AnalisisAvanzado")
);
const SerieTemporal = lazy(() => import("./analisis/playground/SerieTemporal"));
const Mapa = lazy(() => import("./analisis/playground/Mapa"));


const ListaRoles = lazy(() =>
  import("./pages/admin/Roles/ListaRoles").then((module) => ({
    default: module.ListaRoles,
  }))
);

const Logs = lazy(() => import("./logs/Logs"));

const PerfilUsuario = lazy(() => import("./pages/profile/Ajustes"));

const Codificacion = lazy(() => import("./codificacion/Codificacion"));
const Salas = lazy(() => import("./pages/admin/salas/Salas"));
const FormaDecision = lazy(() => import("./pages/admin/formas/FormaDecision"));
function App() {
  return (
    <AppProviders>
      <main>
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<LayoutUser />}>
                <Route path="dashboard" element={<PanelAdmin />} />
                <Route path="perfil-usuario" element={<PerfilUsuario />} />
                <Route path="admin/resoluciones" element={<SubirDatos />} />

                <Route path="codificacion" element={<Codificacion />} />
                <Route
                  path="admin/subir-autos-supremos"
                  element={<TablaCSV />}
                />
                <Route
                  path="admin/subir-jurisprudencia"
                  element={<TablaJurisprudenciaCSV />}
                />
                <Route
                  path="admin/subir-jurisprudencias"
                  element={<TablaCSV />}
                />
                <Route
                  path="admin/subir-resuelve-fondo"
                  element={<TablaResuelveFondo />}
                />
                <Route path="admin/formas-decision" element={<FormaDecision />} />
                <Route path="admin/logs" element={<Logs />} />
                <Route
                  path="admin/realizar-web-scrapping"
                  element={<WebScrapping />}
                />

                <Route path="admin/salas" element={<Salas />} />
                <Route path="admin/usuarios" element={<Usuarios />} />
                <Route path="admin/roles" element={<ListaRoles />} />
                <Route
                  path="user/notificaciones"
                  element={<Notificaciones />}
                />
              </Route>
            </Route>

            <Route path="/" element={<LayoutPublic />}>
              <Route index element={<Navigate to="/inicio" />} />
              <Route path="inicio" element={<Inicio />} />
              <Route path="novedades" element={<Novedades />} />
              <Route path="jurisprudencia" element={<Jurisprudencia />} />

              <Route path="/analisis" element={<LayoutAnalisis />}>
                <Route index element={<EstadisticasBasicas />} />
                <Route path="sala/:id" element={<AnalisisBasico />} />
              </Route>

              <Route path="resolucion/:id" element={<Resolucion />} />
              <Route path="busqueda" element={<Busqueda />} />
              <Route path="generacion-rapida" element={<GeneracionRapida />} />
              <Route path="comparar-datos" element={<CompararDatos />} />
              <Route
                path="busqueda-de-jurisprudencia"
                element={<CronologiasAvanzadas />}
              />
              <Route
                path="jurisprudencia/cronologias/resultados"
                element={<CronologiasResultados />}
              />
              <Route path="data-playground" element={<AnalisisAvanzado />} />
              <Route path="serie-temporal/:id" element={<SerieTemporal />} />
              <Route path="mapa-estadistico/:id" element={<Mapa />} />
            </Route>

            <Route>
              <Route path="*" element={<Navigate to="/404" replace />} />
              <Route path="/404" element={<My404Component />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      <ToastContainer limit={1} />
    </AppProviders>
  );
}

export default App;
