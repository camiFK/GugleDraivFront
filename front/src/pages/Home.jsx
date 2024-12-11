import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Snackbar
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

  useEffect(() => {
    var token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login"; 
    }
  }, []);

  const getSelectedFolderFiles = async () => {
    const folders = await fileService.getAllFolders();
    const thisFolder = folders.find((folder) => folder.fileName === selectedFolder)
    console.log(thisFolder) // continuar
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
             <Paper
             sx={{
               padding: 5,
               width: "100%",
               boxSizing: "border-box", 
               overflow: "hidden",
             }}
           >
            <Typography variant="h5" gutterBottom>
              Carpeta: {selectedFolder?.trim() ? selectedFolder : "Carpeta raíz"}
            </Typography>
             <Typography variant="h5" gutterBottom>
               Archivos
             </Typography>
             <FileList 
              selectedFolder={selectedFolder} 
              setAlert={setAlert}/>
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
              setAlert={setAlert}
              // onDeleteFolder={handleDelete}
            />
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
            selectedFolder={selectedFolder}
            setErrorMessage={setAlert}
            setAlert={setAlert}
            setFolders={setFolders}
            setOpenSnackbar={setOpenSnackbar}
          />
        </Paper>
      )}
      </Container>
    </Box>
  );
}

export default Home;
