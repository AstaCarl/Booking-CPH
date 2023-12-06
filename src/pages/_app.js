// Import af globale stilarter og biblioteker til brug i hele applikationen.
import "@/styles/globals.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import DefaultLayout from "@/components/layouts/molecyles/DefaultLayout";

//App component er ansvarlig for gengive hele applicationen.
export default function App({ Component, pageProps }) {
  // Indpakning af hele applikationen med MantineProvider for styling
  // og brug af DefaultLayout for at have en konstant layoutstruktur.
  return (
    <MantineProvider>
      <DefaultLayout>
        {/*Gengiver helt specifikt et component fra en bestemt side. */}
        <Component {...pageProps} />
      </DefaultLayout>
    </MantineProvider>
  );
}
