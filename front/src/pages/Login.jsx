import React from 'react'
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
  } from "@mui/material";
  import fileService from '../services/fileService';

  const Login = () => {

    const handleLogin = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const username = data.get("username");
      const password = data.get("password");

      fileService.loginAndSaveToken(username, password);
    };
  
    return (
      <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5f5f5"}}>
        
        <Paper elevation={3} sx={{padding: 4, maxWidth: 400, width: "100%", textAlign: "center"}}>
          <Typography variant="h5" gutterBottom>
            Iniciar Sesión
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              name="username"
              label="Usuario"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              name="password"
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };
  

export default Login