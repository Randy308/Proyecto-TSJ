import React from "react";

const Resumen = ({ magistrado }) => {
  if (!magistrado || magistrado.lenght < 0) {
    return <div>Cargando</div>;
  }
  return (
    <div>
      <div className="text-black dark:text-white">
        <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed">
          Primera mención registrada:{" "}
          <span className="font-bold">{magistrado.fecha_minima}</span>
        </p>
      </div>
      <div className="text-black dark:text-white">
        <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed">
          Última mención registrada:{" "}
          <span className="font-bold">{magistrado.fecha_maxima}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 custom:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {magistrado && magistrado.salas && magistrado.salas.length  > 0 && (
          <div>
            <div>
              <h5 className="block my-4  font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-gray-900 dark:text-white">
                Participación en salas
              </h5>
            </div>
            <div className="custom:overflow-x-auto sm:rounded-lg">
              <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-black uppercase bg-gray-200 dark:bg-gray-700 dark:text-white">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Sala
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Porcentaje de Participación
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {magistrado.salas &&
                    magistrado.salas.map((item,index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-100 border-b dark:odd:bg-gray-900 dark:even:bg-gray-700 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {item.nombre}
                        </th>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {" "}
                          {item.porcetaje}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {magistrado && magistrado.formas && magistrado.formas.length  > 0 && (
          <div>
            <div>
              <h5 className="block my-4  font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-gray-900 dark:text-white">
                Forma de resolución mas comunes
              </h5>
            </div>
            <div className="custom:overflow-x-auto sm:rounded-lg">
              <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-black uppercase bg-gray-200 dark:bg-gray-700 dark:text-white">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Forma de resolución
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Cantidad de resoluciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {magistrado.formas &&
                    magistrado.formas.map((item ,index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-100 border-b dark:odd:bg-gray-900 dark:even:bg-gray-700 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {item.nombre}
                        </th>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {" "}
                          {item.cantidad}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resumen;
