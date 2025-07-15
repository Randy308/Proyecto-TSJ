import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { useAuthContext } from "../context";
import { EmailInput, PasswordInput } from "../components/form";
import type { CreateUser, FormInput, UserFields } from "../types";

export function Login() {
  const { hasAccess, login } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<FormInput>({
    email: false,
    password: false,
  });

  const [formData, setFormData] = useState<CreateUser>({
    email: "",
    password: "",
  });

  const setParams = (name: UserFields, value: string | number) => {
    setFormData((prevData: CreateUser) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const actualizarInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setParams(event.target.name as UserFields, event.target.value);
  };

  const [error, setError] = useState("");
  useEffect(() => {
    if (hasAccess()) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isFormValid = Object.values(formState).every(Boolean);
    if (!isFormValid) return;
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { success } = await login(formData.email ?? "", formData.password ?? "");

      if (success) {
        navigate("/dashboard");
      } else {
        setError("Email o contraseña incorrectos");
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-gray-300 dark:bg-gray-900 bg-cover bg-center bg-no-repeat bg-fixed flex flex-col justify-center items-center h-screen w-screen sm:p-5 md:p-10 lg:p-30">
      <div className="grid md:grid-cols-3 sm:grid-cols-1 shadow-lg rounded-lg">
        <div className="md:col-span-2 col-span-1">
          <img
            src="derechoo.webp"
            className="object-contain w-full h-full"
            alt="Logo UMSS"
          ></img>
        </div>
        <div className="col-span-1 flex items-center bg-white dark:bg-gray-700 dark:border-gray-900 border border-gray-300 rounded-md">
          <form onSubmit={submitForm} className="w-full p-4 ml-0 mt-0 ">
            <div className="text-center text-black dark:text-white text-4xl font-bold titulo">
              SAMED
            </div>
            <EmailInput
              email={formData.email}
              setEmail={actualizarInput}
              setFormState={setFormState}
            />

            <PasswordInput
              password={formData.password ?? ""}
              setPassword={actualizarInput}
              setFormState={setFormState}
            />
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            <button
              type="submit"
              disabled={!formState}
              className={`text-white bg-red-octopus-700 hover:bg-red-octopus-800 focus:ring-4 focus:outline-none focus:ring-red-octopus-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                !formState
                  ? "bg-gray-300 cursor-not-allowed hover:bg-gray-300"
                  : ""
              }`}
            >
              {isLoading ? (
                <CgSpinner className="inline w-5 h-5 me-3 text-white animate-spin dark:text-gray-600" />
              ) : (
                "Acceder"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
