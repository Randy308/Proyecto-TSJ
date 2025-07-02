import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({
  password,
  setPassword,
  passwordError,
  setPasswordError,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const validatePassword = (e) => {
    const value = e.trim();
    setPassword(value);

    if (!value) {
      setPasswordError("El campo contraseña es requerido");
    } else if (value.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
    } else {
      setPasswordError("");
    }
  };

  useEffect(() => {
    validatePassword(password);
  }, []);
  return (
    <div className="mb-6">
      <label
        htmlFor="password"
        className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
      >
        Contraseña
      </label>

      <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <input
          type={isVisible ? "text" : "password"}
          value={password}
          onChange={(e) => validatePassword(e.target.value)}
          id="password"
          name="password"
          className="flex-grow bg-transparent text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="•••••••••"
          required
        />
        <button
          type="button"
          className="p-2 text-gray-700 dark:text-white focus:outline-none"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {isVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {passwordError && (
        <p className="text-red-400 text-sm mt-1">{passwordError}</p>
      )}
    </div>
  );
};

export default PasswordInput;
