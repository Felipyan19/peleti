import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #071417 0%, #0b2226 40%, #0f3136 70%, #144046 100%)",
      }}
    >
      {children}
    </div>
  );
}
