import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AgTabla from "../../../components/AgTabla";

const Sala = () => {
  const { id } = useParams();
  const [sala, setSala] = useState("nombre");

  const [resoluciones, setResoluciones] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [totalRes, setTotalRes] = useState(0);

  useEffect(() => {
    const endpoint = process.env.REACT_APP_BACKEND;
    const getEstadisticas = async () => {
      try {
        const { data } = await axios.get(
          `${endpoint}/obtener-datos-sala/${id}`
        );
        setSala(data.nombre);

        setResoluciones(data.data);

        setTotalRes(data.total);
        const headers = Object.keys(data.data[0]).map((header) => ({
          field: header,
          sortable: true,
          resizable: true,
          flex: 1,
        }));
        setColumnDefs(headers);
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    };
    getEstadisticas();
  }, [id]);

  return (
    <div className="sala-contenedor flex flex-col">
      <div className="text-center p-4">
        <span className="titulo text-2xl font-bold">
          Sala: <span className="subtitulo text-2xl">{sala}</span>
        </span>
      </div>

      <div className="mb-5">
        <AgTabla
          rowData={resoluciones}
          columnDefs={columnDefs}
          pagination={true}
          width="65%"
        />
      </div>
    </div>
  );
};

export default Sala;
