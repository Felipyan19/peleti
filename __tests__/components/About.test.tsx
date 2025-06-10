import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import About from "@/components/About";

jest.mock("@/utils/useScrollToSection", () => ({
  useScrollToSection: jest.fn(() => ({
    ref: { current: null },
    shouldAnimate: true,
  })),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
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
    expect(image).toHaveAttribute("src", "/images/taller-resina.jpg");
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
