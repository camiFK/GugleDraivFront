import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Box } from "@mui/material";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Agregamos el logo como imagen */}
          <img
            src="https://1000marcas.net/wp-content/uploads/2021/06/Google-Drive-logo.png"
            alt="Google Drive Logo"
            style={{ width: 50, height: 30, marginRight: 5 }}
          />
          <Typography variant="h6">Gugle Draiv</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
