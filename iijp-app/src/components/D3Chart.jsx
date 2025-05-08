import React, { useEffect, useMemo, useRef, useState } from "react";
import boliviaJson from "../data/Bolivia.json";
import ReactECharts from "echarts-for-react";
import { registerMap } from "echarts/core";
import { geoMercator } from "d3-geo";
import "../data/dark.js";
import "../data/vintage.js";
import { useThemeContext } from "../context/ThemeProvider";

const D3Chart = ({ setData }) => {
    const isDarkMode = useThemeContext();

    registerMap("Bolivia", boliviaJson);
    const [selectedDepartments, setSelectedDepartments] = useState([]);


    const chartRef = useRef(null);

    useEffect(() => {
        const instance = chartRef.current.getEchartsInstance();

        const handleClick = (params) => {
            setSelectedDepartments(prev => {
                if (prev.includes(params.name)) {
                    return prev.filter(name => name !== params.name); // quitar si ya estaba
                } else {
                    return [...prev, params.name]; // agregar si no estaba
                }
            });

            setData(params.name);
        };

        instance.on("click", handleClick);
        return () => {
            instance.off("click", handleClick);
        };
    }, []);

    const projection = geoMercator();

    const option = useMemo(() => ({
        series: [
            {
                name: "Resoluciones",
                type: "map",
                roam: true,
                map: "Bolivia",
                projection: {
                    project: (point) => projection(point),
                    unproject: (point) => projection.invert(point),
                },
                label: {
                    show: true,
                    fontSize: 11,
                    color: "black",
                },
                emphasis: {
                    itemStyle: {
                        areaColor: "rgba(255, 215, 0, 0.4)",
                    },
                    label: {
                        show: true,
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#000",
                    },
                },
                itemStyle: {
                    borderColor: "#999",
                    borderWidth: 0.5,
                },
                // Pintar departamentos seleccionados
                regions: selectedDepartments.map(name => ({
                    name,
                    itemStyle: {
                        areaColor: "#4caf50", // verde para seleccionados
                    }
                }))
            },
        ],
    }), [isDarkMode, selectedDepartments]);



    return (
        <ReactECharts ref={chartRef}
            theme={isDarkMode ? "dark" : "vintage"}
            option={option}
            style={{ height: "100%", width: "100%" }}
        />
    );
};

export default D3Chart;
