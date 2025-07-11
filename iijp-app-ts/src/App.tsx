import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import My404Component from "./components/My404Component";
import {
  AnalisisContextProvider,
  AuthContextProvider,
  HistoricContextProvider,
  NodosContextProvider,
  NotificationContextProvider,
  PermissionContextProvider,
  ResolutionContextProvider,
  RoleContextProvider,
  ThemeProvider,
  UserContextProvider,
  VariablesContextProvider,
} from "./providers";
import { lazy, Suspense } from "react";
import { ProtectedRoutes } from "./auth/ProtectedRoutes";
import { LayoutUser, LayoutPublic } from "./layouts/";
import { LoadingPage } from "./pages/LoadingPage";
const PanelAdmin = lazy(() => import("./pages/admin/PanelAdmin"));
const SubirDatos = lazy(() => import("./pages/datos/SubirDatos"));
const TablaCSV = lazy(() => import("./pages/datos/TablaCSV"));
const TablaJurisprudenciaCSV = lazy(
  () => import("./pages/datos/TablaJurisprudenciaCSV")
);
const WebScrapping = lazy(() => import("./pages/datos/WebScrapping"));
const Usuarios = lazy(() => import("./pages/admin/usuarios/Usuarios"));
const Notificaciones = lazy(
  () => import("./pages/notificaciones/Notificaciones")
);

const Inicio = lazy(() => import("./pages/Inicio"));
const Novedades = lazy(() => import("./pages/Novedades"));
const Jurisprudencia = lazy(() => import("./pages/Jurisprudencia"));
const EstadisticasBasicas = lazy(
  () => import("./pages/estadisticas-basicas/EstadisticasBasicas")
);
const AnalisisBasico = lazy(
  () => import("./pages/estadisticas-basicas/AnalisisBasico")
);
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
  () => import("./pages/analisis/AnalisisAvanzado")
);
const SerieTemporal = lazy(() => import("./pages/analisis/SerieTemporal"));
const Mapa = lazy(() => import("./pages/analisis/Mapa"));

const Login = lazy(() =>
  import("./auth/Login").then((module) => ({ default: module.Login }))
);

const ListaRoles = lazy(() =>
  import("./pages/admin/Roles/ListaRoles").then((module) => ({
    default: module.ListaRoles,
  }))
);

function App() {
  return (
    <AuthContextProvider>
      <ThemeProvider>
        <HistoricContextProvider>
          <NodosContextProvider>
            <VariablesContextProvider>
              <AnalisisContextProvider>
                <ResolutionContextProvider>
                  <UserContextProvider>
                    <RoleContextProvider>
                      <PermissionContextProvider>
                        <NotificationContextProvider>
                          <main>
                            <Suspense fallback={<LoadingPage />}>
                              <Routes>
                                <Route element={<ProtectedRoutes />}>
                                  <Route path="/" element={<LayoutUser />}>
                                    <Route
                                      path="dashboard"
                                      element={<PanelAdmin />}
                                    />
                                    <Route
                                      path="admin/resoluciones"
                                      element={<SubirDatos />}
                                    />
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
                                      path="admin/realizar-web-scrapping"
                                      element={<WebScrapping />}
                                    />
                                    <Route
                                      path="admin/usuarios"
                                      element={<Usuarios />}
                                    />
                                    <Route
                                      path="admin/roles"
                                      element={<ListaRoles />}
                                    />
                                    <Route
                                      path="user/notificaciones"
                                      element={<Notificaciones />}
                                    />
                                  </Route>
                                </Route>

                                <Route path="/" element={<LayoutPublic />}>
                                  <Route
                                    index
                                    element={<Navigate to="/inicio" />}
                                  />
                                  <Route path="inicio" element={<Inicio />} />
                                  <Route
                                    path="novedades"
                                    element={<Novedades />}
                                  />
                                  <Route
                                    path="jurisprudencia"
                                    element={<Jurisprudencia />}
                                  />
                                  <Route
                                    path="estadisticas-basicas"
                                    element={<EstadisticasBasicas />}
                                  />
                                  <Route
                                    path="estadisticas-basicas/:id"
                                    element={<AnalisisBasico />}
                                  />
                                  <Route
                                    path="busqueda"
                                    element={<Busqueda />}
                                  />
                                  <Route
                                    path="generacion-rapida"
                                    element={<GeneracionRapida />}
                                  />
                                  <Route
                                    path="comparar-datos"
                                    element={<CompararDatos />}
                                  />
                                  <Route
                                    path="busqueda-de-jurisprudencia"
                                    element={<CronologiasAvanzadas />}
                                  />
                                  <Route
                                    path="jurisprudencia/cronologias/resultados"
                                    element={<CronologiasResultados />}
                                  />
                                  <Route
                                    path="analisis-avanzado"
                                    element={<AnalisisAvanzado />}
                                  />
                                  <Route
                                    path="serie-temporal/:id"
                                    element={<SerieTemporal />}
                                  />
                                  <Route
                                    path="mapa-estadistico/:id"
                                    element={<Mapa />}
                                  />
                                  <Route
                                    path="iijp-login"
                                    element={<Login />}
                                  />
                                </Route>

                                <Route>
                                  <Route
                                    path="*"
                                    element={<Navigate to="/404" replace />}
                                  />
                                  <Route
                                    path="/404"
                                    element={<My404Component />}
                                  />
                                </Route>
                              </Routes>
                            </Suspense>
                          </main>
                          <ToastContainer />
                        </NotificationContextProvider>
                      </PermissionContextProvider>
                    </RoleContextProvider>
                  </UserContextProvider>
                </ResolutionContextProvider>
              </AnalisisContextProvider>
            </VariablesContextProvider>
          </NodosContextProvider>
        </HistoricContextProvider>
      </ThemeProvider>
    </AuthContextProvider>
  );
}

export default App;
