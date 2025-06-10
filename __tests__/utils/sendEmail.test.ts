import { sendEmail } from "@/utils/sendEmail";
import emailjs from "@emailjs/browser";

// Mock de emailjs
jest.mock("@emailjs/browser", () => ({
  send: jest.fn(),
}));

const mockedEmailjs = emailjs as jest.Mocked<typeof emailjs>;

describe("sendEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock de variables de entorno
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID = "test_service_id";
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = "test_template_id";
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = "test_public_key";
  });

  const mockEmailData = {
    name: "Juan Pérez",
    email: "juan@example.com",
    message: "Hola, me interesa una consulta sobre sus productos.",
  };

  it("should send email successfully and return true", async () => {
    mockedEmailjs.send.mockResolvedValueOnce({
      status: 200,
      text: "OK",
    });

    const result = await sendEmail(mockEmailData);

    expect(result).toBe(true);
    expect(mockedEmailjs.send).toHaveBeenCalledWith(
      "test_service_id",
      "test_template_id",
      {
        from_name: mockEmailData.name,
        from_email: mockEmailData.email,
        message: mockEmailData.message,
      },
      "test_public_key"
    );
  });

  it("should handle email sending failure and return false", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockedEmailjs.send.mockRejectedValueOnce(new Error("Email service error"));

    const result = await sendEmail(mockEmailData);

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error sending email:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should use correct template parameters", async () => {
    mockedEmailjs.send.mockResolvedValueOnce({
      status: 200,
      text: "OK",
    });

    await sendEmail(mockEmailData);

    const expectedParams = {
      from_name: mockEmailData.name,
      from_email: mockEmailData.email,
      message: mockEmailData.message,
    };

    expect(mockedEmailjs.send).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expectedParams,
      expect.any(String)
    );
  });
});
