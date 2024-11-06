import axios from 'axios';

const API_URL = 'http://localhost:8082/files';

const fileService = {

  getAllFiles: async () => {
    try {
      const response = await axios.get(API_URL);
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

//   uploadFile: async (fileData) => {
//     try {
//       const response = await axios.post(API_URL, fileData);
//       return response.data;
//     } catch (error) {
//       console.error("Error al subir el archivo:", error);
//       return { message: "No se pudo subir el archivo" };
//     }
//   }

};

export default fileService;
