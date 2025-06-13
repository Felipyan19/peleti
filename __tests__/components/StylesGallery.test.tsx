import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@testing-library/jest-dom";
import StylesGallery from "@/components/StylesGallery";

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

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      fill,
      priority,
      quality,
      sizes,
      width,
      height,
      style,
      ...imgProps
    } = props;
    return <img {...imgProps} />;
  },
}));

jest.mock("framer-motion", () => {
  const createMotionComponent = (
    Component: React.ComponentType<any> | string
  ) => {
    return ({ children, ...props }: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { whileHover, whileTap, animate, initial, variants, ...domProps } =
        props;
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
  FaExpand: () => <div data-testid="expand-icon">Expand Icon</div>,
}));

jest.mock("@/data/styleGallery.json", () => ({
  title: "Galería de Estilos",
  description: "Explora nuestros diferentes estilos de arte en resina",
  categories: {
    all: "Todos",
    natural: "Natural",
    modern: "Moderno",
  },
  styles: [
    {
      id: 1,
      name: "Estilo Natural",
      description: "Arte inspirado en la naturaleza",
      image: "/images/style1.jpg",
      category: "natural",
    },
    {
      id: 2,
      name: "Estilo Moderno",
      description: "Diseños contemporáneos y elegantes",
      image: "/images/style2.jpg",
      category: "modern",
    },
    {
      id: 3,
      name: "Estilo Mixto",
      description: "Combinación de elementos naturales y modernos",
      image: "/images/style3.jpg",
      category: "natural",
    },
  ],
}));

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("StylesGallery Component", () => {
  it("renders the styles gallery section correctly", () => {
    renderWithTheme(<StylesGallery />);

    const section = document.querySelector("#estilos");
    expect(section).toBeInTheDocument();
  });

  it("displays the correct title and description", () => {
    renderWithTheme(<StylesGallery />);

    const title = screen.getByText("Galería de Estilos");
    expect(title).toBeInTheDocument();

    const description = screen.getByText(
      "Explora nuestros diferentes estilos de arte en resina"
    );
    expect(description).toBeInTheDocument();
  });

  it("displays all category filter buttons", () => {
    renderWithTheme(<StylesGallery />);

    const allButton = screen.getByText("Todos");
    const naturalButton = screen.getByText("Natural");
    const modernButton = screen.getByText("Moderno");

    expect(allButton).toBeInTheDocument();
    expect(naturalButton).toBeInTheDocument();
    expect(modernButton).toBeInTheDocument();
  });

  it("displays all styles by default", () => {
    renderWithTheme(<StylesGallery />);

    expect(screen.getByText("Estilo Natural")).toBeInTheDocument();
    expect(screen.getByText("Estilo Moderno")).toBeInTheDocument();
    expect(screen.getByText("Estilo Mixto")).toBeInTheDocument();
  });

  it("filters styles correctly when category button is clicked", () => {
    renderWithTheme(<StylesGallery />);

    const modernButton = screen.getByText("Moderno");
    fireEvent.click(modernButton);

    expect(screen.getByText("Estilo Moderno")).toBeInTheDocument();
    expect(screen.queryByText("Estilo Natural")).not.toBeInTheDocument();
    expect(screen.queryByText("Estilo Mixto")).not.toBeInTheDocument();
  });

  it("shows natural styles when natural filter is applied", () => {
    renderWithTheme(<StylesGallery />);

    const naturalButton = screen.getByText("Natural");
    fireEvent.click(naturalButton);

    expect(screen.getByText("Estilo Natural")).toBeInTheDocument();
    expect(screen.getByText("Estilo Mixto")).toBeInTheDocument();
    expect(screen.queryByText("Estilo Moderno")).not.toBeInTheDocument();
  });

  it("returns to all styles when 'Todos' button is clicked", () => {
    renderWithTheme(<StylesGallery />);

    // First filter by modern
    const modernButton = screen.getByText("Moderno");
    fireEvent.click(modernButton);

    // Then click 'Todos' to show all
    const allButton = screen.getByText("Todos");
    fireEvent.click(allButton);

    expect(screen.getByText("Estilo Natural")).toBeInTheDocument();
    expect(screen.getByText("Estilo Moderno")).toBeInTheDocument();
    expect(screen.getByText("Estilo Mixto")).toBeInTheDocument();
  });

  it("displays style images with correct attributes", () => {
    renderWithTheme(<StylesGallery />);

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);

    const firstImage = images[0];
    expect(firstImage).toHaveAttribute("src", "/images/style1.jpg");
    expect(firstImage).toHaveAttribute("alt", "Estilo Natural");
  });

  it("displays category chips for each style", () => {
    renderWithTheme(<StylesGallery />);

    const naturalChips = screen.getAllByText("natural");
    const modernChips = screen.getAllByText("modern");

    expect(naturalChips.length).toBe(2); // Two natural styles
    expect(modernChips.length).toBe(1); // One modern style
  });

  it("displays expand icons on hover (via CSS classes)", () => {
    renderWithTheme(<StylesGallery />);

    const expandIcons = screen.getAllByTestId("expand-icon");
    expect(expandIcons.length).toBe(3); // One for each style card
  });

  it("has correct section id for navigation", () => {
    renderWithTheme(<StylesGallery />);

    const section = document.querySelector("#estilos");
    expect(section).toBeInTheDocument();
  });
});
