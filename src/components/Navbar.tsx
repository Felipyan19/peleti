"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "./ThemeRegistry";

const MENU_ITEMS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sobre Nosotros", href: "#sobre-nosotros" },
  { label: "Estilos", href: "#estilos" },
  { label: "Proceso", href: "#proceso" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Contacto", href: "#contacto" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const { mode, toggleTheme } = useThemeContext();

  const handleDrawerToggle = () => setIsOpen(!isOpen);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        {MENU_ITEMS.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component="a"
              href={item.href}
              sx={{
                textAlign: "center",
                color: "text.primary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={toggleTheme} sx={{ textAlign: "center" }}>
            <ListItemText
              primary={mode === "dark" ? "🌙 Modo oscuro" : "☀️ Modo claro"}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" color="default" sx={{ bgcolor: "background.paper" }}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
          px: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Image src="/images/taller-resina.jpg" alt="Peleti" width={32} height={32} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
            Peleti
          </Typography>
        </Box>

        {isMobile ? (
          <IconButton
            onClick={handleDrawerToggle}
            aria-label="open drawer"
            edge="end"
            sx={{ color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {MENU_ITEMS.map((item) => (
              <Button
                key={item.href}
                href={item.href}
                variant="text"
                sx={{
                  textTransform: "none",
                  color: "text.primary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {item.label}
              </Button>
            ))}
            <IconButton onClick={toggleTheme} color="primary" aria-label="Cambiar tema">
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        )}

        <Drawer
          anchor="right"
          open={isOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
