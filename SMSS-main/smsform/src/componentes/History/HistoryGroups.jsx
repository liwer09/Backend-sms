import React, { useState, useEffect } from 'react';
// Estilos
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
//Query - GET, DELETE, PUT, POST
import { getgroups, deletegroups, putgroups, postgroups } from '../Query/querygroups';

const HistoryTableGroups = () => {
  // Declaro constantes de estado y alertas
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [status, setStatus] = useState(null);
  const { enqueueSnackbar } = useSnackbar()

  // Funcion para crear las alertas
  const showNotification = async (message, variant) => {
    enqueueSnackbar(message, { variant });
  };
  // Funcion GET para mostrar contenido de la tabla
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getgroups();
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

  // Funcion del componente MUI para dar la funcion al boton de editar en las filas
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  // Funcion del componente MUI para dar la funcion al boton de guarado en las filas
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  // Funcion DELETE para eliminar filas
  const handleDeleteClick = (id) => async () => {
    try {

      const eliminar = await deletegroups(id); // Le paso a la query delete el id
      setStatus(eliminar.status);
      setRows(rows.filter((row) => row.id !== id)); // Setea en las rows todo el contenido menos la row que se elimina
      if(eliminar.status === 200 ){
        showNotification("Grupo eliminado con exito!", 'success');
      } else if(eliminar.status === 201) {
        showNotification("Grupo eliminado con exito!", 'success');
      } else {
        showNotification("Error eliminando el grupo!", 'error');
      }
    } catch (error) {
      showNotification("Error eliminando el grupo!", 'error');
    }
  };

  // Funcion del componente MUI para dar la funcion al boton de cancelar edicion en las filas
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  // Funcion donde se hace el PUT y POST
  const processRowUpdate = async (newRow) => {
    try {
      let updatedRow;

      // Recupera las filas actualizadas antes de la actualización
      const existingRows = await getgroups();

      // Validar si la ID ya existe
      const existingRow = existingRows.find(row => row.id === newRow.id);

      // Crea la peticion
      const queryParams = Object.entries(newRow)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

      if (existingRow) {
        // Si la ID ya existe, realizar una solicitud PUT para actualizar
        try {
          updatedRow = await putgroups(newRow.id, queryParams, newRow);
          setStatus(updatedRow.status);
          if(updatedRow.status === 200){
            showNotification("Grupo modificado con exito!", 'success');
          } else {
            showNotification("Error modificando el grupo!", 'error');
          }
        } catch (error) {
          showNotification("Error modificando el grupo!", 'error');
        }
      } else {
        // Si la ID no existe, realizar una solicitud POST para agregar
        try {
          updatedRow = await postgroups(queryParams, newRow);
          setStatus(updatedRow.status);
          if(updatedRow.status === 200){
            showNotification("Grupo creado con exito!", 'success');
          } else {
            showNotification("Error creando el grupo!", 'error');
          }
        } catch (error) {
          showNotification("Error creando el grupo!", 'error');
        }
      }

      // Actualizar el estado de las filas solo con la fila actualizada
      setRows(existingRows.map(row => (row.id === updatedRow.id ? updatedRow : row)));
      // Actualizo la tabla
      const updatedRows = await getgroups();

      // Actualizo el estado de las rows
      setRows(updatedRows);
      return updatedRow;
    } catch (error) {
    }
  };

  const handleRowModesModelChange = () => {
    setRowModesModel({});
  };

  const EditToolbar = (props) => {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const lastRow = rows[rows.length - 1]; // Coge el id de la ultima row
      const newId = lastRow ? lastRow.id + 1 : 1; // Suma 1 al ultimo id para crear el id de la siguiente row

      setRows((oldRows) => [...oldRows, { id: newId, name: '', isNew: true }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  };
  // Columnas de la tabla - field = columna de la BBDD, headerName = nombre de la columna del frontend
  const columns = [

    {
      field: "name",
      headerName: "Pais",
      editable: true,

    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Opciones',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
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
          processRowUpdate={processRowUpdate}
          components={{
            Toolbar: EditToolbar,
          }}
          componentsProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>
    </div>

  );
};

export default HistoryTableGroups;
