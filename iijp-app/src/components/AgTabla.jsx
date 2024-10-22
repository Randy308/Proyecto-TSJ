import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useThemeContext } from "./ThemeProvider";

const AgTabla = ({columnDefs , rowData}) => {

  const isDarkMode = useThemeContext();
  return (
    <div className="flex justify-center items-center">
      <div className={isDarkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'}   style={{ height: 500, width: "95%" }}>
        {rowData.length > 0 && (
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            domLayout="autoHeight"
          />
        )}
      </div>
    </div>
  );
};

export default AgTabla;
