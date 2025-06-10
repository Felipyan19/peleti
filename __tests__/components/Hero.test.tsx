import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@testing-library/jest-dom";
import Hero from "@/components/Hero";

jest.mock("@/utils/useScrollToSection", () => ({
  useScrollToSection: jest.fn(() => ({
    ref: { current: null },
    shouldAnimate: true,
  })),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, priority, quality, sizes, ...imgProps } = props;
    return <img {...imgProps} />;
  },
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentPropsWithoutRef<"div">) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { whileHover, whileTap, animate, initial, ...domProps } =
        props as Record<string, unknown>;
      return <div {...domProps}>{children}</div>;
    },
  },
}));

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("Hero Component", () => {
  it("renders the hero section correctly", () => {
    renderWithTheme(<Hero />);

    const section = document.querySelector("#inicio");
    expect(section).toBeInTheDocument();
  });

  it("displays the correct title", () => {
    renderWithTheme(<Hero />);

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent("Peleti – Artesanías en Resina");
  });

  it("displays the correct description", () => {
    renderWithTheme(<Hero />);

    const description = screen.getByText(
      "Lleva belleza y color a tu espacio con piezas únicas hechas a mano"
    );
    expect(description).toBeInTheDocument();
  });

  it("displays the CTA button with correct text", () => {
    renderWithTheme(<Hero />);

    const button = screen.getByRole("link", {
      name: /explora nuestro catálogo/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "#catalogo");
  });

  it("has the background image", () => {
    renderWithTheme(<Hero />);

    const image = screen.getByAltText("Resin art background");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/taller-resina.jpg");
  });

  it("has the correct section id", () => {
    renderWithTheme(<Hero />);

    const section = document.querySelector("#inicio");
    expect(section).toBeInTheDocument();
  });
});
