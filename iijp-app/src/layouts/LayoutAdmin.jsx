import React, { useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import AuthUser from "../auth/AuthUser";

const LayoutAdmin = () => {
  const { rol } = AuthUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (rol != "admin") {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <Outlet></Outlet>

    </>
  );
};

export default LayoutAdmin;
