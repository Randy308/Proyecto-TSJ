import React from "react";

const JurisprudenciaBusqueda = () => {
  const style = {
    page: {
      height: 800,
    },
    header: {
      width: 600,
    },
  };
  return (
    <div
      className="flex items-center justify-center bg-[#D9D9D9]"
      style={style.page}
    >
      <div className="m-4 bg-white flex flex-col">
        <div
          className="bg-[#561427] text-white h-100 text-center"
          style={style.header}
        >
          <p>Campos de Filtrado</p>
        </div>
        <div style={{ height: 500, width: 500 }} className="bg- flex flex-row flex-grow-1">
          <div>Materia</div>
          <div>
            <div>Ultimos</div>
            <div>Fecha Desde</div>
            <div>Texto</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JurisprudenciaBusqueda;
