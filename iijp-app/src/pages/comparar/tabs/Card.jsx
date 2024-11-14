import React from "react";

const Card = () => {
  return (
    <div>
      <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 p-4 m-4">
        <li key={0}>
          <a class="inline-block px-4 py-3 text-black cursor-not-allowed dark:text-white">
            Seleccione una variable:
          </a>
        </li>
        {comparacionItems.map((item) => (
          <li class="me-2" key={item.id}>
            <a
              href="#"
              className={`inline-block px-4 py-3 rounded-lg ${
                item.id === varActiva
                  ? "text-white bg-blue-600  active"
                  : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
              onClick={() => setVarActiva(item.id)}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
      <div>
        {comparacionItems.map((item) => (
          <div
            key={item.id}
            className={`p-6 bg-white text-medium text-gray-500 dark:text-gray-400 dark:bg-[#111827] rounded-lg w-full ${
              item.id === varActiva ? "" : "hidden"
            }`}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {item.title} Tab
            </h3>
            {renderContent(item.id)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
