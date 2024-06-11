import React, { useState, useEffect } from 'react';
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
import { getusers, deleteusers, putusers, postusers } from '../Query/queryusers';
import { getgroups } from '../Query/querygroups';

const HistoryTableUsers = () => {
  const [status, setStatus] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [groups, setGroups] = useState([]);
  const { enqueueSnackbar } = useSnackbar()

  const showNotification = async (message, variant) => {
    enqueueSnackbar(message, { variant });
  };
  useEffect(() => {
    const getData = async () => {
      try {
        // Obtener datos de usuarios
        const usersData = await getusers();
        setRows(usersData);

        // Obtener datos de grupos
        const groupsData = await getgroups();
        setGroups(groupsData);
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

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    try {
      const eliminar = await deleteusers(id); // Adjust the endpoint if needed
      setRows(rows.filter((row) => row.id !== id));
      setStatus(eliminar.status);
      if (eliminar.status === 200) {
        showNotification("Usuario eliminado con exito!", 'success');
      } else {
        showNotification("Error eliminando el usuario!", 'error');
      }
    } catch (error) {
      showNotification("Error eliminando el usuario!", 'error');
    }
  };


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

  const processRowUpdate = async (newRow) => {
    try {
      let updatedRow = "";
      // Busco coincidencia entre el name y el id del group_id para poder trabajar con el name sin tener en cuenta las mayusculas o minusculas
      const groupId = groups.find((group) => group.name.toLowerCase() === newRow.group_id.toLowerCase())?.id;
      const existingRows = await getusers();
      // Validar si la ID ya existe
      const existingRow = existingRows.find(row => row.id === newRow.id);
      // Extraigo de la query el group_id para poder hacer luego las querys con el name en vez de ID
      const queryParams = new URLSearchParams(newRow);
      queryParams.delete('group_id');
      const queryWithoutGroup = `https://localhost/users/${newRow.id}?${queryParams}`;
      const queryWithoutGroupPost = `https://localhost/users?${queryParams}`;


      if (existingRow) {

        try {
          updatedRow = await putusers(queryWithoutGroup, groupId, newRow);
          setStatus(updatedRow.status);
          if(updatedRow.status === 200){
            showNotification("Usuario modificado con exito!", 'success');
          } else{
            showNotification("Error al modificar el usuario!", 'error');
          }
        } catch (error) {
          showNotification("Error al modificar el usuario!", 'error');
        }
      } else {
        
        try {
          updatedRow = await postusers(queryWithoutGroupPost, groupId, newRow);
          setStatus(updatedRow.status);
          if(updatedRow.status === 200) {
            showNotification("Usuario creado con exito!", 'success');
          } else {
            showNotification("Error al crear el usuario!", 'error');
          }
        } catch (error) {
          showNotification("Error al crear el usuario!", 'error');
        }
      }

      // Actualizo la tabla
      setRows(existingRows.map(row => (row.id === updatedRow.id ? updatedRow : row)));
      const updatedRows = await getusers();
      setRows(updatedRows);
      return updatedRow;

    } catch (error) {
      console.error('Error updating row:', error);
    }
  };

  const handleRowModesModelChange = () => {
    setRowModesModel({});
  };

  const EditToolbar = (props) => {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = "";
      setRows((oldRows) => [...oldRows, { id, name: "", surname: "", phone: "", group_id: "", isNew: true }]);
      setRowModesModel(() => ({
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'id' },
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

  const columns = [
    {
      field: "id",
      headerName: "Usuario",
      width: 150,
      editable: true,
    },
    {
      field: "name",
      headerName: "Nombre",
      editable: true,
      width: 150,
    },
    {
      field: "surname",
      headerName: "Apellido",
      editable: true,
      width: 150,
    },
    {
      field: "phone",
      headerName: "Telefono",
      editable: true,
      width: 150,
    },
    {
      field: "group_id",
      headerName: "Grupo",
      editable: true,
      valueGetter: (params) => {
        const group = groups.find((group) => group.id === params.row.group_id); // reemplazo el group_id.id por el group.name
        return group ? group.name : '';
      },

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

export default HistoryTableUsers;
