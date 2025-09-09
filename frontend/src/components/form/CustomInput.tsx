import { useState } from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldError,
} from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Props {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  type?: string;
  error?: FieldError;
  placeholder: string;
  mode?: "normal" | "password";
}
const CustomInput = ({
  name,
  control,
  label,
  type,
  placeholder,
  error,
  mode = "normal",
}: Props) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderInput = (field: ControllerRenderProps<any, string>) => {
    return (
      <div className="flex flex-row">
        <input
          id={name}
          type={
            mode === "normal" ? type : passwordVisible ? "text" : "password"
          }
          placeholder={placeholder}
          {...field}
          className={`form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
            error ? "is-invalid" : ""
          }`}
        />

        {type === "password" && mode === "password" && (
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
        )}
      </div>
    );
  };
  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => renderInput(field)}
      />

      <div className="h-4">
        {error && (
          <div className="invalid-feedback text-red-600 text-xs">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomInput;
