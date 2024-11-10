import React, { useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
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
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
};

export default LayoutUser;
