import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@testing-library/jest-dom";
import About from "@/components/About";

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

describe("About Component", () => {
  it("renders the about section correctly", () => {
    renderWithTheme(<About />);

    const section = document.querySelector("#sobre-nosotros");
    expect(section).toBeInTheDocument();
  });

  it("displays the correct title", () => {
    renderWithTheme(<About />);

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveTextContent("Nuestra historia");
  });

  it("displays the workshop image", () => {
    renderWithTheme(<About />);

    const image = screen.getByAltText("Taller de resina artesanal");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/animal.jpg");
  });

  it("displays all paragraphs from about data", () => {
    renderWithTheme(<About />);

    expect(
      screen.getByText(/En Peleti combinamos tradición y creatividad/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Desde 20XX, nuestro taller familiar/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Nuestra misión es llevar inspiración/)
    ).toBeInTheDocument();
  });

  it("has the correct section id for navigation", () => {
    renderWithTheme(<About />);

    const section = document.querySelector("#sobre-nosotros");
    expect(section).toBeInTheDocument();
  });
});
