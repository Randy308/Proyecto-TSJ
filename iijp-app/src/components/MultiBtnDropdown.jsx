import React, { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
const MultiBtnDropdown = ({
  setVisible,
  visible,
  name,
  limite,
  listaX,
  setListaX,
  contenido,
}) => {
  const [activo, setActivo] = useState(false);
  const handleCheckboxChange = (event) => {
    const itemId = parseInt(event.target.name, 10);

    setListaX((prev) => {

      const isNamePresent = prev.some((item) => item.name === name);

      if (isNamePresent) {

        return prev
          .map((item) =>
            item.name === name
              ? {
                  ...item,
                  ids: item.ids.includes(itemId)
                    ? item.ids.filter((id) => id !== itemId) 
                    : [...item.ids, itemId], 
                }
              : item
          )
          .filter((item) => item.ids.length > 0); 
      } else {
        
        if (limite === 0) {
          return prev; 
        }

        const newState = [...prev, { ids: [itemId], name }];

        return newState.length > limite ? newState.slice(1) : newState;
      }
    });
  };


  const handleClick = () => {
    const nextState = !activo;
    setActivo(nextState);

    if (nextState) {
      setVisible(name);
    } else {
      setVisible(null);
    }
  };
  useEffect(() => {
    if (visible != name) {
      setActivo(false);
    }
  }, [visible]);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`w-full justify-between  
         border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg 
         text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 
          dark:border-gray-700 dark:text-white  me-2 mb-2 ${
            listaX.some((item) => item.name === name)
              ? "bg-blue-700 hover:bg-blue-900 border text-white"
              : "bg-white hover:bg-gray-100 dark:hover:bg-gray-700 border text-gray-900 dark:bg-gray-800"
          }`}
      >
        {name}
        {activo ? (
          <IoIosArrowUp className="w-6 h-5 me-2 -ms-1 " />
        ) : (
          <IoIosArrowDown className="w-6 h-5 me-2 -ms-1" />
        )}
      </button>
      <ul className={`flex flex-col gap-4 ${activo ? "" : "hidden"}`}>
        {contenido.map((currentItem) => (
          <li key={currentItem.id}>
            <input
              type="checkbox"
              id={currentItem.nombre}
              name={currentItem.id}
              value={currentItem.id}
              className="hidden peer"
              checked={listaX.some(
                (item) =>
                  item.name === name && item.ids.includes(currentItem.id)
              )}
              onChange={handleCheckboxChange}
            />
            <label
              htmlFor={currentItem.nombre}
              className="inline-flex items-center justify-between w-full p-3 custom:p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div className="flex flex-row gap-3 items-center custom:gap-2">
                <div className="roboto-regular text-sm text-black dark:text-white custom:text-xs">
                  {currentItem.nombre}
                </div>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MultiBtnDropdown;