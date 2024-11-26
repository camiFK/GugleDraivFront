import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { Snackbar, Alert } from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import fileService from "../services/fileService";

function FileList({ onDeleteFile, selectedFolder }) {
  const [searchText, setSearchText] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [files, setFiles] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilesByUser = async () => {
      setIsLoading(true); 
      setError(null);
      try {
        const filesFromApi = await fileService.getAllFiles();
        const filteredFiles = filesFromApi.filter((file) => file.isFolder == false);
        setFiles(filteredFiles);
      } catch (err) {
        setError("Error al cargar las carpetas. Intenta de nuevo más tarde.");
      } finally {
        setIsLoading(false); 
      }
    };

    fetchFilesByUser();
  }, []);

  const searchedFiles = files.filter(
    (file) =>
      file.fileName.toLowerCase().includes(searchText.toLowerCase()) &&
      (!selectedFolder || file.filePpath.includes(selectedFolder))
  );

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "fileName", headerName: "Nombre", width: 250 },
    {
      field: "filePath",
      headerName: "Path",
      width: 250,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    { field: "fileExt", headerName: "Ext", width: 150 },
    { field: "fileUrl", headerName: "Url", width: 150 },
    { field: "mimeType", headerName: "Type", width: 150 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteFile(params.row.id, false)}
        >
          <DeleteIcon />
        </IconButton>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  const handleDeleteFile = (fileId) => {
    setFileToDelete(fileId); // Guardar el ID del archivo a eliminar
    setDeleteDialogOpen(true); // Mostrar el diálogo de confirmación
  };

  return (
    <div style={{ height: 500, width: "100%" }}>
      <TextField
        label="Buscar archivo"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <DataGrid
        rows={searchedFiles}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        getRowId={(row) => row.id}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Archivo eliminado correctamente.
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el archivo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onDeleteFile(fileToDelete, false); // Llamar a la función de eliminación
              setOpenSnackbar(true);
              setDeleteDialogOpen(false); // Cerrar el diálogo
            }}
            color="primary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FileList;
