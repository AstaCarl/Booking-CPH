import React from "react";
import { Header } from "./Header";
import { Loader } from "@mantine/core";
import Loading from "./Loading";

export default function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      {/*Her har jeg sat loading ind */}
      <Loading/>
      <main>
        <div>{children}</div>
      </main>
    </div>
  );
}
