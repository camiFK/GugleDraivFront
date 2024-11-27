import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Box } from "@mui/material";
import fileService from "../services/fileService";

function Navbar() {
  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await fileService.logout(); // Se llama a la función de logout en fileService
      window.location.href = "/login"; // Redirige después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un problema al cerrar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* logo drive */}
            <img
              src="https://1000marcas.net/wp-content/uploads/2021/06/Google-Drive-logo.png"
              alt="Google Drive Logo"
              style={{ width: 50, height: 30, marginRight: 5 }}
            />
            <Typography variant="h6">Gugle Draiv</Typography>
          </Box>
          <Button color="inherit" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
