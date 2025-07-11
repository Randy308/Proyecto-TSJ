// import React, { useEffect } from "react";
// import { filterParams } from "../../utils/filterForm";
// import { useVariablesContext } from "../../context/variablesContext";

// const Tarjetas = ({ items }) => {
//   const { data } = useVariablesContext();
//   useEffect(() => {
//     const object = items.reduce((acc, item) => {
//       acc[item.name] = item.ids;
//       return acc;
//     }, {});
//     console.log("Tarjetas", object);
//     const filter = filterParams(object, data);
//     console.log("Tarjetas", filter);
//   }, [items]);

//   return <div>Tarjetas</div>;
// };

// export default Tarjetas;

export const Tarjetas = () => {
  return <div>Tarjetas</div>;
};
