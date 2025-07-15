import { useEffect, useState } from "react";
import type { FormInput } from "../../types";



interface NameInputProps {
  input: string;
  setInput: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormState: React.Dispatch<
    React.SetStateAction<FormInput>
  >;
  titulo?: string;
}

const NameInput = ({
  input,
  setInput,
  setFormState,
  titulo = "Nombre Completo",
}: NameInputProps) => {
  const validateInput = (value: string) => {
    if (!value) {
      return `El campo ${titulo} es requerido`;
    }
    if (value.length < 3) {
      return `El ${titulo} debe tener al menos 3 caracteres`;
    }
    if (
      !value.match(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü'-]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü'-]+)*$/
      )
    ) {
      return "No es un nombre válido";
    }
    return "";
  };

  const [inputError, setInputError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInput(e);
    const error = validateInput(e.target.value.trim());
    setInputError(error);
    // En el hijo (por ejemplo, EmailInput)
    setFormState((prev) => ({ ...prev, name: !error }));
  };

  useEffect(() => {
    const error = validateInput(input);
    setInputError(error);
    setFormState((prev) => ({ ...prev, name: !error }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={`Ingrese el ${titulo}`}
        required
      />
      {inputError && (
        <p className="text-red-400 text-sm mt-1 lowercase">{inputError}</p>
      )}
    </div>
  );
};

export default NameInput;
