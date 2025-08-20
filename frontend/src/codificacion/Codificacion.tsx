import { useEffect, useState } from "react";
import PortalButton from "../components/modal/PortalButton";
import { AuthService } from "../services";
import type { ResueleveFondo } from "../types";
import { EditarFondo } from "./EditarFondo";

const Codificacion = () => {
  const [resuelveFondos, setResuelveFondos] = useState<ResueleveFondo[]>();

  useEffect(() => {
    const fetchResuelveFondos = async () => {
      try {
        const { data } = await AuthService.getResuelveFondo(); // suponiendo que devuelve ResueleveFondo[]
        console.log(data.data);
        if (data.data) {
          setResuelveFondos(data.data);
        }
      } catch (error) {
        console.error("Error al obtener resuelveFondos", error);
      }
    };

    fetchResuelveFondos();
  }, []);

  // const [formaDecisiones, setFormaDecisiones] = useState<FormaDecision[]>();

  // useEffect(() => {
  //   const fetchFormaDecisiones = async () => {
  //     try {
  //       const { data } = await AuthService.getDecideForma();
  //       if (data.data) {
  //         setFormaDecisiones(data.data);
  //       }
  //     } catch (error) {
  //       console.error("Error al obtener formaDecisiones", error);
  //     }
  //   };

  //   fetchFormaDecisiones();
  // }, []);

  if (!resuelveFondos) {
    return "Cargando ...";
  }
  return (
    <div>
      <div className="overflow-x-auto p-4">
        <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Slug</th>
              <th className="border px-4 py-2">Sala</th>
              <th className="border px-4 py-2">Tipo de Decisión</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resuelveFondos.map((item, idx) => (
              <tr
                key={idx}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
              >
                <td className="border px-4 py-2">{item.nombre}</td>
                <td className="border px-4 py-2">{item.slug ?? "-"}</td>
                <td className="border px-4 py-2">{item.sala}</td>
                <td className="border px-4 py-2">{item.tipo_decision}</td>
                <td className="border px-4 py-2">
                  <PortalButton
                    name="Editar"
                    content={(_, setShowModal) => (
                      <EditarFondo item={item} setShowModal={setShowModal} />
                    )}
                    full={false}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {formaDecisiones && (
        <div className="overflow-x-auto p-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Forma de Decisión
          </h3>
          <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border px-4 py-2">Grupo de Decisión</th>
                <th className="border px-4 py-2">Resuelve Fondo</th>
                <th className="border px-4 py-2">Forma Resolución</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {formaDecisiones.map((item) => (
                <tr
                  key={item.id}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
                >
                  <td className="border px-4 py-2">{item.grupo_decision}</td>
                  <td className="border px-4 py-2">
                    {item.resuelve_fondo ?? "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {item.forma_resolucion ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}
    </div>
  );
};

export default Codificacion;
