import { useNotificationContext } from "../../context/notificationContext";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { UserService } from "../../services";
import { useAuthContext } from "../../context";
import { BsCheckAll } from "react-icons/bs";
import { useState } from "react";
import AsyncButton from "../../components/AsyncButton";
import { IoReloadOutline } from "react-icons/io5";

const Notificaciones = () => {
  const { notifications, setNotifications } = useNotificationContext();

  const [loadingButtons, setLoadingButtons] = useState<Record<string, boolean>>(
    {}
  );
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const { hasAccess } = useAuthContext();
  if (!hasAccess()) {
    return null;
  }

  const updateNotification = async (id: number) => {
    const notification = (notifications || []).find((n) => n.id === id);

    if (!notification) {
      console.warn(`No se encontró notificación con ID ${id}`);
      return;
    }

    if (notification.estado !== "unread") {
      console.log(`La notificación con ID ${id} ya está leída`);
      return;
    }

    // Optimistic update
    setNotifications((prevNotifications) =>
      (prevNotifications || []).map((n) =>
        n.id === id ? { ...n, estado: "read" } : n
      )
    );

    try {
      await UserService.markNotificationAsRead(id);
    } catch (error) {
      console.error("Error marcando notificación como leída:", error);

      // Revertir estado si falla la API
      setNotifications((prevNotifications) =>
        (prevNotifications || []).map((n) =>
          n.id === id ? { ...n, estado: "unread" } : n
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (loadingButtons["markAllAsRead"]) return;
    setLoadingButtons((prev) => ({ ...prev, markAllAsRead: true }));

    try {
      await UserService.markAllNotificationsAsRead();
      setNotifications((prevNotifications) =>
        (prevNotifications || []).map((n) =>
          n.estado === "unread" ? { ...n, estado: "read" } : n
        )
      );
    } catch (error) {
      console.error("Error marcando notificaciones como leídas:", error);
    } finally {
      setLoadingButtons((prev) => ({ ...prev, markAllAsRead: false }));
    }
  };

  const synchronizeNotifications = async () => {
    if (loadingButtons["synchronizeNotifications"]) return;
    setLoadingButtons((prev) => ({ ...prev, synchronizeNotifications: true }));

    try {
      const response = await UserService.getUnreadNotifications();

      if (response.data && response.data.length > 0) {
        setNotifications(response.data);
      } else {
        console.log("No hay nuevas notificaciones");
      }
    } catch (error) {
      console.error("Error sincronizando notificaciones:", error);
    } finally {
      setLoadingButtons((prev) => ({
        ...prev,
        synchronizeNotifications: false,
      }));
    }
  };

  const allNotifications = async () => {
    if (loadingButtons["allNotifications"]) return;
    setLoadingButtons((prev) => ({ ...prev, allNotifications: true }));

    if (page === lastPage && lastPage !== 0) {
      setLoadingButtons((prev) => ({
        ...prev,
        allNotifications: false,
      }));
      return;
    }
    try {
      const response = await UserService.getAllNotifications(page);

      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        setNotifications(response.data.data);
        const lastPage = response.data.last_page;
        setLastPage(lastPage);
        setPage((prev) => Math.min(prev + 1, lastPage));
      } else {
        console.log("No hay nuevas notificaciones");
      }
    } catch (error) {
      console.error("Error sincronizando notificaciones:", error);
    } finally {
      setLoadingButtons((prev) => ({
        ...prev,
        allNotifications: false,
      }));
    }
  };
  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl titulo font-bold mb-4 text-black dark:text-white">
          Notificaciones
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Aquí puedes ver tus notificaciones recientes.
        </p>
      </div>
      <div id="user-dropdown" className={`z-50 my-4 text-base list-none `}>
        <div className="flex justify-start gap-4 flex-wrap items-center mb-4">
          {notifications && notifications.length > 0 && (
            <>
              <AsyncButton
                asyncFunction={markAllAsRead}
                isLoading={loadingButtons["markAllAsRead"]}
                name="Leer todas las notificaciones"
                Icon={BsCheckAll}
                full={false}
              />
              <AsyncButton
                asyncFunction={synchronizeNotifications}
                isLoading={loadingButtons["synchronizeNotifications"]}
                name="Sincronizar notificaciones"
                Icon={IoReloadOutline}
                full={false}
              />
            </>
          )}
          <AsyncButton
            asyncFunction={allNotifications}
            isLoading={loadingButtons["allNotifications"]}
            name="Traer todas las notificaciones"
            Icon={IoReloadOutline}
            full={false}
          />
        </div>
        <ul
          className="py-2 flex flex-col gap-4"
          aria-labelledby="user-menu-button"
        >
          {notifications && notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li
                key={index}
                className={`px-4 py-2  h-20 flex flex-col  justify-around text-xs bg-white rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600  ${
                  notification.estado === "unread"
                    ? "text-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white hover:cursor-pointer hover:bg-gray-100"
                    : "text-gray-500"
                }`}
                onClick={() => updateNotification(notification.id)}
              >
                <p>{notification.mensaje}</p>
                <span>
                  {notification.enlace && (
                    <a
                      href={notification.enlace}
                      className="text-blue-400 underline"
                      target="_blank"
                    >
                      Abrir documento
                    </a>
                  )}
                </span>
                <span className="text-red-octopus-900 dark:text-blue-700">
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </li>
            ))
          ) : (
            <li className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              No hay notificaciones
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notificaciones;
