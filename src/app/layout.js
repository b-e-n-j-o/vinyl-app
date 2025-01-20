// src/app/layout.js
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from './providers' // Modifié ici
import Navbar from '../components/Navbar'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "DIGS",
  description: "Partagez vos découvertes vinyles",
};

export const dynamic = 'force-dynamic'

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased m-0 p-0`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}