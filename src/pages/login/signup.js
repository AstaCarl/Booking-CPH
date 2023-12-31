//Importere nødvendige indhold og styles.
import React from "react";
import { useState } from "react";
import { TextInput, PasswordInput, Modal, Button } from "@mantine/core";
import styles from "./index.module.css";
import Link from "next/link";
import { IconUser, IconLock, IconAt } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import classes from "./index.module.css";
import { supabase } from "@/supabase";
import { motion } from "framer-motion";

const Signup = () => {
  //State variabler.
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [error, setError] = useState();
  const [passwordError, setPasswordError] = useState();

  //Next.js router.
  const router = useRouter();

  //Funktion som håndtere ændringer på firstname input.
  const handleFirstnameChange = (event) => {
    setFirstname(event.target.value);
    setError("");
  };

  //Funktion som håndtere ændringer på lastname input.
  const handleLastnameChange = (event) => {
    setLastname(event.target.value);
    setError("");
  };

  //Funktion som håndtere ændringer på email input.
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  //Funktion som håndtere ændringer på password input.
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError("");
  };
  //Funktion som håndtere ændringer på gentag password input
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setError("");
  };

  //Funktion som håndtere ændringer på form submit.
  const handleSubmit = (event) => {
    event.preventDefault();

    // Checker om alle felterne er fyldte.
    // ||, betyder eller, hvis en af dem fejler setError
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError("Udfyld alle felter");
      return;
    }

    //tjekker om kodeordne matcher, hvis ikke kommer der en error message
    if (password !== confirmPassword) {
      setPasswordError("Kodeordne matcher ikke");
      return;
    }

    //Kalder denne funktion for at sign up en ny bruger.
    signUpNewUser();
  };

  //Funktion som sign up en ny bruger med Supabase.
  const signUpNewUser = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstname,
          last_name: lastname,
        },
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    //Hvis sign up er en succes, åbner modalen og logger bruger ind.
    open();
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {/*Modal */}
        <Modal
          size="lg"
          opened={opened}
          //Det er lukningen af modalen.
          onClose={() => {
            router.push("/bookroom");
          }}
          withCloseButton={false}
          centered
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              padding: "40px",
            }}
          >
            <h1 className={classes.margin}>Velkommen til!</h1>
            <p className={classes.margin}>
              Du er nu oprettet som bruger, og kan nu book et lokale.
            </p>
            {/* En motion.div tilføjer bevægelseseffekter ved hover og tryk */}
            <motion.div
              whileHover={{
                scale: 1.02,
                opacity: 2,
              }}
              whileTap={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              style={{ cursor: "pointer", width: "fir-content" }} // Add pointer cursor on hover
            >
              {/* Link som sender videre til bookroom */}
              <Link href="/bookroom">
                <Button variant="outline">Book et lokale</Button>
              </Link>
            </motion.div>
          </div>
        </Modal>

        <h1>Opret bruger</h1>
        {/*Link til login for eksisterende medlemmer. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <h2>Allerede medlem?</h2>
          <Link
            style={{
              textDecoration: "none",
              color: "#228BE6",
            }}
            href="/login"
          >
            <span>Login</span>
          </Link>
        </div>
        {/*Sign up formen */}
        <form onSubmit={handleSubmit}>
          {/*Input felt for firstname*/}
          <label htmlFor="firstname">Fornavn</label>
          <TextInput
            type="firstname"
            name="firstname"
            id="firstname"
            value={firstname}
            onChange={handleFirstnameChange}
            className={styles.input}
            placeholder="Nogen.."
            leftSection={<IconUser size={16} />}
            error={error}
          />
          {/*Input felt for lastname*/}
          <label htmlFor="lastname">Efternavn</label>
          <TextInput
            type="lastname"
            name="lastname"
            id="lastname"
            value={lastname}
            onChange={handleLastnameChange}
            className={styles.input}
            placeholder="Nogen.."
            leftSection={<IconUser size={16} />}
            error={error}
          />
          {/*Input felt for email*/}
          <label htmlFor="email">Email</label>
          <TextInput
            type="email"
            name="email"
            id="email"
            value={email}
            autoComplete="email"
            onChange={handleEmailChange}
            className={styles.input}
            placeholder="nogen@example.com"
            leftSection={<IconAt size={16} />}
            error={error}
          />
          {/*Input felt for password*/}
          <label htmlFor="password">Adgangskode</label>
          <PasswordInput
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className={styles.input}
            placeholder="Kodeord"
            leftSection={<IconLock size={16} />}
            // returnerer error eller (||) passwordError hvis error er falsy
            error={error || passwordError}
          />

          {/*Input felt for gentagende password*/}
          <label htmlFor="confirmPassword">Gentag adgangskode</label>
          <PasswordInput
            type="confirmPassword"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={styles.input}
            leftSection={<IconLock size={16} />}
            placeholder="Gentag kodeord"
            error={error || passwordError}
          />
          {/* En motion.div tilføjer bevægelseseffekter ved hover og tryk */}
          <motion.div
            whileHover={{
              scale: 1.02,
              opacity: 2,
            }}
            whileTap={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            style={{ cursor: "pointer", width: "fit-content" }} // Add pointer cursor on hover
          >
            {/*Submit knap*/}
            <Button
              type="submit"
              variant="filled"
              disabled={isLoading}
              style={{
                width: "80px",
                marginTop: "1rem",
              }}
            >
              Opret
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
