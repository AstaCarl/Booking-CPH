//Importere nødvendige indhold og styles.
import { Html, Head, Main, NextScript } from "next/document";

//Importere ColorSchemeScript fra Mantine for at håndtere color scheme.
import { ColorSchemeScript } from "@mantine/core";

//Brugeredefieret dokumentcomponent til udvidelse af Next js.
//og dokumentationsmåden.
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/*Inkludere ColorSchemeScript for at håndtere 
        color scheme baseret på brugerens præference. */}
        <ColorSchemeScript defaultColorScheme="auto" />
      </Head>
      {/*Body af dokumentet. */}
      <body>
        {/*Main content af applikationen. */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
