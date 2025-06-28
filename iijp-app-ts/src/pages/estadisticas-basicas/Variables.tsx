import React from 'react'

const Variables = () => {
    return (
        <div>   {data && data.sala && Array.isArray(data.sala) && (<MultiBtnDropdown
            setVisible={setVisible}
            name={"Salas"}
            listaX={selector}
            limite={limite}
            setListaX={setSelector}
            contenido={data.sala}
            visible={visible}
        />)}</div>
    )
}

export default Variables