import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import MyNavbar from "../components/MyNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import AuthUser from "../auth/AuthUser";
import Loading from "../components/Loading";

const LayoutUser = () => {
  const { hasAccess , user } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasAccess(user)) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [hasAccess, navigate]);

  if (loading) {
    return <Loading/>;
  }

  return (
    <>
      <MyNavbar />
      <Outlet />
    </>
  );
};

export default LayoutUser;
