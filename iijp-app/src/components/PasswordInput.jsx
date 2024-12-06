import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({password, setPassword}) => {
  const [type, setType] = useState("password");
  const [visible, setVisible] = useState(false);

  const cambiarEstado = () => {
    if (type === "password") {
      setVisible(true);
      setType("text");
    } else {
      setVisible(false);
      setType("password");
    }
  };

  return (
    <>
      <input
        type={type}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        id="password"
        name="password"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="•••••••••"
        required
      />
      <button
        type="button"
        className="text-black dark:text-white p-2"
        onClick={() => cambiarEstado()}
      >
        {!visible ? <FaEye /> : <FaEyeSlash />}
      </button>
    </>
  );
};

export default PasswordInput;
