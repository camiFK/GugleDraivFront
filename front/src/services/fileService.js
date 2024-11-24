import axios from 'axios';

const API_URL = 'http://localhost:8082';
const PROD_URL = 'https://poo2024.unsada.edu.ar'

const fileService = {
  getAllFiles: async () => {
    try {
      const response = await axios.get(`${API_URL}/files`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los archivos:", error);
      return { message: "No se pudo obtener los archivos" };
    }
  },

  getFileById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el archivo con ID ${id}:`, error);
      return { message: "Archivo no encontrado" };
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
      console.log("Archivo/carpeta creado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error al crear el archivo/carpeta:",
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
      console.log(userData);
      await axios.post(`${API_URL}/users`, {
        userName: userData.userId,
        token: userData.token,
        expiresIn: userData.expiresIn,
      });
      localStorage.setItem("authToken", userData.token); // Se guarda el token
    } catch (error) {
      throw error;
    }
  },

  deleteFile: async (fileId, token, systemId) => {
    try {
      const response = await axios.delete(`${API_URL}/files/${fileId}`, {
        token: token,
        systemId: systemId
      })
    } catch (error) {
      console.log(error);
    }
  },

};

export default fileService;
