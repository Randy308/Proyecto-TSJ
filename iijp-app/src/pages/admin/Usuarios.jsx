import Paginate from "../../components/Paginate";
import AuthUser from "../../auth/AuthUser";
import UserService from "../../services/UserService";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { FaRegEye } from "react-icons/fa";
const Usuarios = () => {
  const { getToken } = AuthUser();
  const token = getToken();
  const [users, setUsers] = useState([]);

  const [lastPage, setLastPage] = useState(1);
  const [totalUser, setTotalUsers] = useState(0);

  const [pageCount, setPageCount] = useState(1);

  const [selectedPage, setSelectedPage] = useState(1);

  const handlePageClick = (e) => {
    selectedPage(Math.min(e.selected + 1, lastPage));
  };

  useEffect(() => {
    UserService.getAllUsers(token, selectedPage)
      .then(({ data }) => {
        setUsers(data.data);
        setLastPage(data.last_page);
        setPageCount(data.last_page);
        setTotalUsers(data.total);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [token]);

  return (
    <div>
      <div className="container mx-auto my-4 p-4 flex flex-row gap-4 justify-between">
        <div>Usuarios</div>
        <div>
          <button
            type="button"
            className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
          >
            <TiUserAdd className="w-4 h-4 me-2" />
            Crear nuevo usuario
          </button>
        </div>
      </div>

      <div>
        {users && users.length > 0 && (
          <>
            <div class="relative container overflow-x-auto mx-auto">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">
                      ID
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Nombre
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Rol
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item, index) => (
                    <tr
                      key={index}
                      class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <th scope="row" className="px-6 py-4">
                        {item.id}
                      </th>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {item.name}
                      </td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">{item.role}</td>
                      <td className="px-6 py-4 flex flex-row gap-2 items-center">
                        <a
                          href={`http://localhost:3000/jurisprudencia/resolucion/${item.id}`}
                          className="flex items-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                        >
                          <FaRegEye className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                        </a>
                        <a
                          href={`http://localhost:3000/jurisprudencia/resolucion/${item.id}`}
                          className="flex items-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                        >
                          <FaEdit className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                        </a>
                        <a
                          href={`http://localhost:3000/jurisprudencia/resolucion/${item.id}`}
                          className="flex items-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                        >
                          <MdDeleteForever className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Paginate
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            ></Paginate>
          </>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
