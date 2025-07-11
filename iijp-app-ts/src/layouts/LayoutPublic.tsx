import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import MyNavbar from "../components/Navbar";

export const LayoutPublic = () => {
  const location = useLocation();
  const noNavbarRoutes: string[] = ["/jurisprudencia/resolucion/:id", "/iijp-login"];

  const FooterRoutes: string[] = [
    "/inicio",
    "/novedades",
    "/jurisprudencia",
    "/analisis",
  ];
  const shouldShowNavbar = !noNavbarRoutes.some((route) =>
    location.pathname.match(new RegExp(`^${route.replace(":id", "\\d+")}$`))
  );

  const shouldShowFooter = FooterRoutes.some((route) =>
    location.pathname.match(new RegExp(`^${route.replace(":id", "\\d+")}$`))
  );

  return (
    <>
      {shouldShowNavbar && <MyNavbar />}
      <Outlet></Outlet>
      {shouldShowFooter && <Footer />}
    </>
  );
};