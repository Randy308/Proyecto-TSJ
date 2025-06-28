import React, { useEffect } from "react";


interface NameInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  inputError: string;
  setInputError: React.Dispatch<React.SetStateAction<string>>;
  titulo?:string
}
const NameInput = ({ input, setInput, inputError, setInputError, titulo="Nombre Completo" }:NameInputProps) => {
  useEffect(() => {
    validateInput(input);
  }, []);

  const validateInput = (e:string) => {
    const value = e;
    setInput(value);

    if (!value) {
      setInputError(`El campo ${titulo} es requerido`);
    } else if (value.length < 3) {
      setInputError(`El ${titulo} debe tener al menos 3 caracteres`);
    } else if (
      !value.match(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü'-]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü'-]+)*$/
      )
    ) {
      setInputError("No es un nombre válido");
    } else {
      setInputError("");
    }
  };

  return (
    <div className="mb-6">
      <label
        htmlFor="name"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-2xl dark:text-white"
      >
       {titulo}
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={input}
        onChange={(e) => validateInput(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={`Ingrese el ${titulo}`}
        required
      />
      {inputError && <p className="text-red-400 text-sm mt-1 lowercase">{inputError}</p>}
    </div>
  );
};

export default NameInput;
