//Importere nødvendige indhold og styles.
import React from "react";
import { Group, Title, Button } from "@mantine/core";
import classes from "./error.module.css";
import { IconError404 } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";

//Funktional component som viser error siden.
export default function Error() {
  return (
    <div className={classes.notFound}>
      {/* Viser 404 error med ikonet. */}
      <IconError404 size={512} stroke={1} />
      {/* Viser titlen. */}
      <Title className={classes.title}>Noget er gået galt</Title>
      {/* Gruppe component og gør at knappen navigere til forsiden. */}
      <Group justify="center">
        <motion.div
          whileHover={{
            scale: 1.02,
            opacity: 2,
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: "fit-content",
          }}
        >
          {/*Link til forsiden */}
          <Link href="/">
            {/* Knappen som linker til forsiden.*/}
            <Button size="md">Tilbage til forsiden</Button>
          </Link>
        </motion.div>
      </Group>
    </div>
  );
}
