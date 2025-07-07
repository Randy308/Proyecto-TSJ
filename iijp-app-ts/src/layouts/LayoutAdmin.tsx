import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AuthUser } from "../auth";

export const LayoutAdmin = () => {
  const { rol } = AuthUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (rol != "admin") {
      navigate("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Sidebar/>
      <Outlet></Outlet>

    </>
  );
};
