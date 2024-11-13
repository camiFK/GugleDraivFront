import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function FileList({ files, selectedFolder }) {
  
  const [searchText, setSearchText] = useState('');
  const filteredFiles = files.filter((file) =>
    file.nombre.toLowerCase().includes(searchText.toLowerCase()) &&
    (!selectedFolder || file.path.includes(selectedFolder))
  );
 

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
        columns={[
          { field: 'id', headerName: 'Id', width: 150 },
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
        ]}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
    </div>
  );
}

export default FileList;