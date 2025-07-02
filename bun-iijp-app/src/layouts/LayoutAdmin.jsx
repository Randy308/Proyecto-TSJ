import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthUser from "../auth/AuthUser";
import Sidebar from "../components/Sidebar";

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
      <Sidebar/>
      <Outlet></Outlet>

    </>
  );
};

export default LayoutAdmin;
