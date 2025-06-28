// import { useState, useRef, useEffect } from "react";

// interface DateRangeSliderProps {
//   minDate: string;
//   maxDate: string;
//   onChange: void;
// }

// const DateRangeSlider = ({
//   minDate,
//   maxDate,
//   onChange,
// }: DateRangeSliderProps) => {
//   const sliderRef = useRef<HTMLDivElement | null>(null);

//   const dateToString = (date: string | number | Date): string => {
//     const d = new Date(date);
//     const options: Intl.DateTimeFormatOptions = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     };
//     return d.toLocaleDateString("es-ES", options);
//   };

//   const [startDate, setStartDate] = useState<Date | number | string>(
//     new Date(minDate).setHours(0, 0, 0, 0)
//   );
//   const [endDate, setEndDate] = useState<Date | number| string>(
//     new Date(maxDate).setHours(0, 0, 0, 0)
//   );
//   const [dragging, setDragging] = useState<string | null>(null);

//   // Formatear las fechas a 'YYYY-MM-DD'
//   const formatDate = (date: string) => {
//     var d = new Date(date),
//       month = "" + (d.getMonth() + 1),
//       day = "" + d.getDate(),
//       year = d.getFullYear();

//     if (month.length < 2) month = "0" + month;
//     if (day.length < 2) day = "0" + day;

//     return [year, month, day].join("-");
//   };

//   // Convertir una fecha a porcentaje según el rango
//   const dateToPercentage = (date: number) => {
//     const minTime = new Date(minDate).getTime();
//     const maxTime = new Date(maxDate).getTime();
//     return ((date - minTime) / (maxTime - minTime)) * 100;
//   };

//   // Convertir un porcentaje a una fecha
//   const percentageToDate = (percentage: number) => {
//     const minTime = new Date(minDate).getTime();
//     const maxTime = new Date(maxDate).getTime();
//     return new Date(
//       new Date(minTime + ((maxTime - minTime) * percentage) / 100).setHours(
//         0,
//         0,
//         0,
//         0
//       )
//     );
//   };
//   const handleMouseDown = (handle: string) => {
//     setDragging(handle);
//   };

//   // Manejo del movimiento del mouse
//   const handleMouseMove = (e) => {
//     if (!dragging) return;

//     const rect = sliderRef.current.getBoundingClientRect();
//     let percentage = ((e.clientX - rect.left) / rect.width) * 100;
//     percentage = Math.max(0, Math.min(100, percentage));

//     if (dragging === "start") {
//       const newStartDate = percentageToDate(percentage);
//       if (newStartDate < endDate) {
//         setStartDate(newStartDate);
//         onChange({
//           startDate: formatDate(newStartDate),
//           endDate: formatDate(endDate),
//         });
//       }
//     } else if (dragging === "end") {
//       const newEndDate = percentageToDate(percentage);
//       if (newEndDate > startDate) {
//         setEndDate(newEndDate);
//         onChange({
//           startDate: formatDate(startDate),
//           endDate: formatDate(newEndDate),
//         });
//       }
//     }
//   };

//   // Manejo del fin del arrastre
//   const handleMouseUp = () => {
//     setDragging(null);
//   };

//   // Actualización de las fechas cuando cambian las props minDate y maxDate
//   useEffect(() => {
//     setStartDate(new Date(minDate).setHours(0, 0, 0, 0));
//     setEndDate(new Date(maxDate).setHours(0, 0, 0, 0));
//   }, [minDate, maxDate]);

//   // Escuchar los eventos de mouse
//   useEffect(() => {
//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [dragging]);

//   return (
//     <div className="relative w-full p-4">
//       <div ref={sliderRef} className="relative h-2 bg-gray-300 rounded-full">
//         <div
//           className="absolute top-0 h-2 bg-blue-500 rounded-full"
//           style={{
//             left: `${dateToPercentage(startDate)}%`,
//             width: `${
//               dateToPercentage(endDate) - dateToPercentage(startDate)
//             }%`,
//           }}
//         />
//         <div
//           className="absolute top-[-6px] w-5 h-5 bg-blue-600 rounded-full cursor-pointer"
//           style={{ left: `${dateToPercentage(startDate)}%` }}
//           onMouseDown={() => handleMouseDown("start")}
//         />
//         <div
//           className="absolute top-[-6px] w-5 h-5  bg-blue-600 rounded-full cursor-pointer"
//           style={{ left: `${dateToPercentage(endDate)}%` }}
//           onMouseDown={() => handleMouseDown("end")}
//         />
//       </div>

//       <div className="flex justify-between text-sm mt-2">
//         <span>{dateToString(startDate)}</span>
//         <span>{dateToString(endDate)}</span>
//       </div>
//     </div>
//   );
// };

// export default DateRangeSlider;

const DateRangeSlider  = () => {
  return (
    <div>DateRangeSlider </div>
  )
}

export default DateRangeSlider 