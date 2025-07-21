import PortalButton from "../components/modal/PortalButton";
import { DecidoForma } from "./DecideForma";
import { ResuelveFondo } from "./ResuelveFondo";

const Codificacion = () => {
  return (
    <div>
      <div>
        <PortalButton
          name="Crear nuevo fondo de decision"
          content={() => (
            <ResuelveFondo/>
          )}
          full={false}
        />

         <PortalButton
          name="Crear nuevo fondo de decision"
          content={() => (
            <DecidoForma/>
          )}
          full={false}
        />

      </div>
    </div>
  );
};

export default Codificacion;
