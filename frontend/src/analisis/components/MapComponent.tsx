// import { useRef, useEffect } from "react";
// import {
//   select,
//   geoPath,
//   geoMercator,
//   scaleQuantize,
//   pairs,
//   create as d3Create,
//   axisBottom,
//   scaleLinear,
// } from "d3";
// import { feature } from "topojson-client";
// import type { Feature, FeatureCollection } from "geojson";

// // ---- Tipado de datos ----
// type RegionValue = {
//   nombre: string;
//   cantidad: number;
// };

// type TopoJSONMap = {
//   type: "Topology";
//   objects: {
//     map: any; // Puede mejorarse con un TopoJSON type específico
//   };
//   arcs: any[];
//   transform?: object;
// };

// interface Props {
//   data: RegionValue[];
// }
// const MapComponent = ({ data }: Props) => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const tooltipRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const valuemap = new Map<string, number>(
//       data.map((item) => [item.nombre, item.cantidad])
//     );

//     const fillMap = (d: Feature) => valuemap.get(d.properties?.name ?? "");

//     const svg = select(svgRef.current!);
//     const tooltip = select(tooltipRef.current!);
//     const width = 800;
//     const height = 500;

//     const projection = geoMercator();
//     const pathGenerator = geoPath().projection(projection);
//     const color = scaleQuantize<number, string>()
//       .domain([1, 100])
//       .range([
//         "#f7fbff",
//         "#deebf7",
//         "#c6dbef",
//         "#9ecae1",
//         "#6baed6",
//         "#4292c6",
//         "#2171b5",
//         "#08519c",
//         "#08306b",
//       ]);

//     fetch("Bolivia.topo.json")
//       .then((res) => res.json())
//       .then((topoData: Topology) => {
//         const geojson = feature(
//           topoData,
//           (topoData as TopoJSONMap).objects.map
//         ) as FeatureCollection;

//         projection.fitSize([width, height], geojson);

//         // Leyenda
//         svg
//           .append("g")
//           .attr("transform", "translate(610,20)")
//           .append(() =>
//             Legend(color, { title: "Cantidad de resoluciones (%)", width: 160 })
//           );

//         // Mapa
//         svg
//           .append("g")
//           .selectAll<SVGPathElement, Feature>("path")
//           .data(geojson.features)
//           .join("path")
//           .attr("d", pathGenerator)
//           .attr("stroke", "black")
//           .attr("fill", (d) => color(fillMap(d) ?? 0))
//           .on("mouseover", function (event, d) {
//             tooltip
//               .style("display", "block")
//               .html(
//                 `<strong>${d.properties?.name}</strong><br>${valuemap.get(
//                   d.properties?.name ?? ""
//                 )}%`
//               );
//           })
//           .on("mouseout", function () {
//             tooltip.style("display", "none");
//           })
//           .on("mousemove", function (event: MouseEvent) {
//             const tooltipEl = tooltipRef.current;
//             if (tooltipEl) {
//               const bounds = svgRef.current?.getBoundingClientRect();
//               if (bounds) {
//                 tooltip
//                   .style("left", event.clientX - bounds.left + 10 + "px")
//                   .style("top", event.clientY - bounds.top + 10 + "px");
//               }
//             }
//           });

//         // Textos
//         svg
//           .append("g")
//           .selectAll("text")
//           .data(geojson.features)
//           .join("text")
//           .attr("transform", (d) => {
//             const [x, y] = pathGenerator.centroid(d);
//             return `translate(${x}, ${y})`;
//           })
//           .attr("text-anchor", "middle")
//           .attr("font-size", "12px")
//           .attr("fill", "black")
//           .attr("pointer-events", "none")
//           .text((d) => d.properties?.name);
//       });
//   }, [data]);

//   return (
//     <div className="relative">
//       <svg ref={svgRef} width={800} height={500} className="relative z-0" />

//       {/* Tooltip también con z alto */}
//       <div
//         ref={tooltipRef}
//         id="tooltip"
//         className="absolute z-20"
//         style={{
//           display: "none",
//           backgroundColor: "white",
//           padding: "6px 12px",
//           borderRadius: "4px",
//           border: "1px solid #ccc",
//           pointerEvents: "none",
//           fontSize: "0.9rem",
//         }}
//       />
//     </div>
//   );
// };

// export default MapComponent;

// // ---------- LEGEND FUNCTION ----------
// function Legend(
//   color: d3.ScaleQuantize<number, string>,
//   {
//     title,
//     width = 320,
//     tickSize = 6,
//     height = 44 + tickSize,
//     marginTop = 18,
//     marginRight = 0,
//     marginBottom = 16 + tickSize,
//     marginLeft = 0,
//     ticks = width / 64,
//     tickFormat,
//     tickValues,
//   }: {
//     title: string;
//     width?: number;
//     tickSize?: number;
//     height?: number;
//     marginTop?: number;
//     marginRight?: number;
//     marginBottom?: number;
//     marginLeft?: number;
//     ticks?: number;
//     tickFormat?: (d: number) => string;
//     tickValues?: number[];
//   }
// ): SVGSVGElement {
//   const svg = d3Create("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .attr("viewBox", [0, 0, width, height])
//     .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

//   const thresholds = color.thresholds ? color.thresholds() : color.domain();
//   const xScale = scaleLinear()
//     .domain([Math.min(...color.domain()), Math.max(...color.domain())])
//     .rangeRound([marginLeft, width - marginRight]);

//   svg
//     .append("g")
//     .selectAll("rect")
//     .data(pairs([xScale.domain()[0], ...thresholds, xScale.domain()[1]]))
//     .join("rect")
//     .attr("x", (d) => xScale(d[0]))
//     .attr("width", (d) => xScale(d[1]) - xScale(d[0]))
//     .attr("height", height - marginTop - marginBottom)
//     .attr("fill", (d) => color(d[0]));

//   svg
//     .append("g")
//     .attr("transform", `translate(0,${height - marginBottom})`)
//     .call(
//       axisBottom(xScale)
//         .ticks(ticks)
//         .tickSize(tickSize)
//         .tickFormat(tickFormat ?? ((d: number) => String(d)))
//         .tickValues(tickValues ?? thresholds)
//     )
//     .call((g) => g.select(".domain").remove());

//   svg
//     .append("text")
//     .attr("x", marginLeft)
//     .attr("y", marginTop - 6)
//     .attr("fill", "currentColor")
//     .attr("text-anchor", "start")
//     .attr("font-weight", "bold")
//     .text(title);

//   return svg.node()!;
// }

const MapComponent = () => {
  return (
    <div>MapComponent</div>
  )
}

export default MapComponent