import React from "react";
import "../../../Styles/Styles_randy/jurisprudencia-busqueda.css"
const JurisprudenciaBusqueda = () => {
  const style = {
    page: {
      height: 800,
    },
    header: {
      width: 600,
    },
  };
  return (
<div class="container" style={style.page}>
    <div class="row">
        <div class="col-md-12 mb-3">
            <label for="search-bar">Búsqueda por Nombre</label>
            <div  class="input-group mb-3">
                <input id="search-bar" type="text" class="form-control" placeholder="Buscar..."/>
                <div class="input-group-append">

                    <button type="button" id="BottonFiltrado" class="btn btn-info"><i
                            class="bi bi-funnel-fill"></i>Filtrar</button>
                </div>
            </div>
        </div>
    </div>
    <div id="filtrosEvento" class="FiltroInvisible">
        <div class="row">
            <div class="col-md-3 mb-3">
                <label for="">Ordenar por:</label>
                <select  class="form-control">
                    <option value="0">Recientes</option>
                    <option value="1">Antiguos</option>
                    <option value="2">Nombre A-Z</option>
                    <option value="3">Nombre Z-A</option>
                </select>
            </div>

            <div class="col-md-3 mb-3">
                <label for="">Filtrar por Estado:</label>
                <select  class="form-control">
                    <option value="activo">Activo</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="">Todos</option>
                </select>
            </div>

            <div class="col-md-3 mb-3">
                <label for="">Filtrar por Categoría:</label>
                <select class="form-control">
                    <option value="">Todos</option>
                    <option value="Diseño">Diseño</option>
                    <option value="QA">QA</option>
                    <option value="Desarrollo">Desarrollo</option>
                    <option value="Ciencia de datos">Ciencia de datos</option>
                </select>
            </div>



            <div class="col-md-3 mb-3">
                <label for="">Filtrar por Gestion:</label>
                <select  class="form-control">


                    <option value="">Todo</option>

                </select>


            </div>
        </div>
    </div>

    <div class="row">
      



    </div>

</div>
  );
};

export default JurisprudenciaBusqueda;
