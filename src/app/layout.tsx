import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "src/components/Header";
import { AuthProvider } from "src/contexts/AuthContext";
import OnboardingGuard from "src/components/OnboardingGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoShop - E-commerce Shopping App",
  description: "Discover amazing products at unbeatable prices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <OnboardingGuard>
            {children}
          </OnboardingGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
