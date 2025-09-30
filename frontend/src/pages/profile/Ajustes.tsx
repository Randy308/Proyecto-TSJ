import { useState } from "react";
import NameInput from "../../components/form/NameInput";
import { useAuthContext } from "../../context";
import { FaUserCog } from "react-icons/fa";
import EmailInput from "../../components/form/EmailInput";
import PasswordInput from "../../components/form/PasswordInput";
import type { CreateUser, FormInput, UserFields } from "../../types";
import { AuthService } from "../../services";
import { toast } from "react-toastify";
import AsyncButton from "../../components/AsyncButton";

const Ajustes = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
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

  const actualizarInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setParams(event.target.name as UserFields, event.target.value);
  };

  const [formState, setFormState] = useState<FormInput>({
    email: false,
    name: false,
    password: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isFormValid = Object.values(formState).every(Boolean);

    if (!isFormValid) {
      // Aquí puedes manejar la lógica de actualización del perfil
      return;
    }
    if (loading) return;
    setLoading(true);
    AuthService.updateProfile({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })
      .then((response) => {
        if (response.data) {
          toast.success("Perfil actualizado exitosamente");
          setAuthUser(response.data.user);
        } else {
          console.error("Error al actualizar el perfil");
        }
      })
      .catch((error: unknown) => {
        console.error("Error al actualizar el perfil:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex lg:items-center flex-col lg:flex-row mb-4">
        <div className="flex items-center justify-center mb-4 lg:mb-0 lg:mr-4">
          <FaUserCog className="w-40 h-40 mr-2 dark:text-white" />
        </div>
        <div className="flex-1">
          <span className="font-semibold dark:text-white">
            Información del perfil:
          </span>

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
              <AsyncButton asyncFunction={handleSubmit} isLoading={loading} name="Actualizar Perfil" full={false} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Ajustes;
