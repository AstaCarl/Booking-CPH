//Importere nødvendige indhold og styles
import { Title, Button } from "@mantine/core";
import classes from "./index.module.css";
import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getUser } from "@/utils";
import { useRouter } from "next/router";

// Eksporterer en funktionelt React-komponent ved navn Homepage.
export function Homepage() {
  // Henter router-objektet fra Next.js til navigation mellem sider.
  const router = useRouter();

  // useEffect hook, der kører, når komponenten er blevet monteret.
  useEffect(() => {
    // Henter brugeroplysninger fra en funktion kaldet getUser().
    const user = getUser();
    // Tjekker om brugeren er logget ind baseret på brugeroplysningerne.
    if (user.isLoggedIn) {
    // Hvis brugeren er logget ind, omdirigeres de til profilsiden.
      router.push("/profile");
      return;
    }
  }, []);

  return (
    <div className={classes.hero}>
      <section className={classes.container}>
        <Title className={classes.title}>Book lokaler hos Cph Business</Title>

        <div className={classes.buttons}>
          {/* En motion.div tilføjer bevægelseseffekter ved hover og tryk */}
            <motion.div
            whileHover={{
              scale: 1.02,
              opacity: 2,
            }}
            whileTap={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/*Link til login siden-*/}
            <Link href="/login">
              
              {/*Knappen til opret Log på  */}
              <Button variant="outline" size="sm">
                Log på
              </Button>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.02,
              opacity: 2,
            }}
            whileTap={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/*Link til signup siden */}
            <Link href="/login/signup">
              {/*Knappen til opret profil */}
              <Button variant="filled" size="sm">
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
