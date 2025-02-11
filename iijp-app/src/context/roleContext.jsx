import { createContext, useState, useContext } from "react";

export const RoleContext = createContext();

export const RoleContextProvider = ({ props }) => {
  const [roles, setRoles] = useState([]);
  const valor = { roles, setRoles };

  return (
    <RoleContext.Provider value={valor}>{props.children}</RoleContext.Provider>
  );
};

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
}
/*
import {RoleContextProvider}
<RoleContextProvider>
    children
</RoleContextProvider>

import {useRoleContext}
const {roles, setRoles} = useRoleContext();
*/
