import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResolucionTSJ = () => {
  const { id } = useParams();
  const endpoint = `http://localhost:8000/api/resolucion/${id}`;

  const [resolucion, setResolucion] = useState(null);
  useEffect(() => {
    getAllTemas();
  }, []);

  const getAllTemas = async () => {
    try {
      const response = await axios.get(endpoint);
      setResolucion(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  if (resolucion === null) {
    return <div style={ {width:700,height:700}}>Cargando...</div>;
  }
  return (
    <div>
      {Object.entries(resolucion).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> 
          {key === 'contenido' ? (
            value.split('\r\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))
          ) : (
            value
          )}
        </div>
      ))}
    </div>
  );
  
};

export default ResolucionTSJ;
