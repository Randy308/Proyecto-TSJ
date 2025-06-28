import React, { useMemo, useState } from "react";
import MultiBtnDropdown from "./MultiBtnDropdown";

const Select = ({
  memoizedParams,
  limite,
  listaX,
  setListaX
}) => {
  const [visible, setVisible] = useState(null);
  const result = useMemo(() => {
    return Object.entries(memoizedParams).map(([name, contenido]) => (
      <div key={name}>
        <MultiBtnDropdown
          setVisible={setVisible}
          name={name}
          listaX={listaX}
          limite={limite}
          setListaX={setListaX}
          contenido={contenido}
          visible={visible}
        />
      </div>
    ));
  }, [memoizedParams, setVisible, listaX, setListaX, limite, visible]);

  return <div>{result}</div>;
};

export default Select;
