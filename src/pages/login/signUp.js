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

const supabase = createClient(
  "https://ofbgpdhnblfmpijyknvf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0"
);

const SignUp = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [error, setError] = useState();

  const router = useRouter();

  const handleFirstnameChange = (event) => {
    setFirstname(event.target.value);
    setError("");
  };

  const handleLastnameChange = (event) => {
    setLastname(event.target.value);
    setError("");
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
    setError("");
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError("");
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   signUpNewUser();
  //   setError("Invalid Username or Password");
  // };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if all fields are filled
    if (!firstname || !lastname || !phone || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    signUpNewUser();
  };

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

    open();
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
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
            <Link href="/bookroom">
              <Button variant="outline">Book et lokale</Button>
            </Link>
          </div>
        </Modal>

        <h1>Opret bruger</h1>
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
        <form onSubmit={handleSubmit}>
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

export default SignUp;
