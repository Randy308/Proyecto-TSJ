import { useEffect, useState, type FormEventHandler } from "react";
import Config from "./Config";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/form/PasswordInput";
import EmailInput from "../components/form/EmailInput";
import { CgSpinner } from "react-icons/cg";
import { AuthUser } from "./AuthUser";

export const Login = () => {
  const { getToken, saveToken } = AuthUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  useEffect(() => {
    if (getToken()) {
      navigate("/");
    }
  }, [getToken, navigate]);

  const checkFields = (): boolean => {

    return (emailError !== "" || passwordError !== "") && (
      email.trim() !== "" && password.trim() !== "" 
    );
  };
  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkFields()) return;
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { data } = await Config.getLogin({ email, password });

      if (data.success) {
        saveToken(data.user, data.login, data.rol[0]);
      } else {
        setPasswordError("Email o contraseña incorrectos");
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-gray-300 dark:bg-gray-900 bg-cover bg-center bg-no-repeat bg-fixed flex flex-col justify-center items-center h-screen w-screen sm:p-10 md:p-20 lg:p-40">
      <div className="grid md:grid-cols-3 sm:grid-cols-1">
        <div className="md:col-span-2 col-span-1">
          <img
            src="https://www.umss.edu.bo/wp-content/uploads/2019/09/1010069.jpg"
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
              className={`text-white bg-red-octopus-700 hover:bg-red-octopus-800 focus:ring-4 focus:outline-none focus:ring-red-octopus-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                checkFields()
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
};
