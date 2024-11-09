import TablaXY from "../../components/TablaXY";
import React from "react";

const Analisis2D = () => {
  const data = [
    { name: "John", age: 28, department: "Engineering" },
    { name: "Jane", age: 22, department: "Engineering" },
    { name: "Jim", age: 35, department: "Marketing" },
    { name: "Jill", age: 40, department: "Marketing" },
    { name: "Jack", age: 32, department: "Engineering" },
  ];

  const columns = [
    {
      header: "Department",
      accessorKey: "department",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Age",
      accessorKey: "age",
    },
  ];

  return (
    <div>
      <TablaXY />
    </div>
  );
};

export default Analisis2D;
