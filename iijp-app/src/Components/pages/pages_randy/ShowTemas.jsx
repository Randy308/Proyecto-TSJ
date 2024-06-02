import React, { useEffect, useState } from "react";
import axios from "axios";

const endpoint = "http://localhost:8000/api";
const ShowTemas = () => {
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    getAllTemas();
  }, []);

  const getAllTemas = async () => {
    try {
      const response = await axios.get(`${endpoint}/temas-generales`);
      setTemas(response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <div className="container mx-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Nombre
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {temas.map((tema) => (
            <tr key={tema.id}>
              <td className="px-6 py-4 whitespace-nowrap">{tema.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{tema.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowTemas;
