//Importere nødvendige indhold og styles
import { Title, Button } from "@mantine/core";
import classes from "./index.module.css";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Homepage() {
  return (
    <div className={classes.hero}>
      <section className={classes.container}>
        <Title className={classes.title}>Book lokaler hos Cph Business</Title>

        <div className={classes.buttons}>
          <motion.div
            whileHover={{
              scale: 1.02,
              opacity: 2,
            }} // Define the hover animation
            whileTap={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/*Link til login siden og knappen som hører til. */}
            <Link href="/login">
              <Button variant="outline" size="md" className={classes.control}>
                Log på
              </Button>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.02,
              opacity: 2,
            }} // Define the hover animation
            whileTap={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/*Link til signup siden og knappen som hører til. */}
            <Link href="/login/signup">
              <Button variant="filled" size="md" className={classes.control}>
                Opret profil
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
export default Homepage;
