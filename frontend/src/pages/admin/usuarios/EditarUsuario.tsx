import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserService } from "../../../services";
import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRoleContext } from "../../../context/roleContext";
import { useUserContext } from "../../../context/userContext";
import type { CreateUser } from "../../../types";
import { useAuthContext } from "../../../context";

import { z } from "zod";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "../../../components/form/CustomInput";
import { filterForm } from "../../../utils/filterForm";
const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z
    .string()
    .email("Correo electronico invalido")
    .min(1, "El correo electronico es obligatorio"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface UsuarioProps {
  setShowModal: (val: boolean) => void;
  id: number;
}

const EditarUsuario = ({ id, setShowModal }: UsuarioProps) => {
  const { can } = useAuthContext();
  const navigate = useNavigate();
  const { roles } = useRoleContext();
  const { users, obtenerUsers } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (!can("actualizar_usuarios")) {
      navigate("/");
    }
  }, [can, navigate]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const filteredData = filterForm({...data, role});
    console.log(filteredData);

    if (!filteredData.role || role === "") {
      toast.error("Debe seleccionar un rol para el usuario");
      return;
    }
    try {
      await UserService.updateUser(id, { ...filteredData } as CreateUser)
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

  const changeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };
  useEffect(() => {
    if (users) {
      const user = users.find((item) => item.id === id);
      console.log(user);
      if (user) {
        setRole(user.role || "");
        reset(user);
        setIsLoading(false);
      }
    }
  }, [id, reset, users]);

  if (!users || isLoading) return <Loading />;
  return (
    <div className="container mx-auto pt-4 mt-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          name="name"
          control={control}
          label="Nombre"
          placeholder="Ingrese su nombre completo"
          type="text"
          error={errors.name}
        />
        <CustomInput
          name="email"
          control={control}
          label="Email"
          placeholder="Ingrese su email"
          type="email"
          error={errors.email}
        />
        <CustomInput
          name="password"
          control={control}
          label="Contraseña"
          placeholder="**************"
          type="password"
          mode="password"
          error={errors.password}
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
            value={role || ""}
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
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Actualizar información
        </button>
      </form>
    </div>
  );
};

export default EditarUsuario;
