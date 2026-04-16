import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";
import { roboto } from "@/utils/fonts";
import { Toaster } from "react-hot-toast";
import Providers from "./components/Providers";

export const metadata = {
  title: "CineFlick",
  description: "Comprá tus entradas online — Ingresá acá para conocer todas las películas, horarios e información de CineFlick",
  icons: {
    icon: '/img/cineflick-logo.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className}`}>
        <Providers>
          <Header />
          {children}
          < Toaster position="top-right" reverseOrder={false} />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
