import axios from 'axios';

const API_URL = 'http://localhost:8082';
const PROD_URL = 'https://poo2024.unsada.edu.ar/draiv/'
const PROD_URL_USERS = 'https://poo-dev.unsada.edu.ar/cuentas/API/login'

// var token = localStorage.getItem("authToken");
//var token = "token1";

const fileService = {
  getAllFiles: async (path = null) => {
    try {
      var token = localStorage.getItem("authToken");
      let url = `${PROD_URL}/files?token=${token}&systemId=3`;
      if (path) {
        // parametro opcional, si existe construye la url
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
      var token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${PROD_URL}/files?token=${token}&systemId=3`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener las carpetas:", error);
      throw error;
    }
  },

  getFileById: async (id) => {
    try {
      var token = localStorage.getItem("authToken");
      const response = await axios.get(`${PROD_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el archivo con ID ${id}:`, error);
      throw error;
    }
  },

  createFolder: async (fileName) => {
    var token = localStorage.getItem("authToken");
    if (!fileName || !fileName.trim()) {
      throw new Error("El nombre de la carpeta no puede estar vacío.");
    }
    try {
      const response = await axios.post(`${PROD_URL}/files`, {
        token: token,
        systemId: "3",
        isFolder: true,
        filePath: `${PROD_URL}/files/${fileName}`,
        fileExt: null,
        fileName: fileName,
        mimeType: null,
        content: null,
        isPublic: false,
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

  uploadFile: async (payload) => {
    try {
      const response = await axios.post(`${PROD_URL}/files`, payload);
      console.log("Archivo subido exitosamente:", response.data);
      if (response.status == 200) {
        return { success: true, message: "¡Archivo subido exitosamente!" };
      }
      return { success: false, message: "Error desconocido." };
    } catch (error) {
      console.error("Error al subir el archivo:", error.response?.data || error.message);
      throw error;
    }
  },

  loginAndSaveToken: async (username, password) => {
    try {
      var token = localStorage.getItem("authToken");
      const response = await axios.post(`${PROD_URL_USERS}`, {
        username: username,
        password: password,
      });
      const userData = response.data;
      localStorage.setItem("authToken", userData.token);
      await axios.post(`${PROD_URL}/users`, {
        userName: userData.userId,
        token: token,
        expiresIn: userData.expiresIn,
      });
      return token;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No hay un token de autenticación disponible.");
      return;
    }
    try {
      const response = await axios.delete(`${PROD_URL}/users/logout?token=${token}`, {
        token: token,
      });

      if (response.status === 200) {
        localStorage.removeItem("authToken");
        console.log("Sesión cerrada exitosamente.");
      } else {
        throw new Error("Error al cerrar sesión en el servidor.");
      }
    } catch (error) {
      console.error("Error al intentar cerrar la sesión:", error);
    }
  },

  deleteFileOrFolder: async (fileId) => {
    try {
      var token = localStorage.getItem("authToken");
      const response = await axios.delete(`${PROD_URL}/files/${fileId}?token=${token}&systemId=3`);
      if (response.status == 200) {
        return { success: true, message: "¡Archivo subido exitosamente!" };
      }
      return { success: false, message: "Error desconocido." };
    } catch (error) {
      throw error;
    }
  },

  downloadFile: async (fileHash) => {
    try {
      const response = await axios.get(`${PROD_URL}/files/download/${fileHash}`);
      if (response.status == 200) {
        return { success: true, message: "¡Archivo descargado exitosamente!" };
      }
      return { success: false, message: "Error desconocido." };
    } catch (error) {
      throw error;
    }
  }
};

export default fileService;
