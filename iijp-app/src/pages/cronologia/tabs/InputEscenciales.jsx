import React from "react";

const InputEscenciales = ({ formData, setFormData, resultado }) => {
  const cambiarFechaExacta = (e) => {
    setParametros("fecha_exacta", e.target.value);
    setParametros("fecha_desde", "");
    setParametros("fecha_hasta", "");
  };
  const cambiarFechaDesde = (e) => {
    setParametros("fecha_exacta", "");
    setParametros("fecha_desde", e.target.value);
  };

  const cambiarFechaHasta = (e) => {
    setParametros("fecha_exacta", "");
    setParametros("fecha_hasta", e.target.value);
  };

  const setParametros = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  if (
    typeof resultado !== "object" ||
    resultado === null ||
    Object.keys(resultado).length === 0
  ) {
    return <p>No hay datos disponibles.</p>;
  }

  return (
    <div className="p-4">
      <div className="text-b font-bold text-lg text-center rounded-t-lg">
        <p className="titulo">Campos de Filtrado</p>
      </div>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="departamentos"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Departamentos
          </label>
          <select
            id="departamentos"
            value={formData.departamento}
            onChange={(e) => setParametros("departamento", e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option defaultValue disabled>
              Elija un departamento
            </option>
            <option value="todos">Todos</option>
            {resultado.departamentos.map((item, index) => (
              <option value={item} key={index}>
                {item}{" "}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="departamentos"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Tipo de resoluciones
          </label>
          <select
            id="departamentos"
            onChange={(e) => setParametros("tipo_resolucion", e.target.value)}
            value={formData.tipo_resolucion}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option defaultValue disabled>
              Elija un Tipo de resoluciones
            </option>
            <option value="todas">Todas</option>
            {resultado.tipo_resolucions.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="forma_resolucion"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Forma de Resolución
          </label>
          <select
            id="forma_resolucion"
            onChange={(e) => setParametros("forma_resolucion", e.target.value)}
            value={formData.forma_resolucion}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option defaultValue disabled>
              Elija una Forma de Resolución
            </option>
            <option value="todas">Todas</option>
            {resultado.forma_resolucions.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="select-form">
          <p className="titulo dark:text-white">Fecha Exacta</p>
          <input
            value={formData.fecha_exacta}
            className="w-full p-2 border bg-gray-50 dark:[color-scheme:dark] border-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 dark:text-white"
            type="date"
            onChange={(e) => cambiarFechaExacta(e)}
          ></input>
        </div>
        <div className="select-form">
          <p className="titulo dark:text-white">Fecha Desde</p>
          <input
            value={formData.fecha_desde}
            className="w-full p-2 border bg-gray-50 dark:[color-scheme:dark] border-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 dark:text-white"
            type="date"
            onChange={(e) => cambiarFechaDesde(e)}
          ></input>
        </div>

        <div className="select-form">
          <p className="titulo dark:text-white">Fecha Hasta</p>
          <input
            value={formData.fecha_hasta}
            className="w-full p-2 border bg-gray-50 dark:[color-scheme:dark] border-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 dark:text-white"
            type="date"
            onChange={(e) => cambiarFechaHasta(e)}
          ></input>
        </div>
      </div>
      <div className="p-4">
        <label
          htmlFor="default-range"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Cantidad: <output id="value">{formData.cantidad}</output>
        </label>
        <input
          id="default-range"
          type="range"
          min="1"
          max="30"
          value={formData.cantidad}
          step="1"
          onChange={(e) => setParametros("cantidad", e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg accent-blue-700 cursor-pointer dark:bg-gray-700 "
        />
      </div>
    </div>
  );
};

export default InputEscenciales;
