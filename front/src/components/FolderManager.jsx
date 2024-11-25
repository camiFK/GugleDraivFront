import React, { useState } from "react";
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  TextField,
  Button,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

//Componente para crear carpetas
const FolderManager = ({
  folders,
  setFolders,
  selectedFolder,
  setSelectedFolder,
  onDeleteFolder,
}) => {
  const [newFolderName, setNewFolderName] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  // Estados para el diálogo de confirmación
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null); // Puede ser "create" o "delete"
  const [targetFolderName, setTargetFolderName] = useState("");

  const openConfirmationDialog = (action, folderName = "") => {
    setDialogAction(action);
    setTargetFolderName(folderName);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setDialogAction(null);
    setTargetFolderName("");
  };

  const handleDialogConfirm = async () => {
    if (dialogAction === "create") {
      setFolders([...folders, { nombre: newFolderName, archivos: [] }]);
      setNewFolderName(""); // Limpiar el campo de entrada
      setAlertMessage("¡Carpeta creada correctamente!");
      setAlertSeverity("success");
    } else if (dialogAction === "delete") {
      const wasDeleted = await onDeleteFolder(targetFolderName, true); // Verificar si la operación fue exitosa
      if (wasDeleted) {
        setAlertMessage(`Carpeta "${targetFolderName}" eliminada correctamente.`);
        setAlertSeverity("success");
      } else {
        setAlertMessage(`Error: no se pudo eliminar la carpeta "${targetFolderName}".`);
        setAlertSeverity("error");
      }
    }
  
    closeDialog();
    setOpenSnackbar(true);
  };

  const createFolder = () => {
    if (!newFolderName) {
      setAlertMessage("Por favor, ingresa un nombre para la carpeta.");
      setAlertSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    openConfirmationDialog("create");
  };

  const handleDeleteFolder = (folderName) => {
    openConfirmationDialog("delete", folderName);
  };

  return (
    <Box>
      {/* Campo para crear una carpeta */}
      <TextField
        label="Nombre de la nueva carpeta"
        variant="outlined"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        sx={{ mr: 2, mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={createFolder}
        sx={{ mb: 2 }}
      >
        Crear Carpeta
      </Button>

      {/* Selección de carpeta */}
      <Box sx={{ mb: 2 }}>
        <select
          onChange={(e) => setSelectedFolder(e.target.value)}
          value={selectedFolder}
          style={{ width: "100%", padding: "8px" }}
        >
          <option value="">Selecciona una carpeta</option>
          {folders.map((folder, index) => (
            <option key={index} value={folder.nombre}>
              {folder.nombre}
            </option>
          ))}
        </select>
      </Box>

      {/* Lista de carpetas con opción para eliminarlas */}
      {folders.map((folder) => (
        <Box
          key={folder.nombre}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FolderIcon sx={{ mr: 1, color: "primary.main" }} />
            <span>{folder.nombre}</span>
          </Box>

          <IconButton
            color="error"
            onClick={() => handleDeleteFolder(folder.nombre)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      {/* Snackbar para mostrar mensajes de alerta */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Dialogo de confirmación */}
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAction === "create"
              ? `¿Estás seguro de que deseas crear la carpeta "${newFolderName}"?`
              : `¿Estás seguro de que deseas eliminar la carpeta "${targetFolderName}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDialogConfirm} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FolderManager;
