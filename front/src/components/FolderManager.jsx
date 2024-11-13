import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

//Componente para crear carpetas
const FolderManager = ({ folders, setFolders, selectedFolder, setSelectedFolder }) => {
  const [newFolderName, setNewFolderName] = useState('');

  const createFolder = () => {
    if (newFolderName) {
      setFolders([...folders, { nombre: newFolderName, archivos: [] }]);
      setNewFolderName('');
    }
  };

  return (
    <Box>
      <TextField
        label="Nombre de la nueva carpeta"
        variant="outlined"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={createFolder} sx={{ mb: 2 }}>
        Crear Carpeta
      </Button>
      
      <Box sx={{ mb: 2 }}>
        <select 
          onChange={(e) => setSelectedFolder(e.target.value)} 
          value={selectedFolder}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="">Selecciona una carpeta</option>
          {folders.map((folder, index) => (
            <option key={index} value={folder.nombre}>{folder.nombre}</option>
          ))}
        </select>
      </Box>
    </Box>
  );
};

export default FolderManager;