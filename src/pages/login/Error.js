import React from "react";
import { Group, Title, Button } from "@mantine/core";
import classes from "./error.module.css";
import { IconError404 } from "@tabler/icons-react";

export default function Error() {
  return (
    <div className={classes.notFound}>
      <IconError404 />
      <Title>Noget er gået galt</Title>
      <Group justify="center">
        <Button size="md">Tilbage til forsiden</Button>
      </Group>
    </div>
  );
}
