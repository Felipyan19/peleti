"use client";

import React, { useEffect, useState, useRef } from "react";

const MENU_ITEMS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sobre Nosotros", href: "#sobre-nosotros" },
  { label: "Estilos", href: "#estilos" },
  { label: "Proceso", href: "#proceso" },
  { label: "Portafolio", href: "#portafolio" },
  { label: "Contacto", href: "#contacto" },
];

const Navbar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setVisible(true);
        if (timeoutId.current) clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => setVisible(false), 2000);
      } else {
        setVisible(false);
        if (timeoutId.current) clearTimeout(timeoutId.current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, []);

  // Mostrar menú si se navega a un hash (cambio de sección)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.scrollY > 0) {
        setVisible(true);
        if (timeoutId.current) clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => setVisible(false), 2000);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-opacity duration-300 bg-white/90 shadow ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
        <span className="font-bold text-lg flex items-center gap-2">
          <span className="inline-block w-4 h-4 bg-black rounded-full" /> Peleti
        </span>
        <ul className="flex gap-6 text-sm font-medium">
          {MENU_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
