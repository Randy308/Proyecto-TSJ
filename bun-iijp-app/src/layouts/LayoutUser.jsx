import React, { Suspense, useEffect, useState } from "react";
import Footer from "../components/Footer";
import MyNavbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import AuthUser from "../auth/AuthUser";
import Loading from "../components/Loading";
import Sidebar from "../components/Sidebar";

const LayoutUser = () => {
  const { hasAccess, user } = AuthUser();
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
    return <Loading />;
  }

  return (
    <>
      <Sidebar />

      <div className="py-4 px-0 md:px-4 sm:ml-64">
        <div className="py-4 px-0 md:px-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default LayoutUser;
