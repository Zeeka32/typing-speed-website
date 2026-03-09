import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

export const sora = Sora({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Typing Speed Test",
  description: "Test your typing speed and accuracy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sora.className}>{children}</body>
    </html>
  );
}
