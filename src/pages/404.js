import React from "react";
import { Group, Title, Button } from "@mantine/core";
import classes from "./error.module.css";
import { IconError404 } from "@tabler/icons-react";
import Link from "next/link";

export default function Error() {
  return (
    <div className={classes.notFound}>
      <IconError404 size={512} stroke={1}/>
      <Title className={classes.title}>Noget er gået galt</Title>
      <Group justify="center">
        <Link href="/">
          <Button size="md">Tilbage til forsiden</Button>
        </Link>
      </Group>
    </div>
  );

}
