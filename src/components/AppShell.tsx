"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

type Props = { children: React.ReactNode };

export default function AppShell({ children }: Props) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/docs");

  return (
    <>
      {!hideChrome && (
        <a className="skip-link" href="#main-content">
          Ir al contenido principal
        </a>
      )}
      {!hideChrome && <Navbar />}
      <main id="main-content">{children}</main>
    </>
  );
}


