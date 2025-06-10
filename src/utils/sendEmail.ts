import emailjs from "@emailjs/browser";

interface EmailData {
  name: string;
  email: string;
  message: string;
}

export const sendEmail = async (data: EmailData): Promise<boolean> => {
  try {
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      message: data.message,
    };

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
    );

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
