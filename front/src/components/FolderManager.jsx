import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Typography
} from "@mui/material";
import fileService from "../services/fileService";

const FolderManager = ({
  selectedFolder,
  setSelectedFolder,
  setAlert
}) => {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null); // Puede ser "create" o "delete"
  const [targetFolderId, setTargetFolderName] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const basePath = "https://poo-dev.unsada.edu.ar:8082/draiv/files"

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");
    if (token) {
      setToken(token);
    }
    if (userId) {
      setUserId(userId);
    }
    const fetchFolders = async () => {
      setIsLoading(true); 
      setError(null);
      try {
        const response = await fileService.getAllFolders();
        const folders = response.filter((file) => file.isFolder === true);
        setFolders(folders)
      } catch (err) {
        setError("Error al cargar las carpetas. Intenta de nuevo más tarde.");
      } finally {
        setIsLoading(false); 
      }
    };

    fetchFolders();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
      setFolders([...folders, { fileName: newFolderName }]);

      try {
        const folderPayload = {
          token,
          systemId: "3",
          userId,
          isFolder: true,
          filePath: `${basePath}/${newFolderName}`,
          fileExt: null,
          fileName: newFolderName,
          mimeType: null,
          content: null,
          isPublic: false,
        };

        const response = await fileService.createFolder(folderPayload);
        if (response.status == 200) {
          setAlertMessage("¡Carpeta creada correctamente!");
          setAlertSeverity("success");
          setFolders((prevFolders) => [...prevFolders, response]);
          setNewFolderName("");
          setAlertMessage("");
        } else {
          throw new Error("Error al crear la carpeta.");
        }
      } catch (error) {
        setAlert({ message: error.message, severity: "error" });
      }
    } else if (dialogAction === "delete") {
      await deleteFolder(targetFolderId);
    }
    closeDialog();
    setOpenSnackbar(true);
  };

  const deleteFolder = async (targetFolderId) => {
    try {
      const response = await fileService.deleteFileOrFolder(targetFolderId);
      if (response.success) {
        setAlertMessage(`Carpeta eliminada correctamente.`);
        setAlertSeverity("success");
        setFolders((prevFolders) => prevFolders.filter((folder) => folder.id !== targetFolderId));
        setAlertMessage("");
      } else {
        setAlertMessage(`Error: no se pudo eliminar la carpeta.`);
        setAlertSeverity("error");
        setAlertMessage("");
      }
    } catch (err) {
      console.error("Error al eliminar la carpeta:", err);
      setAlertMessage("Error al intentar eliminar la carpeta.");
      setAlertSeverity("error");
      setAlertMessage("");
    } finally {
      setOpenSnackbar(true);
    }
  }

  const handleCreateFolder = () => {
    if (!newFolderName) {
      setAlertMessage("Por favor, ingresa un fileName para la carpeta.")
      setAlertSeverity("warning")
      setOpenSnackbar(true);
      return;
    }

    if (!newFolderName.trim()) {
      setAlertMessage("El fileName de la carpeta no puede estar vacío.")
      setAlertSeverity("warning")
      setOpenSnackbar(true);
      return;
    }
    openConfirmationDialog("create");
  };

  const handleDeleteFolder = (id) => {
    openConfirmationDialog("delete", id);
  };

  return (
    <Box>
      {/* Campo para crear una carpeta */}
      <TextField
        label="Nombre de la carpeta"
        variant="outlined"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        sx={{ mr: 2, mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateFolder}
        sx={{ mb: 2 }}
      >
        Crear Carpeta
      </Button>

      {/* Selección de carpeta */}

      {/* Lista de carpetas con opción para eliminarlas */}
      {folders.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="10vh"
        >
          <Typography variant="h6" color="textSecondary">
            No hay carpetas disponibles.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <select
            onChange={(e) => setSelectedFolder(e.target.value)}
            value={selectedFolder}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Selecciona una carpeta</option>
            {folders.map((folder, index) => (
              <option key={index} value={folder.fileName}>
                {folder.fileName}
              </option>
            ))}
          </select>
        </Box>
      )}

      {folders.length > 0 && (
          folders.map((folder) => (
            <Box
              key={folder.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FolderIcon sx={{ mr: 1, color: "primary.main" }} />
                <span>{folder.fileName}</span>
              </Box>

              <IconButton
                color="error"
                onClick={() => handleDeleteFolder(folder.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        )}

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
              : `¿Estás seguro de que deseas eliminar la carpeta "${targetFolderId}"?`}
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
