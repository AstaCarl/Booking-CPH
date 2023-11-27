import "@/styles/globals.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import DefaultLayout from "@/components/layouts/molecyles/DefaultLayout";

//App component er ansvarlig for gengive hele applicationen.
export default function App({ Component, pageProps }) {
  //Wrapping af hele applicationen med MatineProvider for at style.
  //og Defaultlayout for at have en konstant layout struktur.
  return (
    <MantineProvider>
      <DefaultLayout>
        {/*Gengiver helt specifikt et component fra en bestemt side. */}
        <Component {...pageProps} />
      </DefaultLayout>
    </MantineProvider>
  );
}
