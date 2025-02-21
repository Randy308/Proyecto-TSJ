import React, { useEffect, useState } from "react";
import Config from "./Config";
import { useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";
import axios from "axios";
import PasswordInput from "../components/form/PasswordInput";
import EmailInput from "../components/form/EmailInput";

const Login = () => {
  const { getToken, saveToken } = AuthUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (getToken()) {
      navigate("/");
    }
  }, [getToken, navigate]);


  const checkFields = () => {
    return (
      email.trim() === "" ||
      password.trim() === "" ||
      emailError ||
      passwordError
    );
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (checkFields()) return;

    try {
      await axios.get(`${process.env.REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const { data } = await Config.getLogin({ email, password });

      if (data.success) {
        saveToken(data.user, data.token, data.rol[0]);
      } else {
        setPasswordError("Email o contraseña incorrectos");
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
    }
  };

  return (
    <div className="pt-4 mt-4">
      <div className="text-center text-black dark:text-white text-4xl font-bold">
        SAMED
      </div>
      <form
        onSubmit={submitForm}
        className="max-w-sm mx-auto p-4 m-4 bg-white dark:bg-gray-700 dark:border-gray-900 border border-gray-300 rounded-md"
      >
        <EmailInput
          email={email}
          setEmail={setEmail}
          emailError={emailError}
          setEmailError={setEmailError}
        />

        <PasswordInput
          password={password}
          setPassword={setPassword}
          passwordError={passwordError}
          setPasswordError={setPasswordError}
        />

        <button
          type="submit"
          disabled={checkFields()}
          className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
            checkFields()
              ? "bg-gray-300 cursor-not-allowed hover:bg-gray-300"
              : ""
          }`}
        >
          Acceder
        </button>
      </form>
    </div>
  );
};

export default Login;
