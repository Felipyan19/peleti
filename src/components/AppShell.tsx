"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

type Props = { children: React.ReactNode };

export default function AppShell({ children }: Props) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/docs");

  return (
    <>
      {!hideChrome && <Navbar />}
      <main>{children}</main>
    </>
  );
}


