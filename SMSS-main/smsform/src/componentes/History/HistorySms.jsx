import React, { useState, useEffect } from 'react';
// Estilos
import Box from '@mui/material/Box';
import { DataGrid, GridRowEditStopReasons, } from '@mui/x-data-grid';
//Query
import { getsms } from '../Query/querysms';

const HistoryTableSms = () => {
  // Declaro los estados
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  // GET para recoger los datos de la BBDD y mostrarlos en la tabla
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getsms();
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
  // Columnas de la tabla frontend, field = columna BBDD headerName = columna FrontEnd width = largo de las columnas
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
        return params.value.replace('T', ' ');
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
      width: 850,
    },
  ];

  return (
    <div className='Tablas'>
      <Box
        sx={{
          height: 500,
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

        />
      </Box>
    </div>
  );
};

export default HistoryTableSms;