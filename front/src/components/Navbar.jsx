import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function Navbar() {
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
