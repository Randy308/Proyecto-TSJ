import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Sidebar from "../components/Sidebar";
import { useAuthContext } from "../context";

export const LayoutUser = () => {
    const { hasAccess } = useAuthContext();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasAccess()) {
      navigate("/");
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Sidebar />

      <div className="py-4 px-0 md:px-4 sm:ml-64">
        <div className="py-4 px-0 md:px-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <Outlet />
        </div>
      </div>

    </>
  );
};