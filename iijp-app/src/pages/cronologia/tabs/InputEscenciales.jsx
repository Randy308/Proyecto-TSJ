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

  return (
    <div className="p-4">
      <div className="text-b font-bold text-lg text-center rounded-t-lg">
        <p className="titulo">Campos de Filtrado</p>
      </div>
      <div className="p-4 m-4">
        <div className="grid grid-row-2 gap-4">
          <div className="row-select">
            <div className="select-form">
              <p className="titulo">Departamentos:</p>
              <select
                value={formData.departamento}
                className="form-control"
                onChange={(e) => setParametros("departamento", e.target.value)}
              >
                <option value="todos">Todos</option>
                {resultado.departamentos.map((item, index) => (
                  <option value={item} key={index}>
                    {item}{" "}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-form">
              <p className="titulo">Forma de Resolución</p>
              <select
                className="form-control"
                onChange={(e) =>
                  setParametros("forma_resolucion", e.target.value)
                }
                value={formData.forma_resolucion}
              >
                <option value="todas">Todas</option>
                {resultado.forma_resolucions.map((item, index) => (
                  <option value={item} key={index}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-form">
              <p className="titulo">Tipo de resoluciones</p>
              <select
                className="form-control"
                onChange={(e) =>
                  setParametros("tipo_resolucion", e.target.value)
                }
                value={formData.tipo_resolucion}
              >
                <option value="todas">Todas</option>
                {resultado.tipo_resolucions.map((item, index) => (
                  <option value={item} key={index}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row-select">
            <div className="select-form">
              <p className="titulo">Fecha Exacta</p>
              <input
                value={formData.fecha_exacta}
                className="form-control"
                type="date"
                onChange={(e) => cambiarFechaExacta(e)}
              ></input>
            </div>

            <div className="select-form">
              <p className="titulo">Fecha Desde</p>
              <input
                value={formData.fecha_desde}
                className="form-control"
                type="date"
                onChange={(e) => cambiarFechaDesde(e)}
              ></input>
            </div>
            <div className="select-form">
              <p className="titulo">Fecha Hasta</p>
              <input
                value={formData.fecha_hasta}
                className="form-control"
                type="date"
                onChange={(e) => cambiarFechaHasta(e)}
              ></input>
            </div>
          </div>
          <div className="row-select-1">
            <input
              id="pi_input"
              type="range"
              min="1"
              max="30"
              value={formData.cantidad}
              step="1"
              onChange={(e) => setParametros("cantidad", e.target.value)}
            />
            <p className="titulo">
              Cantidad: <output id="value">{formData.cantidad}</output>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputEscenciales;
