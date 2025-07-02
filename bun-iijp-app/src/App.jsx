import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import My404Component from "./components/My404Component";
import { PrivateRoutes, PublicRoutes } from "./routes";
import { AnalisisContextProvider, HistoricContextProvider, NodosContextProvider, NotificationContextProvider, PermissionContextProvider, PostContextProvider, ResolutionContextProvider, RoleContextProvider, ThemeProvider, UserContextProvider, VariablesContextProvider } from "./context";
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
