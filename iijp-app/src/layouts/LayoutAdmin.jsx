import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import AuthUser from "../auth/AuthUser";

const LayoutAdmin = () => {
  const { getRol } = AuthUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (getRol() != "admin") {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
};

export default LayoutAdmin;
