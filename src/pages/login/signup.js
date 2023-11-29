//Importere nødvendige indhold og styles.
import React from "react";
import { useState } from "react";
import { TextInput } from "@mantine/core";
import { IconAt } from "@tabler/icons-react";
import { PasswordInput } from "@mantine/core";
import styles from "./index.module.css";
import Link from "next/link";
import { IconUser } from "@tabler/icons-react";
import { IconPhone } from "@tabler/icons-react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import classes from "./index.module.css";
import { supabase } from "@/supabase";
import { motion } from "framer-motion";

const Signup = () => {
  //State variabler.
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [error, setError] = useState();

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

  //Funktion som håndtere ændringer på phone input.
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
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

  const handleConfirmPasswordChange =(event) => {
    setPassword(event.target.value);
    setError("");
  }

  //Funktion som håndtere ændringer på form submit.
  const handleSubmit = (event) => {
    event.preventDefault();

    // Checker om alle felterne er fyldte.
    if (!firstname || !lastname || !phone || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    //Kalder denne funktion for at sign up en ny bruger.
    signUpNewUser();
  };

  //Funktion som sign up en ny bruger med Supabase.
  async function signUpNewUser() {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
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
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {/*Modal */}
        <Modal
          size="lg"
          opened={opened}
          onClose={() => {}}
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
            <motion.div
              whileHover={{
                scale: 1.02,
                opacity: 2,
              }} // Define the hover animation
              whileTap={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              style={{ cursor: "pointer" }} // Add pointer cursor on hover
            >
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
          }}
        >
          <h2
            style={{
              marginRight: "5px",
            }}
          >
            Allerede medlem?
          </h2>
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
          {/*Input felt for phone*/}
          <label htmlFor="phone">Telefon</label>
          <TextInput
            type="phone"
            name="phone"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            className={styles.input}
            placeholder="12345678"
            leftSection={<IconPhone size={16} />}
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
            error={error}
          />

          <label htmlFor="confirmPassword">Gentag adgangskode</label>
          <PasswordInput
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={password}
            onChange={handleConfirmPasswordChange}
            className={styles.input}
            placeholder="Gentag adgangskode"
            error={error}
          />


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
        </form>
      </div>
    </div>
  );
};

export default Signup;
