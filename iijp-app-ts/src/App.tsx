import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HistoricContextProvider } from "./context/historicContext";
import { PostContextProvider } from "./context/postContext";

//context para rutas protegidas
import { VariablesContextProvider } from "./context/variablesContext";
import { NodosContextProvider } from "./context/nodosContext";
import PublicRoutes from "./routes/PublicRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";
import My404Component from "./components/My404Component";
import { AnalisisContextProvider } from "./context/analisisContext";
import { UserContextProvider } from "./context/userContext";
import { RoleContextProvider } from "./context/roleContext";
import { PermissionContextProvider } from "./context/permissionContext";
import { NotificationContextProvider } from "./context/notificationContext";
import { ResolutionContextProvider } from "./context/resolutionContext";

function App() {
  return (
    <ThemeProvider>
      <PostContextProvider>
        <HistoricContextProvider>
          <NodosContextProvider>
            <VariablesContextProvider>
              <AnalisisContextProvider>
                {/* Contexto para el usuario */}

                <ResolutionContextProvider>
                  <UserContextProvider>
                    <RoleContextProvider>
                      <PermissionContextProvider>
                        <NotificationContextProvider>
                          <main>
                            <Routes>
                              {PrivateRoutes}
                              {PublicRoutes}
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
      </PostContextProvider>
    </ThemeProvider>
  );
}

export default App;
