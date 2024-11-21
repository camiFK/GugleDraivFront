import React from "react";
import Button from "@mui/material/Button";
import { useState } from "react";


function FileUpload({ onUpload, setErrorMessage }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file) {
      // Si no se seleccionó un archivo, muestra un mensaje de advertencia
      setErrorMessage({
        message: "Por favor, selecciona un archivo antes de subir.",
        severity: "error",
      });
      return;
    }
    // Si hay un archivo, pasa el archivo a la función onUpload
    onUpload(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleSubmit} variant="contained" color="primary" style={{ marginTop: "12px", width: "100%" }}>
        Subir Archivo
      </Button>
    </div>
  );
}

export default FileUpload;
