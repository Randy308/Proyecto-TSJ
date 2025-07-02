import React, { useMemo, useState } from "react";
import MultiBtnDropdown from "./MultiBtnDropdown";
import type { FiltroNombre, ListaData, ListaX, Variable } from "../types";

interface SelectProps {
  limite: number;
  listaX: ListaX[];
  setListaX: React.Dispatch<React.SetStateAction<ListaX[] | undefined>>;
  memoizedParams: Variable;
}

const Select = ({ memoizedParams, limite, listaX, setListaX }: SelectProps) => {
  const [visible, setVisible] = useState<string | null>(null);
  const result = useMemo(() => {
    return Object.entries(memoizedParams).map(([name, contenido]) => (
      <div key={name}>
        <MultiBtnDropdown
          setVisible={setVisible}
          listaX={listaX}
          limite={limite}
          setListaX={setListaX}
          name={name as FiltroNombre}
          contenido={contenido as ListaData[]}
          visible={visible}
        />
      </div>
    ));
  }, [memoizedParams, setVisible, listaX, setListaX, limite, visible]);

  return <div>{result}</div>;
};

export default Select;
