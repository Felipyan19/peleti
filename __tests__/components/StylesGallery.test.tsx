import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@testing-library/jest-dom";

// Mock all the dependencies
jest.mock("@/utils/useScrollToSection", () => ({
  useEnhancedAnimation: jest.fn(() => ({
    ref: { current: null },
    shouldAnimate: true,
    getContainerVariants: () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }),
    getStaggerVariants: () => ({
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }),
  })),
}));

jest.mock("@/utils/useRandomImages", () => ({
  useRandomImages: jest.fn(() => ({
    currentImage: { name: "test.jpg", path: "/images/test.jpg" },
    changeImage: jest.fn(),
    isTransitioning: false,
    allImages: [],
  })),
}));

jest.mock("react-intersection-observer", () => ({
  useInView: jest.fn(() => ({
    ref: jest.fn(),
    inView: true,
    entry: null,
  })),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; [key: string]: unknown }) => {
    const { fill, priority, quality, sizes, width, height, style, ...imgProps } = props;
    return <img {...imgProps} />;
  },
}));

jest.mock("framer-motion", () => {
  const createMotionComponent = (Component: React.ComponentType<any> | string) => {
    return ({ children, ...props }: any) => {
      const { whileHover, whileTap, animate, initial, variants, ...domProps } = props;
      if (typeof Component === "string") {
        return React.createElement(Component, domProps, children);
      }
      return React.createElement(Component, domProps, children);
    };
  };

  const motion = Object.assign(createMotionComponent, {
    div: createMotionComponent("div"),
  });

  return { motion };
});

jest.mock("react-icons/fa", () => ({
  FaUniversity: () => <div data-testid="fa-university">University Icon</div>,
  FaShieldAlt: () => <div data-testid="fa-shield">Shield Icon</div>,
  FaLeaf: () => <div data-testid="fa-leaf">Leaf Icon</div>,
  FaCheck: () => <div data-testid="fa-check">Check Icon</div>,
}));

jest.mock("@/data/styleGallery.json", () => ({
  title: "Técnicas y Estilos",
  description: "Cada estilo refleja una filosofía artística única, combinando técnicas especializadas con paletas cromáticas cuidadosamente seleccionadas.",
  styles: [
    {
      id: 1,
      name: "Clásico & Escultórico",
      description: "Recreamos la elegancia atemporal de las grandes obras escultóricas. Figuras humanas, mitológicas y religiosas cobran vida con acabados que evocan mármol, oro y bronce envejecido.",
      icon: "FaUniversity",
      techniques: [
        "Acabados metálicos multicapa",
        "Pátinas envejecidas realistas",
        "Efectos de mármol veteado",
        "Incrustaciones doradas"
      ],
      examples: "Vírgenes, arcángeles, figuras clásicas, alegorías"
    },
    {
      id: 2,
      name: "Épico & Histórico",
      description: "Forjamos la esencia de épocas legendarias. Guerreros, armas y elementos históricos recreados con la fuerza del hierro, el temple del acero y la nobleza del cobre.",
      icon: "FaShieldAlt",
      techniques: [
        "Efectos de hierro forjado",
        "Oxidaciones controladas",
        "Grabados rúnicos",
        "Temple de acero realista"
      ],
      examples: "Vikingos, guerreros, espadas, armaduras"
    },
    {
      id: 3,
      name: "Natural & Orgánico",
      description: "Capturamos la esencia pura de la naturaleza. Fauna y elementos orgánicos que respiran vida con texturas auténticas y paletas que honran los tonos terrestres.",
      icon: "FaLeaf",
      techniques: [
        "Texturas orgánicas realistas",
        "Acabados mate naturales",
        "Gradientes terrestres",
        "Efectos de madera y piedra"
      ],
      examples: "Elefantes, fauna silvestre, elementos botánicos"
    }
  ]
}));

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("StylesGallery Component", () => {
  it("can be imported and is a function", () => {
    const StylesGallery = require("@/components/StylesGallery").default;
    expect(StylesGallery).toBeDefined();
    expect(typeof StylesGallery).toBe("function");
  });

  it("renders without crashing", () => {
    const StylesGallery = require("@/components/StylesGallery").default;
    const { container } = renderWithTheme(<StylesGallery />);
    expect(container).toBeInTheDocument();
  });

  it("renders the styles gallery section correctly", () => {
    const StylesGallery = require("@/components/StylesGallery").default;
    renderWithTheme(<StylesGallery />);

    const section = document.querySelector("#estilos");
    expect(section).toBeInTheDocument();
  });

  it("displays the correct title and description", () => {
    const StylesGallery = require("@/components/StylesGallery").default;
    renderWithTheme(<StylesGallery />);

    const title = screen.getByText("Técnicas y Estilos");
    expect(title).toBeInTheDocument();

    const description = screen.getByText(
      "Cada estilo refleja una filosofía artística única, combinando técnicas especializadas con paletas cromáticas cuidadosamente seleccionadas."
    );
    expect(description).toBeInTheDocument();
  });

  it("displays all styles", () => {
    const StylesGallery = require("@/components/StylesGallery").default;
    renderWithTheme(<StylesGallery />);

    expect(screen.getByText("Clásico & Escultórico")).toBeInTheDocument();
    expect(screen.getByText("Épico & Histórico")).toBeInTheDocument();
    expect(screen.getByText("Natural & Orgánico")).toBeInTheDocument();
  });

  it("displays techniques for each style", () => {
    const StylesGallery = require("@/components/StylesGallery").default;
    renderWithTheme(<StylesGallery />);

    // Check that techniques are displayed
    expect(screen.getByText("Acabados metálicos multicapa")).toBeInTheDocument();
    expect(screen.getByText("Efectos de hierro forjado")).toBeInTheDocument();
    expect(screen.getByText("Texturas orgánicas realistas")).toBeInTheDocument();
  });

  it("displays examples for each style", () => {
    const StylesGallery = require("@/components/StylesGallery").default;
    renderWithTheme(<StylesGallery />);

    expect(screen.getByText("Vírgenes, arcángeles, figuras clásicas, alegorías")).toBeInTheDocument();
    expect(screen.getByText("Vikingos, guerreros, espadas, armaduras")).toBeInTheDocument();
    expect(screen.getByText("Elefantes, fauna silvestre, elementos botánicos")).toBeInTheDocument();
  });

  it("displays style chips for each style", () => {
    const StylesGallery = require("@/components/StylesGallery").default;
    renderWithTheme(<StylesGallery />);

    const styleChips = screen.getAllByText(/Estilo \d+/);
    expect(styleChips.length).toBe(3); // One for each style
  });

  it("has correct section id for navigation", () => {
    const StylesGallery = require("@/components/StylesGallery").default;
    renderWithTheme(<StylesGallery />);

    const section = document.querySelector("#estilos");
    expect(section).toBeInTheDocument();
  });
});
