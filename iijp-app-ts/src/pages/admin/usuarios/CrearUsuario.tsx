import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserService } from "../../../services";
import axios from "axios";
import {
  useAuthContext,
  useRoleContext,
  useUserContext,
} from "../../../context";
import { EmailInput, NameInput, PasswordInput } from "../../../components/form";
import type { CreateUser, FormInput, UserFields } from "../../../types";

interface CrearUsuarioProps {
  setShowModal: (val: boolean) => void;
}
const CrearUsuario = ({ setShowModal }: CrearUsuarioProps) => {
  const { can } = useAuthContext();
  const navigate = useNavigate();

  const { obtenerUsers } = useUserContext();
  const { roles } = useRoleContext();
  const [selectedRol, setSelectedRol] = useState("");
  const [formState, setFormState] = useState<FormInput>({
    email: false,
    name: false,
    password: false,
    role: false,
  });

  const [formData, setFormData] = useState<CreateUser>({
    name: "",
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

  const changeRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRol(event.target.value);
    setFormState((prev) => ({ ...prev, role: true }));
  };

  useEffect(() => {
    if (!can("ver_usuarios")) {
      navigate("/");
    } else {
      if (roles && roles.length > 0) {
        setSelectedRol(roles[0].roleName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles]);

  const submitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Validar que el formulario sea válido
    const isFormValid = Object.values(formState).every(Boolean);

    if (!isFormValid) {
      console.error("Formulario no válido");
      return;
    }
    try {
      await UserService.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRol,
      })
        .then(({ data }) => {
          if (data) {
            console.log(data);
            setShowModal(false);
            obtenerUsers(1);
            toast.success("El usuario ha sido creado exitosamente");
          }
        })
        .catch(({ err }) => {
          console.log("Existe un error " + err);
        });
    } catch (error: unknown) {
      if (error instanceof axios.AxiosError) {
        console.error("Server Error:", error.response?.data);
        console.error("Status Code:", error.response?.status);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "request" in error
      ) {
        console.error("Network Error: No response received from the server.");
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        console.error(
          "Error Setting Up Request:",
          (error as { message: string }).message
        );
      }
    }
  };
  return (
    <div className="container mx-auto pt-4 mt-4">
      <form>
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
        />
        <div className="mb-6">
          <label
            htmlFor="rol"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Seleccionar un rol
          </label>
          <select
            id="rol"
            name="rol"
            value={selectedRol}
            onChange={(e) => changeRole(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 capitalize"
          >
            <option disabled defaultValue={""}>
              Escoge un rol
            </option>
            {roles &&
              roles.map((item) => (
                <option key={item.id} value={item.roleName}>
                  {item.roleName}
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          onClick={(e) => submitForm(e)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default CrearUsuario;
