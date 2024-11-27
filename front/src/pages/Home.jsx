import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import Navbar from "../components/Navbar";
import FolderManager from "../components/FolderManager";
import fileService from "../services/fileService";

function Home() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [currentSection, setCurrentSection] = useState("inicio");
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  useEffect(() => {
    var token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login"; 
    }
  }, []);

  const handleDelete = async (id, isFolder) => {
    const token = token;
    const systemId = "3";
    const response = await fileService.deleteFileOrFolder(id, token, systemId);

    if (response.success) {
      if (isFolder) {
        setFolders((prevFolders) =>
          prevFolders.filter((folder) => folder.nombre !== id)
        );
        if (selectedFolder === id) {
          setSelectedFolder("");
        }
      } else {
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.nombre === selectedFolder
              ? {
                  ...folder,
                  archivos: folder.archivos.filter((file) => file.id !== id),
                }
              : folder
          )
        );
      }
      setAlert({
        message: "¡Elemento eliminado correctamente!",
        severity: "success",
      });
    } else {
      setAlert({
        message: "Error al eliminar el elemento.",
        severity: "error",
      });
    }
    setOpenSnackbar(true);
  };

  const handleUpload = (file) => {
    if (!file) {
      setAlert({
        message: "Por favor, selecciona un archivo antes de subir.",
        severity: "error",
      });
      setOpenSnackbar(true); // Mostrar la alerta
      return;
    }

    // Establecer el archivo en el estado de fileToUpload
    setFileToUpload(file);
    setDialogOpen(true); // Mostrar el diálogo de confirmación
  };

  const confirmUpload = () => {
    // if (selectedFolder) {
    //   const newFile = {
    //     id: Date.now(),
    //     nombre: file.name,
    //     path: `path/to/${selectedFolder}/${file.name}`,
    //   };
    //   setFolders((prevFolders) =>
    //     prevFolders.map((folder) =>
    //       folder.nombre === selectedFolder
    //         ? { ...folder, archivos: [...folder.archivos, newFile] }
    //         : folder
    //     )
    //   );
    //   setAlert({
    //     message: "¡Archivo subido correctamente!",
    //     severity: "success",
    //   });
    // } else {
    //   alert("Por favor, selecciona una carpeta para subir el archivo.");
    // }
    // setOpenSnackbar(true);
    // setDialogOpen(false); // Cerrar el diálogo después de la subida
  };

  const getSelectedFolderFiles = () => {
    const folder = folders.find((folder) => folder.fileName === selectedFolder);
    console.log(folder)
    return folder ? folder.archivos : [];
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <Container sx={{ flex: 1, mt: 3 }}>
        {/* Mostrar alertas */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>

        {/* Diálogo de confirmación para subir archivos */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Confirmar Subida</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas subir el archivo{" "}
              <strong>{fileToUpload?.name}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="secondary">
              Cancelar
            </Button>
            <Button onClick={confirmUpload} color="primary">
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Botones de navegación */}
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <Button
            variant={currentSection === "inicio" ? "contained" : "outlined"}
            onClick={() => setCurrentSection("inicio")}
          >
            Inicio
          </Button>
          <Button
            variant={
              currentSection === "administrarCarpetas"
                ? "contained"
                : "outlined"
            }
            onClick={() => setCurrentSection("administrarCarpetas")}
          >
            Administrar Carpetas
          </Button>
          <Button
            variant={
              currentSection === "subirArchivos" ? "contained" : "outlined"
            }
            onClick={() => setCurrentSection("subirArchivos")}
          >
            Subir Archivos
          </Button>
        </Box>

        {/* Sección de inicio */}
        {currentSection === "inicio" && (
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Archivos y Carpetas
            </Typography>
            <FileList
              onDeleteFile={handleDelete}
              selectedFolder={selectedFolder}
            />
          </Paper>
        )}

        {/* Sección de administrar carpetas */}
        {currentSection === "administrarCarpetas" && (
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Administrar Carpetas
            </Typography>
            <FolderManager
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              onDeleteFolder={handleDelete}
            />
            {/* <CreateFolder /> */}
          </Paper>
        )}

        {/* Sección de subir archivos */}
        {currentSection === "subirArchivos" && (
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Subir Archivos
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Subiendo archivos a la carpeta:{" "}
            <strong>{selectedFolder || "Carpeta raíz"}</strong>
          </Typography>
          <FileUpload
            onUpload={(files) => handleUpload(files, selectedFolder || "root")}
            setErrorMessage={setAlert}
          />
        </Paper>
      )}
      </Container>
    </Box>
  );
}

export default Home;
