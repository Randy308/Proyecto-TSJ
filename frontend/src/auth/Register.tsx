import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context";

import { z } from "zod";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "../components/form/CustomInput";
import { toast } from "react-toastify";
const schema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z
      .string()
      .email("Correo electronico invalido")
      .min(1, "El correo electronico es obligatorio"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    passwordConfirmation: z
      .string()
      .min(1, "La confirmación de la contraseña es obligatoria"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });

type FormValues = z.infer<typeof schema>;

interface Props {
  setLoginMode: (mode: boolean) => void;
}
const Register = ({ setLoginMode }: Props) => {
  const { hasAccess, register } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { success,message } = await register(
        data.name,
        data.email,
        data.password,
        data.passwordConfirmation
      );
      if (success) {
        toast.success("Usuario registrado con exito, ya puede iniciar sesión");
        setLoginMode(true);
        navigate("/");
      } else {
        console.error("Email o contraseña incorrectos");
        setError(message || "Error al registrar el usuario");
      }
    } catch (err) {
      setError("Error al registrar el usuario");
      console.error("Error en la solicitud:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasAccess()) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>
      <a className="flex gap-1 items-center justify-center">
        <img src="/vite.svg" className="w-20 h-20" alt="SAMED-TSJ Logo"></img>
        <p className="titulo uppercase text-xl md:text-3xl font-black">
          SAMED-TSJ
        </p>
      </a>
      <p className="titulo text-2xl py-2 text-center">Registrar usuario</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
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
        <CustomInput
          name="passwordConfirmation"
          control={control}
          mode="password"
          label="Confirmar Contraseña"
          placeholder="**************"
          type="password"
          error={errors.passwordConfirmation}
        />
        {error && (
          <div className="invalid-feedback text-red-600 text-xs">
            {error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className="text-white bg-blue-700 w-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Registrarse
          </button>
        </div>
      </form>
    </>
  );
};

export default Register;
