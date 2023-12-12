import React from "react";
import { Header } from "./Header";
import Footer from "./Footer";
export default function DefaultLayout({ children }) {
  return (
    <div>
      {/*Header component */}
      {/* Placering af Header komponenten øverst i layoutet */}
      <Header />

      {/*Main content */}
      <main>
        {/* Wrapper-div for dynmaisk indhold (children) */}
        <div>{children}</div>
      </main>

      {/* Placering af Footer komponenten nederst i layoutet */}
      <Footer />
    </div>
  );
}
