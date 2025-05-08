import { createContext, useState, useContext, useEffect } from "react";
import ResolucionesService from "../services/ResolucionesService";

export const VariablesContext = createContext();

export const VariablesContextProvider = ({ children }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        obtenerVariables();
    }, []);

    const obtenerVariables = async () => {
        try {
            const { data } = await ResolucionesService.obtenerVariables();
            if (data) {
               setData(data)
               console.log("Data obtenida:", typeof(data));
            }
            else {
                setData([]);
            }
        } catch (err) {
            console.error("Existe un error:", err);
            setData([]);
        }
    };

    const valor = { data, setData };

    return <VariablesContext.Provider value={valor}>{children}</VariablesContext.Provider>;
};

export function useVariablesContext() {
    const context = useContext(VariablesContext);
    if (!context) {
        throw new Error("useVariablesContext must be used within a VariableProvider");
    }
    return context;
}
