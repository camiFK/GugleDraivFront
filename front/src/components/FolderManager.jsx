import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

//Componente para crear carpetas
const FolderManager = ({ folders, setFolders, selectedFolder, setSelectedFolder, onDeleteFolder }) => {
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
        sx={{ mr: 2, mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={createFolder} sx={{ mb: 2}}>
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
      {folders.map((folder) => (
        <Box key={folder.nombre} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <span>{folder.nombre}</span>
          <IconButton color="error" onClick={() => onDeleteFolder(folder.nombre, true)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default FolderManager;