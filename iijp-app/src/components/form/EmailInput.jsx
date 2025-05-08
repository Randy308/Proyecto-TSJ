import React, { useEffect } from "react";

const EmailInput = ({ email, setEmail, emailError, setEmailError }) => {
  useEffect(() => {
    validateEmail(email);
  }, []);

  const validateEmail = (e) => {
    const value = e.trim();
    setEmail(value);

    if (!value) {
      setEmailError("El campo email es requerido");
    } else if (
      !value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      setEmailError("No es un email válido");
    } else {
      setEmailError("");
    }
  };

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
        onChange={(e) => validateEmail(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Ingrese su email"
        required
      />
      {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
    </div>
  );
};

export default EmailInput;
