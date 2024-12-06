import React from "react";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";

const LayoutPublic = () => {
  const location = useLocation();
  const noNavbarRoutes = ["/jurisprudencia/resolucion/:id", "/iijp-login"]; 

  const FooterRoutes = [
    "/inicio",
    "/novedades",
    "/jurisprudencia",
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

export default LayoutPublic;
