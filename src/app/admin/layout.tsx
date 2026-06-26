import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #1f140d 0%, #2e1e12 40%, #3d2817 70%, #4b3222 100%)",
      }}
    >
      {children}
    </div>
  );
}
