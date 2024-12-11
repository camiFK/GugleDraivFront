import axios from 'axios';

const API_URL = 'http://localhost:8082/draiv';
const PROD_USERS = 'https://poo2024.unsada.edu.ar/cuentas/login'
const PROD_DRAIV = 'https://poo-dev.unsada.edu.ar:8082'
const PROD_LOGIN = 'https://poo-dev.unsada.edu.ar:8088/cuentas/API/login'

// var token = localStorage.getItem("authToken");
//var token = "token1";

const fileService = {
  getAllFiles: async (path = null) => {
    try {
      var token = localStorage.getItem("authToken");
      let url = `${API_URL}/files?token=${token}&systemId=3`;
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
        `${API_URL}/files?token=${token}&systemId=3`
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
      const response = await axios.get(`${API_URL}/${id}`);
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
      const response = await axios.post(`${API_URL}/files`, {
        token: token,
        systemId: "3",
        isFolder: true,
        filePath: `${API_URL}/files/${fileName}`,
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
      const response = await axios.post(`${API_URL}/files`, payload);
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
      const response = await axios.post(`${PROD_LOGIN}`, {
        username: username,
        password: password,
      });
      const userData = response.data;
      localStorage.setItem("authToken", userData.token);
      localStorage.setItem("userId", userData.userId);
      await axios.post(`${API_URL}/users`, {
        userId: userData.userId,
        token: userData.token,
        expiresIn: userData.expiresIn,
      });
      return userData.token;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("userId es null.");
    }
    try {
      const response = await axios.delete(
        `${API_URL}/users/logout?userId=${userId}`,
        {
          userId: userId,
        }
      );

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
      const response = await axios.delete(`${API_URL}/files/${fileId}?token=${token}&systemId=3`);
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
      const response = await axios.get(`${API_URL}/download/${fileHash}`);
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
