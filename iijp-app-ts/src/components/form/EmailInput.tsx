import React, { use, useEffect } from "react";
import type { FormInput } from "../../types";

interface EmailInputProps {
  email: string;
  setEmail: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormState: React.Dispatch<
    React.SetStateAction<FormInput>
  >;
}

const EmailInput = ({ email, setEmail, setFormState }: EmailInputProps) => {
  const [emailError, setEmailError] = React.useState("");

  const validateEmail = (value: string): string => {
    if (!value) {
      return "El campo email es requerido";
    }
    if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return "No es un email válido";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(e); // ✅ actualizamos valor global solo en eventos
    const error = validateEmail(value);
    setFormState((prev) => ({ ...prev, email: !error }));
  };

  useEffect(() => {
    const error = validateEmail(email);
    setEmailError(error);
    setFormState((prev) => ({ ...prev, email: !error }));
    // No se hace setEmail aquí 👈
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar (puedes poner [email] si lo necesitas reactivo)

  return (
    <div className="mb-6">
      <label
        htmlFor="email"
        className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
      >
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Ingrese su email"
        required
      />
      {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
    </div>
  );
};

export default EmailInput;
