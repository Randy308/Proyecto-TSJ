import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserService } from "../../../services";
import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRoleContext } from "../../../context/roleContext";
import { useUserContext } from "../../../context/userContext";
import type { CreateUser, FormInput, UserFields } from "../../../types";
import { useAuthContext } from "../../../context";
import { EmailInput, NameInput, PasswordInput } from "../../../components/form";

interface UsuarioProps {
  setShowModal: (val: boolean) => void;
  id: number;
}

const EditarUsuario = ({ id, setShowModal }: UsuarioProps) => {
  const { can } = useAuthContext();
  const navigate = useNavigate();
  const { roles } = useRoleContext();
  const { users, obtenerUsers } = useUserContext();
  const [formData, setFormData] = useState<CreateUser>({} as CreateUser);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setFormState] = useState<FormInput>({
    email: false,
    name: false,
    password: false,
    role: false,
  });

  useEffect(() => {
    if (!can("actualizar_usuarios")) {
      navigate("/");
    }
  }, [can, navigate]);

  const setParams = (name: UserFields, value: string | number) => {
    setFormData((prevData) => ({
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
    setFormData((prevData) => ({
      ...prevData,
      role: event.target.value.trim(),
    }));
    setFormState((prev) => ({ ...prev, role: true }));
  };

  useEffect(() => {
    if (users) {
      setFormData(
        (users as CreateUser[]).find((item) => item.id === id) ||
          ({} as CreateUser)
      );
    }
  }, [id, users]);

  const submitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(
          ([value]) =>
            value && value !== null &&
            value !== undefined &&
            value !== "" &&
            value !== "all"
        )
      );

      await UserService.updateUser(id, {
        ...filteredData,
      } as CreateUser)
        .then(({ data }) => {
          if (data) {
            setShowModal(false);
            obtenerUsers(1);
            toast.success(
              "La información del usuario se ha actualizado exitosamente"
            );
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

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="h-[400px]">
        <Loading></Loading>
      </div>
    );
  }
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
          isEditing={true}
        />
        <div className="mb-6">
          <label
            htmlFor="rol"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Seleccionar un rol
          </label>
          <select
            id="role"
            name="role"
            value={formData.role || ""}
            onChange={changeRole}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 capitalize"
          >
            <option disabled defaultValue={""} value={""}>
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
          onClick={submitForm}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Actualizar información
        </button>
      </form>
    </div>
  );
};

export default EditarUsuario;
