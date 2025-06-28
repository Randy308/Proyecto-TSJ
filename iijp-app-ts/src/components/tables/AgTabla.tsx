import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useThemeContext } from "../../context/ThemeProvider";

const AgTabla = ({
  columnDefs,
  rowData,
  pagination = false,
  paginationPageSize = 20,
  height = 500,
  width = "95%",
}) => {
  const isDarkMode = useThemeContext();
  return (
    <div className="flex justify-center items-center">
      <div
        className={isDarkMode ? "ag-theme-alpine-dark" : "ag-theme-alpine"}
        style={{ height, width}}
      >
        {rowData.length > 0 && (
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            domLayout="autoHeight"
            pagination={pagination}
            paginationPageSize={paginationPageSize}
          />
        )}
      </div>
    </div>
  );
};

export default AgTabla;
