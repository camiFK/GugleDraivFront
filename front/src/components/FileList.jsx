import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

function FileList({ files, onDeleteFile, selectedFolder }) { 
  const [searchText, setSearchText] = useState('');

  const filteredFiles = files.filter((file) =>
    file.nombre.toLowerCase().includes(searchText.toLowerCase()) &&
    (!selectedFolder || file.path.includes(selectedFolder))
  );
 
    const columns = [
      { field: 'id', headerName: 'ID', width: 150 },
      { field: 'nombre', headerName: 'Nombre', width: 250 },
      {
        field: 'path',
        headerName: 'Path',
        width: 250,
        renderCell: (params) => (
          <a href={params.value} target="_blank" rel="noopener noreferrer">
            {params.value}
          </a>
        ),
      },
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 100,
        renderCell: (params) => (
          <IconButton
            color="error"
            onClick={() => onDeleteFile(params.row.id, false)}           
          >
            <DeleteIcon />
          </IconButton>
        ),
        sortable: false,
        filterable: false,
      },
    ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <TextField
        label="Buscar archivo"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <DataGrid
        rows={filteredFiles}
        columns={columns}         
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        getRowId={(row) => row.id}
        
      />
    </div>
  );
}

export default FileList;