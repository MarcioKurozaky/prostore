import type { Metadata } from "next";

// Import font Poppins
import { Poppins } from "next/font/google";

//globla css
import "./globals.css";

//constant
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";

//Next-Theme
import { GlobalThemeProvider } from "@/components/layout/GlobalThemeProvider";

// Toast
import { Toaster } from "@/components/ui/sonner";

//font Poppins
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
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
      <body className={`${poppins.className} antialiased`}>
        <GlobalThemeProvider>
          {children} <Toaster position="top-right" richColors />
        </GlobalThemeProvider>
      </body>
    </html>
  );
}
