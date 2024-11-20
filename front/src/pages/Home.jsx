import React, { useState } from 'react';
import { Container, Box, Typography, Paper, Grid2 } from '@mui/material';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import Navbar from '../components/Navbar';
import FolderManager from '../components/FolderManager';
import fileService from '../services/fileService';

function Home() {
  const [folders, setFolders] = useState([]); 
  const [selectedFolder, setSelectedFolder] = useState(''); 
  
  const handleDelete = async (id, isFolder) => {
    const token = "test"; 
    const systemId = "test";
    const response = await fileService.deleteFileOrFolder(id, token, systemId);
  
    if (response.success) {
      if (isFolder) {
        setFolders((prevFolders) =>
          prevFolders.filter((folder) => folder.nombre !== id)
        );
        if (selectedFolder === id) {
          setSelectedFolder('');
        }
      } else {
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.nombre === selectedFolder
              ? { ...folder, archivos: folder.archivos.filter((file) => file.id !== id) }
              : folder
          )
        );
      }
    }
  };

  const handleUpload = async (file) => {
    if (selectedFolder) {
      const newFile = {
        id: Date.now(),
        nombre: file.name,
        path: `path/to/${selectedFolder}/${file.name}`, 
      };
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.nombre === selectedFolder
            ? { ...folder, archivos: [...folder.archivos, newFile] }
            : folder
        )
      );
    } else {
      alert('Por favor, selecciona una carpeta para subir el archivo.');
    }
  };

    // Encuentra la carpeta seleccionada y sus archivos
    const getSelectedFolderFiles = () => {
      const folder = folders.find(folder => folder.nombre === selectedFolder);
      return folder ? folder.archivos : [];
    };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />

      <Container sx={{ flex: 1, mt: 3 }}>
        <Grid2 container spacing={3}>
          <Grid2 item xs={12} md={6}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Administrar Carpetas
              </Typography>
              <FolderManager 
                folders={folders} 
                setFolders={setFolders} 
                selectedFolder={selectedFolder} 
                setSelectedFolder={setSelectedFolder} 
                onDeleteFolder={handleDelete} 
              />
            </Paper>
          </Grid2>
          <Grid2 item xs={12} md={6}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Subir archivo
              </Typography>
              <FileUpload onUpload={handleUpload} />
            </Paper>
          </Grid2>
          <Grid2 item xs={12}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Archivos
              </Typography>
              <FileList 
                files={getSelectedFolderFiles()} 
                onDeleteFile={handleDelete}  
              />
            </Paper>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}

export default Home;
