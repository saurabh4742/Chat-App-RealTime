import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "../../auth";
const inter = Inter({ subsets: ["latin"] });
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "@/components/SocketContex";
export const metadata: Metadata = {
  title: "Chat-With-SSR",
  description: "Realtime-Web-App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <SocketProvider>
          {children}
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
