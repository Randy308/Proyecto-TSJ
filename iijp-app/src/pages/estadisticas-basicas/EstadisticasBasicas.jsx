import React, { useEffect, useState } from 'react'
import { useVariablesContext } from '../../context/variablesContext'
import MultiBtnDropdown from '../../components/MultiBtnDropdown';
import Select from '../../components/Select';
import { BsCheck2All } from 'react-icons/bs';
import { MdOutlineRemoveCircle } from 'react-icons/md';
import EChart from '../analisis/EChart';
import D3Chart from '../../components/D3Chart';
import { IoIosArrowForward } from 'react-icons/io';
import { departamentos } from '../../data/Mapa';
import ResolucionesService from '../../services/ResolucionesService';
import { se } from 'date-fns/locale';
import { useMagistradosContext } from '../../context/magistradosContext';
import { filterForm } from '../../utils/filterForm';
import { useNavigate } from 'react-router-dom';

const EstadisticasBasicas = () => {

    const { data } = useVariablesContext();
    const [selector, setSelector] = useState([]);
    const [limite, setLimite] = useState(2);
    const [periodo, setPeriodo] = useState("all");
    const [visible, setVisible] = useState(null);

    const { magistrados } = useMagistradosContext();
    const [hoveredDepto, setHoveredDepto] = useState(null);
    const [selectedDepto, setSelectedDepto] = useState([]);
    const [validMagistrados, setValidMagistrados] = useState([]);
    const navigate = useNavigate();
    const [ciudad, setCiudad] = useState(null);
    const handleCheckboxChange = (event) => {
        const newName = event.target.name;

        setPeriodo((prev) => {
            if (prev.includes(newName)) {
                // Remove it
                return prev.filter((name) => name !== newName);
            } else {
                // Add it
                return [...prev, newName];
            }
        });
    };

    const handleClick = (name) => {
        setSelectedDepto((prev) => {
            if (prev.includes(name)) {
                // Remove it
                prev = prev.filter((item) => item !== name);
                return prev;
            } else {
                // Add it
                return [...prev, name];
            }
        });
    }
    const clearList = () => {
        setPeriodo(null);
    }
    useEffect(() => {
        if (periodo === "all" || periodo === null) {
            setValidMagistrados(magistrados);
        } else {
            const startDate = parseInt(periodo);
            const filteredMagistrados = magistrados.filter((item) => {
                const fechaMin = parseInt(item.fecha_min);
                const fechaMax = parseInt(item.fecha_max);
                return fechaMax >= startDate && fechaMin <= startDate;
            });
            setValidMagistrados(filteredMagistrados);
        }
    }, [periodo, magistrados]);



    const fetchData = async () => {

        const validatedData = filterForm({
            variable: selector[0].ids, nombre: selector[0].name, periodo: periodo, departamentos: selectedDepto
        });

        ResolucionesService.realizarAnalisis(validatedData)
            .then(({ data }) => {
                if (data) {
                    navigate(`/analisis/avanzado/${selector[0].name}`, { state: data });
                }
            })
            .catch((err) => {
                console.log("Existe un error " + err);
            });
    }
    return (
        <div>
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-4 p-4'>
                <div className='p-4 my-4 bg-white  dark:bg-gray-600 dark:text-white shadow-md rounded-lg'>
                    <div className='text-lg font-bold'>Paso 1</div>
                    <span>Seleccioné un gestión</span>
                    <div className='py-4 my-4'>
                        <ul>
                            <li className="px-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:text-xs pb-4">
                                <a
                                    onClick={() => setPeriodo(prev => prev === "all" ? null : "all")}
                                    className={`inline-flex text-center p-1 sm:p-4  border-2 border-gray-200 rounded-lg cursor-pointer  ${periodo == "all" ? "text-white bg-red-octopus-500" : "text-gray-500 bg-white dark:hover:text-gray-300 dark:border-gray-700  hover:text-gray-600  hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-700"}`} >
                                    <BsCheck2All className="w-5 h-5" />
                                    <span className="ms-3">Todos</span>
                                </a>
                                <a
                                    onClick={() => clearList()}
                                    className="dark:bg-gray-800 dark:border-gray-700 flex border hover:cursor-pointer border-gray-200 items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                >
                                    <MdOutlineRemoveCircle className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    <span className="ms-3">Quitar Selección</span>
                                </a>
                            </li>
                            <ul className="grid grid-cols-3 gap-4">

                                {data && data.periodo && Array.isArray(data.periodo) && data.periodo.map((item) => (
                                    <li key={item.id}>
                                        <input
                                            type="checkbox"
                                            id={item.nombre}
                                            name={item.nombre}
                                            value={item.nombre}
                                            className="hidden"
                                            checked={periodo === (item.nombre)}
                                            onChange={() => setPeriodo(prev => prev === item.nombre ? null : item.nombre)}
                                        />
                                        <label
                                            htmlFor={item.nombre}
                                            className={`inline-flex text-center p-1 sm:p-4  border-2 border-gray-200 rounded-lg cursor-pointer  ${periodo == (item.nombre) ? "text-white bg-red-octopus-500" : "text-gray-500 bg-white dark:hover:text-gray-300 dark:border-gray-700  hover:text-gray-600  hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-700"}`}
                                        >
                                            {item.nombre}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </ul>
                    </div>
                </div>

                <div className='p-4 m-4 bg-white dark:bg-gray-600 dark:text-white shadow-md rounded-lg lg:col-span-2 '>
                    <div className='text-lg font-bold'>Paso 2</div>
                    <div className='flex flex-row flex-wrap justify-between items-center'>

                        <span>Seleccioné un variable</span>
                        <button
                            type="button"
                            onClick={() => fetchData()}
                            className="inline-flex items-center text-white bg-red-octopus-700 hover:bg-red-octopus-600 dark:bg-blue-700 dark:hover:bg-blue-600 font-medium rounded-lg text-xs px-5 py-3 text-center">
                            <IoIosArrowForward className='w-7 pr-4' />
                            <span className='text-xs'>Analizar</span>
                        </button>
                    </div>

                    <div className='p-4 m-4'>

                        {data && data.materia && Array.isArray(data.materia) && (<MultiBtnDropdown
                            setVisible={setVisible}
                            name={"Materias"}
                            listaX={selector}
                            limite={limite}
                            setListaX={setSelector}
                            contenido={data.materia}
                            visible={visible} size={6}
                        />)}

                        {validMagistrados && (<MultiBtnDropdown
                            setVisible={setVisible}
                            name={"Magistrados"}
                            listaX={selector}
                            limite={limite}
                            setListaX={setSelector}
                            contenido={validMagistrados}
                            visible={visible} size={6}
                        />)}

                        {data && data.sala && Array.isArray(data.sala) && (<MultiBtnDropdown
                            setVisible={setVisible}
                            name={"Salas"}
                            listaX={selector}
                            limite={limite}
                            setListaX={setSelector}
                            contenido={data.sala}
                            visible={visible} size={6}
                        />)}
                    </div>
                </div>
                <div className='p-4 m-4 bg-white dark:bg-gray-600 dark:text-white shadow-md rounded-lg lg:col-span-2'>
                    <div className='text-lg font-bold'>Paso 3 (opcional)</div>
                    <div className='flex flex-row flex-wrap justify-between items-center'>

                        <span>Seleccionar departamentos en el mapa</span>
                    </div>

                    <div className="lg:col-span-2 h-[700px] bg-white pt-4 dark:bg-gray-600 dark:text-white shadow-md rounded-lg flex items-center justify-center">
                        <svg
                            viewBox="0 0 900 900"
                            className="w-full h-full p-8"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {departamentos.map((depto) => (
                                <path
                                    key={depto.id}
                                    d={depto.d}
                                    fill={selectedDepto.includes(depto.name) ? "#0ea5e9" : "#cbd5e1"}
                                    stroke="#1e293b"
                                    strokeWidth={0.9}
                                    className="cursor-pointer transition-colors duration-200"
                                    onMouseEnter={() => setHoveredDepto(depto.name)}
                                    onMouseLeave={() => setHoveredDepto(null)}
                                    onClick={() => handleClick(depto.name)}
                                />
                            ))}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EstadisticasBasicas