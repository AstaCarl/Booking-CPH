import React from "react";
import { Header } from "./Header";
export default function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      <main>
        <div>{children}</div>
      </main>
    </div>
  );
}
