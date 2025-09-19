// src/AppProviders.tsx
import type { ReactNode } from "react";
import {
  CronologiaContextProvider,
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

interface Props {
  children: ReactNode;
}

export const AppProviders = ({ children }: Props) => {
  return (
    <AuthContextProvider>
      <ThemeProvider>
        <HistoricContextProvider>
          <NodosContextProvider>
            <VariablesContextProvider>
              <CronologiaContextProvider>
                <ResolutionContextProvider>
                  <UserContextProvider>
                    <RoleContextProvider>
                      <PermissionContextProvider>
                        <NotificationContextProvider>
                          {children}
                        </NotificationContextProvider>
                      </PermissionContextProvider>
                    </RoleContextProvider>
                  </UserContextProvider>
                </ResolutionContextProvider>
              </CronologiaContextProvider>
            </VariablesContextProvider>
          </NodosContextProvider>
        </HistoricContextProvider>
      </ThemeProvider>
    </AuthContextProvider>
  );
};
