import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { FormInput } from "../../types";


interface PasswordInputProps {
  password: string;
  setPassword:(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormState: React.Dispatch<
    React.SetStateAction<FormInput>
  >;
  isEditing?: boolean;
  confirmationPassword?: boolean;
}

const PasswordInput = ({
  password,
  setPassword,
  setFormState,
  confirmationPassword = false,
  isEditing = false,
}: PasswordInputProps) => {
  const [confirmationPasswordValue, setConfirmationPasswordValue] =
    useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmationError, setConfirmationError] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const validatePassword = (value: string) => {
    if (!value) return "El campo contraseña es requerido";
    if (value.length < 8)
      return "La contraseña debe tener al menos 8 caracteres";
    return "";
  };

  const validateConfirmation = () => {
    if (confirmationPasswordValue !== password) {
      return "Las contraseñas no coinciden";
    }
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(e);
    const error = validatePassword(value);
    setPasswordError(error);
  };

  const handleConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmationPasswordValue(value);
  };

  useEffect(() => {
    const pwdError = validatePassword(password);
    const confirmError = confirmationPassword ? validateConfirmation() : "";

    setPasswordError(pwdError);
    setConfirmationError(confirmError);

    setFormState((prev) => ({
      ...prev,
      password: !pwdError && (!confirmationPassword || !confirmError),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, confirmationPasswordValue, confirmationPassword, setFormState]);

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
          type={passwordVisible ? "text" : "password"}
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          className="flex-grow bg-transparent text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-white"
          placeholder="•••••••••"
          required
        />
        <button
          type="button"
          className="p-2 text-gray-700 dark:text-white focus:outline-none"
          onClick={() => setPasswordVisible((prev) => !prev)}
          aria-label={
            passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
          }
        >
          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {!isEditing && passwordError && (
        <p className="text-red-400 text-sm mt-1">{passwordError}</p>
      )}

      {confirmationPassword && (
        <>
          <label
            htmlFor="confirmation-password"
            className="block mb-2 mt-4 text-sm font-bold text-gray-900 dark:text-white"
          >
            Confirmar Contraseña
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <input
              type={confirmationVisible ? "text" : "password"}
              id="confirmation-password"
              name="confirmation-password"
              value={confirmationPasswordValue}
              onChange={handleConfirmationChange}
              className="flex-grow bg-transparent text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-white"
              placeholder="•••••••••"
              required
            />
            <button
              type="button"
              className="p-2 text-gray-700 dark:text-white focus:outline-none"
              onClick={() => setConfirmationVisible((prev) => !prev)}
              aria-label={
                confirmationVisible
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {confirmationVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {confirmationError && (
            <p className="text-red-400 text-sm mt-1">{confirmationError}</p>
          )}
        </>
      )}
    </div>
  );
};

export default PasswordInput;
