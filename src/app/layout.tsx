import { Navbar } from "./components";
import "./globals.css";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

export default Layout;
