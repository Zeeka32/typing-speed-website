import type { Metadata } from "next";
import { headers } from "next/headers";
import { isRTL } from "react-aria-components";
import { ClientProviders } from "./provider";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const acceptLanguage = (await headers()).get("accept-language");
  const lang = acceptLanguage?.split(/[,;]/)[0] || "en-US";
  return (
    <html lang={lang} dir={isRTL(lang) ? "rtl" : "ltr"}>
      <body className={sora.className}>
        <ClientProviders lang={lang}>{children}</ClientProviders>
      </body>
    </html>
  );
}
