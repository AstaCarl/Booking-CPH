import React from "react";
import { Header } from "./Header";
import { Loader } from "@mantine/core";
import { CustomModal } from "./CustomModal";
export default function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      <CustomModal/>
      <main>
        <div>{children}</div>
      </main>
    </div>
  );
}
