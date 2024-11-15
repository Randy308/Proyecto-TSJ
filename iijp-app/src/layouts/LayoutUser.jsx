import React, { useEffect } from "react";
import Footer from "../components/Footer";
import MyNavbar from "../components/MyNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import AuthUser from "../auth/AuthUser";

const LayoutUser = () => {
  const { rol } = AuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (rol !== "user" && rol !== "editor") {
      navigate("/");
    }
  }, [rol, navigate]);
  return (
    <>
      <MyNavbar></MyNavbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
};

export default LayoutUser;
