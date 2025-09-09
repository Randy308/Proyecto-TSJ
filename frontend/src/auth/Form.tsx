import { Login } from "./Login";
import Register from "./Register";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface Props {
  setShowModal: (val: boolean) => void;
}
export const Form = ({ setShowModal }: Props) => {
  const [loginMode, setLoginMode] = useState(true);
  const render = () => {
    if (loginMode) {
      return <Login />;
    } else {
      return <Register  setLoginMode={setLoginMode}/>;
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-4 relative animate-fadeIn">
        <button
          onClick={setShowModal.bind(null, false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <IoClose size={20} />
        </button>

        {render()}

        <div className="h-4 text-center py-2 dark:text-white mb-4">
          {loginMode ? "No tienes una cuenta?" : "Ya tienes una cuenta?"}
          <a
            href="#"
            onClick={() => setLoginMode(!loginMode)}
            className="text-blue-600 dark:text-blue-300 hover:underline pl-1"
          >
            {loginMode ? "Registrarse" : "Iniciar sesión"}
          </a>
        </div>
      </div>
    </div>
  );
};
