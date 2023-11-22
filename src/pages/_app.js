import "@/styles/globals.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import DefaultLayout from "@/components/layouts/molecyles/DefaultLayout";
import { CustomModal } from "@/components/layouts/molecyles/CustomModal";

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </MantineProvider>
  );
}
