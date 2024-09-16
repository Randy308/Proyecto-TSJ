import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IoIosPerson } from "react-icons/io";
import "../../styles/styles_randy/magistradosTSJ.css";
import EstadisticasMagistrado from "./EstadisticasMagistrado";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "../../styles/tabs.css";
import ResumenMagistrado from "./ResumenMagistrado";

const MagistradoTSJ = () => {
  const { id } = useParams();
  const [magistrado, setMagistrado] = useState([]);
  useEffect(() => {
    const endpoint = process.env.REACT_APP_BACKEND;
    const getEstadisticas = async () => {
      try {
        const response = await axios.get(
          `${endpoint}/obtener-datos-magistrado/${id}`
        );
        setMagistrado(response.data.name)
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    };
    getEstadisticas();
  }, [id]);

  return (
    <div className="p-4 m-4 magistrado-contenedor">
      <div className="contenedor-datos">
        <div className="contenedor-foto">
          <IoIosPerson className="foto-perfil" />
        </div>
        <div className="detalles-magistrado">
          <span className="etiqueta-magistrado">Magistrado</span>
          <h1 className="nombre-magistrado titulo">{magistrado}</h1>
        </div>
      </div>
      <Tabs>
        <TabList>
          <Tab>Resumen</Tab>
          <Tab>Estadísticas</Tab>
        </TabList>

        <TabPanel>
          <ResumenMagistrado id={id} name={magistrado}></ResumenMagistrado>
        </TabPanel>
        <TabPanel>
          <EstadisticasMagistrado id={id}></EstadisticasMagistrado>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default MagistradoTSJ;
