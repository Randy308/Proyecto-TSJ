import { Outlet } from "react-router-dom";
import { CronologiaContextProvider } from "../providers";

export const LayoutCronologias = () => {
  return (
    <CronologiaContextProvider>
      <Outlet />
    </CronologiaContextProvider>
  );
};
