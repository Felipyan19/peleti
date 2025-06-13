"use client";

import React, { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const { mode, toggleTheme } = useThemeContext();

  useEffect(() => {
    setMounted(true);

    document.documentElement.style.scrollBehavior = "smooth";

    const heroElement =
      document.getElementById("inicio") ||
      document.querySelector('[data-section="hero"]') ||
      document.querySelector("section:first-of-type");

    if (heroElement) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsOverHero(entry.intersectionRatio > 0.2);
        },
        {
          threshold: [0, 0.2, 0.5, 0.8, 1],
          rootMargin: "-80px 0px 0px 0px",
        }
      );

      observer.observe(heroElement);

      return () => {
        observer.disconnect();
        document.documentElement.style.scrollBehavior = "auto";
      };
    } else {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        setIsOverHero(scrollTop < window.innerHeight * 0.8);
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        document.documentElement.style.scrollBehavior = "auto";
      };
    }
  }, []);

  const handleDrawerToggle = () => setIsOpen(!isOpen);

  const handleNavClick = (href: string) => {
    console.log(`🚀 Navbar click to: ${href}`);
    setIsOpen(false);

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const shouldShowMobile = mounted ? isMobile : false;
  const currentMode = mounted ? mode : "light";

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        {MENU_ITEMS.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component="a"
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
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
              primary={
                currentMode === "dark" ? "🌙 Modo oscuro" : "☀️ Modo claro"
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        bgcolor: isOverHero ? "transparent" : "background.paper",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isOverHero
          ? "none"
          : "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
        borderBottom: isOverHero
          ? "none"
          : `1px solid ${muiTheme.palette.divider}`,
      }}
    >
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
          <Image
            src="/images/taller-resina.jpg"
            alt="Peleti"
            width={32}
            height={32}
            style={{
              filter: isOverHero ? "brightness(0) invert(1)" : "none",
              transition: "filter 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: isOverHero ? "white" : "text.primary",
              transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              textShadow: isOverHero ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
            }}
          >
            Peleti
          </Typography>
        </Box>

        {shouldShowMobile ? (
          <IconButton
            onClick={handleDrawerToggle}
            aria-label="open drawer"
            edge="end"
            sx={{
              color: isOverHero ? "white" : "text.primary",
              transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              filter: isOverHero
                ? "drop-shadow(0 1px 2px rgba(0,0,0,0.3))"
                : "none",
            }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {MENU_ITEMS.map((item) => (
              <Button
                key={item.href}
                component="a"
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                variant="text"
                sx={{
                  textTransform: "none",
                  color: isOverHero ? "white" : "text.primary",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  textShadow: isOverHero ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                  "&:hover": {
                    color: isOverHero
                      ? "rgba(255, 255, 255, 0.8)"
                      : "primary.main",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            <IconButton
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              sx={{
                color: isOverHero ? "white" : "primary.main",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: isOverHero
                  ? "drop-shadow(0 1px 2px rgba(0,0,0,0.3))"
                  : "none",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              {currentMode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
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
