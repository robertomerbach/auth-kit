import "@/style/globals.css"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import Providers from "@/components/providers/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AuthKit",
    template: "%s | AuthKit",
  },
  description: "Authentication Kit for Next.js",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <main>
            <div className="relative flex flex-col overflow-x-hidden sm:overflow-hidden w-screen h-screen">
              <div className="w-full h-[100dvh] overflow-hidden flex bg-background">
                <div className="w-full h-full flex flex-col overflow-y-auto">
                  {children}
                  <Toaster expand={true} richColors position="bottom-center" />
                </div>
              </div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
