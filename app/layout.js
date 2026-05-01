import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PaintProvider } from "../context/PaintContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Digital Paint Lab - Professional Paint Mixing Simulator",
  description: "Mix custom paint colors with industry-standard pigments. Calculate coverage and get precise recipes for your wall painting projects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PaintProvider>
          {children}
        </PaintProvider>
      </body>
    </html>
  );
}
