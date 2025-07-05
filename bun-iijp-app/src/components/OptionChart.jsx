export const chartConfigs = {
  bar: {
    title: {
      text: "Ventas Mensuales - Gráfico de Barras",
      left: "center",
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: data.months,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      name: "Ventas",
    },
    series: [
      {
        name: "Ventas",
        type: "bar",
        data: data.sales,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#667eea" },
            { offset: 1, color: "#764ba2" },
          ]),
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  },

  line: {
    title: {
      text: "Ventas Mensuales - Gráfico de Líneas",
      left: "center",
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: data.months,
    },
    yAxis: {
      type: "value",
      name: "Ventas",
    },
    series: [
      {
        name: "Ventas",
        type: "line",
        data: data.sales,
        smooth: true,
        itemStyle: {
          color: "#667eea",
        },
        lineStyle: {
          width: 3,
        },
        symbol: "circle",
        symbolSize: 8,
      },
    ],
  },

  pie: {
    title: {
      text: "Distribución de Ventas por Producto",
      left: "center",
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Ventas",
        type: "pie",
        radius: "60%",
        center: ["50%", "60%"],
        data: data.products.map((product, index) => ({
          value: data.sales[index],
          name: product,
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  },

  scatter: {
    title: {
      text: "Ventas Mensuales - Gráfico de Dispersión",
      left: "center",
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    xAxis: {
      type: "category",
      data: data.months,
    },
    yAxis: {
      type: "value",
      name: "Ventas",
    },
    series: [
      {
        name: "Ventas",
        type: "scatter",
        data: data.sales,
        symbolSize: 15,
        itemStyle: {
          color: "#667eea",
        },
      },
    ],
  },

  area: {
    title: {
      text: "Ventas Mensuales - Gráfico de Área",
      left: "center",
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: data.months,
    },
    yAxis: {
      type: "value",
      name: "Ventas",
    },
    series: [
      {
        name: "Ventas",
        type: "line",
        data: data.sales,
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(102, 126, 234, 0.8)" },
            { offset: 1, color: "rgba(102, 126, 234, 0.1)" },
          ]),
        },
        itemStyle: {
          color: "#667eea",
        },
        lineStyle: {
          width: 2,
        },
      },
    ],
  },
};

export const chartConfigs2D = {
  stackedBar: {
    title: {
      text: "Ventas por Canal - Barras Apiladas Horizontales",
      left: "center",
      textStyle: { fontSize: 18, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["Ventas Online", "Ventas Tienda"],
      top: "10%",
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "value" },
    yAxis: {
      type: "category",
      data: data.months,
    },
    series: [
      {
        name: "Ventas Online",
        type: "bar",
        stack: "total",
        data: data.onlineSales,
        itemStyle: { color: colors[0] },
      },
      {
        name: "Ventas Tienda",
        type: "bar",
        stack: "total",
        data: data.storeSales,
        itemStyle: { color: colors[1] },
      },
    ],
  },

  stackedColumn: {
    title: {
      text: "Ventas por Canal - Columnas Apiladas",
      left: "center",
      textStyle: { fontSize: 18, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["Ventas Online", "Ventas Tienda"],
      top: "10%",
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: data.months,
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Ventas Online",
        type: "bar",
        stack: "total",
        data: data.onlineSales,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors[0] },
            { offset: 1, color: colors[0] + "80" },
          ]),
        },
      },
      {
        name: "Ventas Tienda",
        type: "bar",
        stack: "total",
        data: data.storeSales,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors[1] },
            { offset: 1, color: colors[1] + "80" },
          ]),
        },
      },
    ],
  },

  groupedBar: {
    title: {
      text: "Ventas por Canal - Barras Agrupadas",
      left: "center",
      textStyle: { fontSize: 18, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["Ventas Online", "Ventas Tienda"],
      top: "10%",
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "value" },
    yAxis: {
      type: "category",
      data: data.months,
    },
    series: [
      {
        name: "Ventas Online",
        type: "bar",
        data: data.onlineSales,
        itemStyle: { color: colors[0] },
      },
      {
        name: "Ventas Tienda",
        type: "bar",
        data: data.storeSales,
        itemStyle: { color: colors[1] },
      },
    ],
  },

  groupedColumn: {
    title: {
      text: "Ventas por Canal - Columnas Agrupadas",
      left: "center",
      textStyle: { fontSize: 18, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["Ventas Online", "Ventas Tienda"],
      top: "10%",
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: data.months,
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Ventas Online",
        type: "bar",
        data: data.onlineSales,
        itemStyle: { color: colors[0] },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
      {
        name: "Ventas Tienda",
        type: "bar",
        data: data.storeSales,
        itemStyle: { color: colors[1] },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  },

  multiLine: {
    title: {
      text: "Tendencias de Ventas - Líneas Múltiples",
      left: "center",
      textStyle: { fontSize: 18, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Ventas Online", "Ventas Tienda"],
      top: "10%",
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: data.months,
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Ventas Online",
        type: "line",
        data: data.onlineSales,
        smooth: true,
        itemStyle: { color: colors[0] },
        lineStyle: { width: 4 },
        symbol: "circle",
        symbolSize: 8,
      },
      {
        name: "Ventas Tienda",
        type: "line",
        data: data.storeSales,
        smooth: true,
        itemStyle: { color: colors[1] },
        lineStyle: { width: 4 },
        symbol: "diamond",
        symbolSize: 8,
      },
    ],
  },

  stackedArea: {
    title: {
      text: "Ventas Acumuladas - Áreas Apiladas",
      left: "center",
      textStyle: { fontSize: 18, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Ventas Online", "Ventas Tienda"],
      top: "10%",
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: data.months,
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Ventas Online",
        type: "line",
        stack: "total",
        data: data.onlineSales,
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors[0] + "80" },
            { offset: 1, color: colors[0] + "20" },
          ]),
        },
        itemStyle: { color: colors[0] },
      },
      {
        name: "Ventas Tienda",
        type: "line",
        stack: "total",
        data: data.storeSales,
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors[1] + "80" },
            { offset: 1, color: colors[1] + "20" },
          ]),
        },
        itemStyle: { color: colors[1] },
      },
    ],
  },

  polar: {
    title: {
      text: "Ventas por Canal - Gráfico Polar",
      left: "center",
      textStyle: { fontSize: 18, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Ventas Online", "Ventas Tienda"],
      top: "10%",
    },
    polar: {
      radius: [30, "70%"],
    },
    radiusAxis: {
      type: "category",
      data: data.months,
    },
    angleAxis: {
      type: "value",
      startAngle: 0,
    },
    series: [
      {
        name: "Ventas Online",
        type: "bar",
        data: data.onlineSales,
        coordinateSystem: "polar",
        itemStyle: { color: colors[0] },
      },
      {
        name: "Ventas Tienda",
        type: "bar",
        data: data.storeSales,
        coordinateSystem: "polar",
        itemStyle: { color: colors[1] },
      },
    ],
  },

  radar: {
    title: {
      text: "Comparación de Ventas - Gráfico Radar",
      left: "center",
      textStyle: { fontSize: 18, fontWeight: "bold" },
    },
    tooltip: {},
    legend: {
      data: ["Ventas Online", "Ventas Tienda"],
      top: "10%",
    },
    radar: {
      indicator: data.months.map((month) => ({
        name: month,
        max: Math.max(...data.onlineSales, ...data.storeSales) * 1.2,
      })),
    },
    series: [
      {
        name: "Ventas por Canal",
        type: "radar",
        data: [
          {
            value: data.onlineSales,
            name: "Ventas Online",
            itemStyle: { color: colors[0] },
            areaStyle: { color: colors[0] + "40" },
          },
          {
            value: data.storeSales,
            name: "Ventas Tienda",
            itemStyle: { color: colors[1] },
            areaStyle: { color: colors[1] + "40" },
          },
        ],
      },
    ],
  },

  scatter: {
    title: {
      text: "Correlación Online vs Tienda - Dispersión",
      left: "center",
      textStyle: { fontSize: 18, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        const monthIndex = params.dataIndex;
        return `${data.months[monthIndex]}<br/>Online: ${params.value[0]}<br/>Tienda: ${params.value[1]}`;
      },
    },
    xAxis: {
      type: "value",
      name: "Ventas Online",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "Ventas Tienda",
      nameLocation: "middle",
      nameGap: 30,
    },
    series: [
      {
        name: "Correlación Ventas",
        type: "scatter",
        data: data.onlineSales.map((online, index) => [
          online,
          data.storeSales[index],
        ]),
        symbolSize: 20,
        itemStyle: {
          color: colors[0],
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: "rgba(0, 0, 0, 0.3)",
        },
      },
    ],
  },

  donut: {
    title: {
      text: "Distribución Total de Ventas",
      left: "center",
      textStyle: { fontSize: 18, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "middle",
    },
    series: [
      {
        name: "Ventas Totales",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["60%", "50%"],
        data: [
          {
            value: data.onlineSales.reduce((a, b) => a + b, 0),
            name: "Ventas Online",
            itemStyle: { color: colors[0] },
          },
          {
            value: data.storeSales.reduce((a, b) => a + b, 0),
            name: "Ventas Tienda",
            itemStyle: { color: colors[1] },
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          fontSize: 14,
          fontWeight: "bold",
        },
      },
    ],
  },
};
