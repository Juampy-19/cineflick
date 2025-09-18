import Header from "./components/Header";
import "./globals.css";

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
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
