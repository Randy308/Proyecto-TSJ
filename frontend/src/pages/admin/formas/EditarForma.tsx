import { useState } from "react";
import { AuthService } from "../../../services";
import { IoClose } from "react-icons/io5";
import type { FormaDecision } from "./FormaDecision";

interface Props {
  sala: FormaDecision;
  setShowModal: (val: boolean) => void;
}
const EditarForma = ({ sala, setShowModal }: Props) => {
  const [grupoSala, setGrupoSala] = useState(sala.nombre.toString());
  const handleGrupoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGrupoSala(e.target.value);
  };

  const updateSala = async () => {
    if (!grupoSala) {
      console.error("No se ha seleccionado un grupo de sala");
      return;
    }
    try {
      const { data } = await AuthService.editDecideForma(
        grupoSala,
        sala.tipo,
        sala.sala_id,
        sala.resuelve_fondo_id
      );
      if (!data || !data.message) {
        throw new Error("Error al crear grupo de sala");
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error al crear grupo de sala:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
        {/* Botón cerrar */}
        <button
          onClick={setShowModal.bind(null, false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <IoClose size={20} />
        </button>

        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Editar Sala
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Sala seleccionada: <span className="font-medium">{sala.nombre}</span>
        </p>

        {/* Crear grupo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Actualizar nombre del tipo de decision
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={grupoSala}
              onChange={handleGrupoChange}
              placeholder="Nombre del grupo"
              className="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Botón actualizar */}
        <button
          onClick={updateSala}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium"
        >
          Actualizar Decision
        </button>
      </div>
    </div>
  );
};

export default EditarForma;
