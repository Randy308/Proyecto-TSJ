import { useEffect, useState } from "react";
import NameInput from "../../components/form/NameInput";
import { useAuthContext } from "../../context";
import { FaUserCog } from "react-icons/fa";
import EmailInput from "../../components/form/EmailInput";
import PasswordInput from "../../components/form/PasswordInput";
import type { CreateUser, FormInput, UserFields } from "../../types";

const Ajustes = () => {
  const { authUser } = useAuthContext();

  const [formData, setFormData] = useState<CreateUser>({
    name: authUser?.name || "",
    email: authUser?.email || "",
    password: "",
  });

  const setParams = (name: UserFields, value: string | number) => {
    setFormData((prevData: CreateUser) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const actualizarInput = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setParams(event.target.name as UserFields, event.target.value);
    };

  const [formState, setFormState] = useState<FormInput>({
    email: false,
    name: false,
    password: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isFormValid = Object.values(formState).every(Boolean);

    if (isFormValid) {
      // Aquí puedes manejar la lógica de actualización del perfil
      console.log("Perfil actualizado:", { name: formData.name, email: formData.email, password: formData.password });
    } else {
      console.error("Formulario no válido");
      console.log("Estado del formulario:", formState);
    }
  };

  useEffect(() => {
    console.log("Estado del formulario:", formState);
  }, [formState]);

  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Ajustes</h1>
      <div className="flex lg:items-center flex-col lg:flex-row mb-4">
        <div className="flex items-center justify-center mb-4 lg:mb-0 lg:mr-4">
          <FaUserCog className="w-40 h-40 mr-2 dark:text-white" />
        </div>
        <div className="flex-1">
          <span className="font-semibold dark:text-white">Información del perfil:</span>

          <form
            className="flex flex-col gap-4 mt-4 lg:p-10"
            onSubmit={handleSubmit}
          >
            <NameInput
              input={formData.name ?? ""}
              setInput={actualizarInput}
              setFormState={setFormState}
            />

            <EmailInput
              email={formData.email ?? ""}
              setEmail={actualizarInput}
              setFormState={setFormState}
            />

            <PasswordInput
              password={formData.password ?? ""}
              setPassword={actualizarInput}
              setFormState={setFormState}
              confirmationPassword={true}
            />
            <div>
              <button
                type="submit"
                disabled={!formState}
                onClick={handleSubmit}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Actualizar Perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Ajustes;
