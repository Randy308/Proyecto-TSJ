import React, { useEffect, useState } from "react";
import Config from "./Config";
import { useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";
import axios from "axios";
import PasswordInput from "../components/PasswordInput";

const Login = () => {
  const { getToken, saveToken } = AuthUser();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");

  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) {
      navigate("/");
    }
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();

    await axios
      .get(`${process.env.REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
        withCredentials: true,
      })
      .catch(({ err }) => {
        console.log("Existe un error " + err);
      });

    await Config.getLogin({
      email: email,
      password: password,
    })
      .then(({ data }) => {
        if (data.success) {
          console.log(data);
          saveToken(data.user, data.token, data.rol[0]);
        } else {
          console.log(data);
        }
      })
      .catch(({ err }) => {
        console.log("Existe un error " + err);
      });
  };

  return (
    <div className="pt-4 mt-4">
      <div className="text-center text-black dark:text-white text-4xl font-bold">
        SAMED
      </div>
      <form className="max-w-sm mx-auto p-4 m-4 bg-white dark:bg-gray-700 dark:border-gray-900 border border-gray-300 rounded-md">
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="john.doe@company.com"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Contraseña
          </label>
          <div className="flex flex-row">
            <PasswordInput password={password} setPassword={setPassword} />
          </div>
        </div>

        {/* <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              required
            />
          </div>
          <label
            htmlFor="remember"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Si no tiene cuenta{" "}
            <a
              href="/registrar"
              className="text-blue-600 hover:underline dark:text-blue-500"
            >
              Registrase
            </a>
            .
          </label>
        </div> */}
        <div>
          <button
            type="submit"
            onClick={submitForm}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Acceder
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
