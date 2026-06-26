"use client";

import React, { useEffect, useState } from "react";
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
  { label: "Sobre nosotros", href: "#sobre-nosotros" },
  { label: "Estilos", href: "#estilos" },
  { label: "Proceso", href: "#proceso" },
  { label: "Catalogo", href: "#catalogo" },
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
        ([entry]) => setIsOverHero(entry.intersectionRatio > 0.2),
        {
          threshold: [0, 0.2, 0.5, 0.8, 1],
          rootMargin: "-72px 0px 0px 0px",
        }
      );

      observer.observe(heroElement);

      return () => {
        observer.disconnect();
        document.documentElement.style.scrollBehavior = "auto";
      };
    }

    const handleScroll = () => {
      setIsOverHero(window.scrollY < window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const handleDrawerToggle = () => setIsOpen(!isOpen);

  const handleNavClick = (href: string) => {
    setIsOpen(false);

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
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
                minHeight: 48,
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
          <ListItemButton onClick={toggleTheme} sx={{ minHeight: 48, textAlign: "center" }}>
            <ListItemText primary={currentMode === "dark" ? "Modo oscuro" : "Modo claro"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const navSurface = isOverHero
    ? "rgba(255,255,255,0.04)"
    : muiTheme.palette.mode === "dark"
      ? "rgba(31,24,18,0.54)"
      : "rgba(252,250,245,0.58)";

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        bgcolor: isOverHero ? "transparent" : "background.paper",
        transition: "background-color 0.22s ease, box-shadow 0.22s ease",
        boxShadow: isOverHero ? "none" : "0 10px 26px rgba(32, 26, 23, 0.07)",
        borderBottom: isOverHero
          ? "1px solid rgba(255,255,255,0.10)"
          : `1px solid ${muiTheme.palette.divider}`,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 58, md: 64 },
          justifyContent: "space-between",
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: 0,
          gap: { xs: 1.5, md: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            minWidth: { md: 190 },
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              width: { xs: 34, md: 36 },
              height: { xs: 34, md: 36 },
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              border: "1px solid",
              borderColor: isOverHero ? "rgba(255,255,255,0.35)" : "rgba(32,26,23,0.12)",
              background: isOverHero ? "rgba(255,255,255,0.08)" : "rgba(169,106,60,0.08)",
              color: isOverHero ? "white" : "primary.main",
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: "0.98rem",
              fontWeight: 700,
              transition: "all 0.22s ease",
            }}
          >
            P
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontWeight: 700,
              fontSize: { xs: "1rem", md: "1.05rem" },
              letterSpacing: "0.04em",
              color: isOverHero ? "white" : "text.primary",
              transition: "color 0.22s ease",
              textShadow: isOverHero ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
            }}
          >
            Peleti
          </Typography>
        </Box>

        {shouldShowMobile ? (
          <IconButton
            onClick={handleDrawerToggle}
            aria-label="Abrir menu"
            edge="end"
            sx={{
              width: 40,
              height: 40,
              color: isOverHero ? "white" : "text.primary",
              border: "1px solid",
              borderColor: isOverHero ? "rgba(255,255,255,0.16)" : muiTheme.palette.divider,
              backgroundColor: isOverHero ? "rgba(255,255,255,0.06)" : "rgba(168,105,58,0.06)",
            }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            <Box
              component="nav"
              aria-label="Navegacion principal"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: 999,
                border: "1px solid",
                borderColor: isOverHero ? "rgba(255,255,255,0.10)" : "rgba(35,26,19,0.08)",
                backgroundColor: navSurface,
                backdropFilter: "blur(14px)",
              }}
            >
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
                    minWidth: "auto",
                    px: { md: 1.45, lg: 1.75 },
                    py: 0.75,
                    borderRadius: 999,
                    color: isOverHero ? "white" : "text.primary",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    transition: "all 0.18s ease",
                    textShadow: isOverHero ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                    "&:hover": {
                      color: isOverHero ? "white" : "primary.dark",
                      backgroundColor: isOverHero ? "rgba(255,255,255,0.10)" : "rgba(168,105,58,0.08)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                minWidth: { md: 190 },
              }}
            >
              <IconButton
                onClick={toggleTheme}
                aria-label="Cambiar tema"
                sx={{
                  width: 40,
                  height: 40,
                  color: isOverHero ? "white" : "primary.main",
                  border: "1px solid",
                  borderColor: isOverHero ? "rgba(255,255,255,0.14)" : "rgba(168,105,58,0.18)",
                  backgroundColor: isOverHero ? "rgba(255,255,255,0.06)" : "rgba(168,105,58,0.06)",
                  transition: "all 0.18s ease",
                  filter: isOverHero ? "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" : "none",
                  "&:hover": {
                    backgroundColor: isOverHero ? "rgba(255,255,255,0.12)" : "rgba(168,105,58,0.12)",
                  },
                }}
              >
                {currentMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </>
        )}

        <Drawer
          anchor="right"
          open={isOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: 260 },
          }}
        >
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
