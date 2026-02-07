import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Layatharang and Chakravyuh 2026 - Model Engineering College",
  description: "College Arts and Sports Festival Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
