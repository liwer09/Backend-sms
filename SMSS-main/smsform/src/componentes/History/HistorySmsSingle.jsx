import React, { useState, useEffect } from 'react';
// Estilos
import Box from '@mui/material/Box';
import { DataGrid, GridRowEditStopReasons, } from '@mui/x-data-grid';
// Query
import { smsticket } from '../Query/querysms';

// El prop es la incidencia que se pasa por el buscador
const HistoryTableSms = (props) => {
  // Declar los estados
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  // Funcion para hacer el GET y solo consultar las coincidencias de la BBDD con la INC buscada
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await smsticket(props.name);
        setRows(response);
      } catch (error) {
      }
    };

    getData();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  // Columnas de la tabla front end
  const columns = [
    {
      field: "inc",
      headerName: "INC",
      width: 120,
    },
    {
      field: "status",
      headerName: "Estado",
      width: 100,
    },
    {
      field: "datetime",
      headerName: "Fecha",
      valueFormatter: (params) => {
        return params.value.replace('T', ' '); // Reemplazo la T por un espacio para dar formato a la fecha
      },
      width: 160,
    },
    {
      field: "tech_group",
      headerName: "Grupo asignado",
      width: 240,
    },
    {
      field: "description",
      headerName: "Mensaje",
      width: 700,
    },
  ];

  return (
    <div className="SingleTablas">
      <Box
        sx={{
          height: 350,
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Box>
    </div>
  );
};

export default HistoryTableSms;