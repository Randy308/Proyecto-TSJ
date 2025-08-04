import { Outlet } from "react-router-dom";
import { AnalisisContextProvider } from "../providers";

export const LayoutAnalisis = () => {
  return (
    <AnalisisContextProvider>
      <Outlet />
    </AnalisisContextProvider>
  );
};
