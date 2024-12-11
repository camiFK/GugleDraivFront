import React, { useState, useEffect } from "react";
import { Button, TextField, Checkbox, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import fileService from "../services/fileService";

function FileUpload({ setErrorMessage, selectedFolder, setAlert, setFolders, setOpenSnackbar }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileBase64, setFileBase64] = useState(null);
  const basePath = "http://localhost:8082/draiv/files/"

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (token) {
      setToken(token);
    }
    if (userId) {
      setUserId(userId);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(e.target.files[0]?.name || "");

    const reader = new FileReader();
    reader.onloadend = () => {
      setFileBase64(reader.result.split(',')[1]); 
    };
    reader.readAsDataURL(selectedFile);
  };

  const confirmUpload = async () => {
    if (!file) {
      setErrorMessage({
        message: "Por favor, selecciona un archivo antes de subir.",
        severity: "error",
      });
      return;
    }
    
    if (selectedFolder != null) {
      const allFolders = await fileService.getAllFolders();
      var thisFolder = allFolders.find((f) => f.fileName === selectedFolder);
      var folderPath = `${basePath}${thisFolder.fileName}/`;
    }

    try {
      const filePayload = {
        token,
        systemId: "3",
        userId,
        isFolder: false,
        filePath: folderPath + fileName,
        fileExt: fileName.split(".").pop(),
        fileName,
        mimeType: file.type,
        content: fileBase64,
        isPublic,
        folderId: thisFolder.id
      };
      const response = await fileService.uploadFile(filePayload);

      if (response.success) {
        setAlert({
          message: "¡Archivo subido correctamente!",
          severity: "success",
        });

        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.fileName === selectedFolder
              ? { ...folder, archivos: [...folder.archivos, response.file] }
              : folder
          )
        );
      } else {
        throw new Error("Error al subir el archivo.");
      }
    } catch (error) {
      setAlert({ message: error.message, severity: "error" });
    } finally {
      setDialogOpen(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <div>
      {/* Selección del archivo */}
      <input type="file" onChange={handleFileChange} />

      {/* Campo de texto para el nombre del archivo */}
      <TextField
        label="Nombre del archivo"
        variant="outlined"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        fullWidth
        margin="normal"
      />

      {/* Checkbox para la visibilidad pública */}
      <FormControlLabel
        control={
          <Checkbox
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            color="primary"
          />
        }
        label="¿Hacer público el archivo?"
      />

      {/* Botón para subir archivo */}
      <Button
        onClick={() => setDialogOpen(true)}  // Mostrar diálogo de confirmación
        variant="contained"
        color="primary"
        style={{ marginTop: "12px", width: "100%" }}
      >
        Subir Archivo
      </Button>

      {/* Diálogo de confirmación de subida */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmar Subida</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas subir el archivo?
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

      {/* Mensaje de éxito o error */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default FileUpload;
