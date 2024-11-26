import axios from 'axios';

const API_URL = 'http://localhost:8082';
const PROD_URL = 'https://poo2024.unsada.edu.ar'

// var token = localStorage.getItem("authToken");
var token = "token1";

const fileService = {
  getAllFiles: async (path = null) => {
    try {
      let url = `${API_URL}/files?token=${token}&systemId=3`;
      if (path) { // parametro opcional, si existe construye la url
        url += `&file=${encodeURIComponent(path)}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los archivos:", error);
      throw error;
    }
  },

  getAllFolders: async () => {
    try {
      const response = await axios.get(`${API_URL}/files?token=${token}&systemId=3`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las carpetas:", error);
      throw error;
    }
  },

  getFileById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el archivo con ID ${id}:`, error);
      throw error;
    }
  },

  createFolder: async (fileName) => {
    if (!fileName || !fileName.trim()) {
      throw new Error("El nombre de la carpeta no puede estar vacío.");
    }
    try {
      const response = await axios.post(`${API_URL}/files`, {
        token: token,
        systemId: "3",
        isFolder: true,
        filePath: `${API_URL}/files/${fileName}`,
        fileExt: null,
        fileName: fileName,
        mimeType: null,
        content: null,
        isPublic: false
      });
      if (response.status === 200) {
        return response.data; 
      } else {
        throw new Error("Error inesperado al crear la carpeta.");
      }
    } catch (error) {
      console.error("Error al crear la carpeta:", error);
      throw error;
    }
  },
  
  uploadFile: async ({
    token,
    systemId,
    isFolder,
    filePath,
    fileExt,
    fileName,
    mimeType,
    content,
    isPublic,
  }) => {
    try {
      const response = await axios.post(`${API_URL}/files`, {
        token,
        systemId,
        isFolder,
        filePath,
        fileExt,
        fileName,
        mimeType,
        content,
        isPublic,
      });
      console.log("Archivo subido exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error al subir el archivo:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  loginAndSaveToken: async (username, password) => {
    try {
      const response = await axios.post(`${PROD_URL}/cuentas/login`, {
        username: username,
        password: password,
      });
      const userData = response.data;
      localStorage.setItem("authToken", userData.token);
      await axios.post(`${API_URL}/users`, {
        userName: userData.userId,
        token: token,
        expiresIn: userData.expiresIn,
      });
      return token;
    } catch (error) {
      throw error;
    }
  },

  deleteFileOrFolder: async (fileId) => {
    try {
      const response = await axios.delete(`${API_URL}/files/${fileId}`, {
        token: token,
        systemId: "3"
      })
      return response.data;
    } catch (error) {
      throw error;
    }
  },

};

export default fileService;
