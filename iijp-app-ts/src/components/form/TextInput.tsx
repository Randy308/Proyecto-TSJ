import React, { useEffect } from "react";
interface TextInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  inputError: string;
  setInputError: React.Dispatch<React.SetStateAction<string>>;
}
const TextInput = ({
  input,
  setInput,
  inputError,
  setInputError,
}: TextInputProps) => {
  useEffect(() => {
    validateInput(input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]); // Dependencia agregada para validar al cambiar el input

  const validateInput = (value: string) => {
    setInput(value);

    if (!value) {
      setInputError("El campo descripción es requerido");
    } else if (value.length < 3) {
      setInputError("El campo descripción debe tener al menos 3 caracteres");
    } else if (!value.match(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9.,:;()•°'"!?¡¿\s-]+$/)) {
      setInputError("No es una descripción válida");
    } else {
      setInputError("");
    }
  };

  return (
    <div className="mb-6">
      <label
        htmlFor="description"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Descripción
      </label>
      <textarea
        id="description"
        name="description"
        value={input}
        onChange={(e) => validateInput(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Ingrese la descripción"
        required
      />
      {inputError && <p className="text-red-400 text-sm mt-1">{inputError}</p>}
    </div>
  );
};

export default TextInput;
