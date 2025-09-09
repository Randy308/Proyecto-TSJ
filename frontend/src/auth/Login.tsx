import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context";

import { z } from "zod";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "../components/form/CustomInput";
const schema = z.object({
  email: z
    .string()
    .email("Correo electronico invalido")
    .min(1, "El correo electronico es obligatorio"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function Login() {
  const { hasAccess, login } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
      const { success, user } = await login(data.email, data.password);

      if (!success) {
        setError("Email o contraseña incorrectos");
        return;
      }

      if (user?.role !== "user") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
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
      {/* Botón cerrar */}

      <a className="flex gap-1 items-center justify-center">
        <img src="/vite.svg" className="w-20 h-20" alt="SAMED-TSJ Logo"></img>
        <p className="titulo uppercase text-xl md:text-3xl font-black">
          SAMED-TSJ
        </p>
      </a>
      <p className="titulo text-2xl py-2 text-center">Inicio de sesión</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
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

        <div className="h-4">
          {error && (
            <div className="invalid-feedback text-red-600 text-xs">{error}</div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="text-white bg-blue-700 w-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Iniciar sesión
          </button>
        </div>
      </form>
      <div className="text-center flex items-center justify-center dark:text-white my-2">
        <p>No tienes una cuenta?</p>
      </div>
    </>
  );
}
