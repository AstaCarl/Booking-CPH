import React from "react";
import { Header } from "./Header";
import Footer from "./Footer";
export default function DefaultLayout({ children }) {
  return (
    <div>
      {/*Header component */}
      <Header />

      {/*Main content */}
      <main>
        <div>{children}</div>
      </main>
      <Footer/>
    </div>
  );
}
