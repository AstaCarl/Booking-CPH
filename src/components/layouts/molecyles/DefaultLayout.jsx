import React from "react";
import { Header } from "./Header";
import { Loader } from "@mantine/core";
export default function DefaultLayout({ children }) {
  return (
    <div>
      {/*Header component */}
      <Header />

      {/*Main content */}
      <main>
        <div>{children}</div>
      </main>
    </div>
  );
}
