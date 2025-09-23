import Modal from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  onClose: (id: number | null) => void;
  id: number;
}
const ConfirmModal = ({
  isOpen,
  setIsOpen,
  onClose,
  id,
}: ConfirmModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={setIsOpen}
      title="Seleccione una opción"
      size="sm"
    >
      <div className="space-y-4 p-6">
        <div className="flex gap-3 justify-end">
          <a
            onClick={setIsOpen}
            target="_blank"
            href={`/cronojuridicas/resolucion/${id}`}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Abrir en otra pestaña
          </a>
          <button
            onClick={() => {
              onClose(id);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Abrir aquí
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default ConfirmModal;
