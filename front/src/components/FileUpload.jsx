import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import fileService from "../services/fileService";
import { useState, useEffect } from "react";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setToken(token);
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0]?.name || "");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor, selecciona un archivo.");
      return;
    }

    try {
      const payload = {
        token: token,
        systemId: "3",
        isFolder: file.isFolder,
        filePath: file.filePath,
        fileExt: fileName.split(".").pop(),
        fileName: file.fileName,
        mimeType: file.type,
        content: file.content,
        isPublic: file.isPublic,
      };

      const result = await fileService.uploadFile(payload);
      setMessage(`Archivo subido exitosamente. ID: ${result.fileId}`);
    } catch (error) {
      setMessage(
        "Error al subir el archivo. Revisa la consola para más detalles."
      );
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        style={{ marginTop: "10px" }}
      >
        Subir archivo
      </Button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FileUpload;
