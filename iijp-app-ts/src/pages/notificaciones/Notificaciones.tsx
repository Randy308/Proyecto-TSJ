import { useNotificationContext } from "../../context/notificationContext";
import {AuthUser} from "../../auth";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import UserService from "../../services/UserService";

const Notificaciones = () => {
  const { notifications, setNotifications } = useNotificationContext();

  const { getToken } = AuthUser();
  if (!getToken()) {
    return null;
  }

  const updateNotification = async (id:number) => {
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
      (prevNotifications || []).map((n) => (n.id === id ? { ...n, estado: "read" } : n))
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

  return (
    <div>
      {notifications && notifications.length > 0 ? (
        <div id="user-dropdown" className={`z-50 my-4 text-base list-none `}>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notificaciones recientes:
          </p>
          <ul
            className="py-2 flex flex-col gap-4"
            aria-labelledby="user-menu-button"
          >
            {notifications.length > 0 ? (
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
      ) : (
        <p className="p-4 my-4 text-xl text-gray-600 bg-white dark:bg-gray-900 rounded-lg shadow-lg">No existen notificaciones recientes</p>
      )}
    </div>
  );
};

export default Notificaciones;
