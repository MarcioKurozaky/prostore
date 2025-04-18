import type { Metadata } from "next";
import { Inter } from "next/font/google";

//globla css
import "./globals.css";

//constant
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";

//Next-Theme
import { GlobalThemeProvider } from "@/components/layout/GlobalThemeProvider";

const inter = Inter({
  //variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <GlobalThemeProvider>{children}</GlobalThemeProvider>
      </body>
    </html>
  );
}
