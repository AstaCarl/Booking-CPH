//Importere nødvendige indhold og styles
import React, { useEffect } from "react";
import { useState } from "react";
import { LoadingOverlay, TextInput } from "@mantine/core";
import { IconAt } from "@tabler/icons-react";
import { PasswordInput } from "@mantine/core";
import { Button } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import styles from "./index.module.css";
import { getUser } from "@/utils";
import { supabase } from "@/supabase";

//Login component defineres.
const Login = () => {
  //State variabler for email, password og loading status.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Router bruges til at linke til en anden side. 
  const router = useRouter();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Tjekker om brugeren er logget ind allerede.
  useEffect(() => {
    const user = getUser();
    if (user.isLoggedIn) {
      router.push("/profile");
      return;
    }

    setIsLoading(false);
  }, []);

  //Håndtere email input ændringer.
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  //Håndtere password input ændringer.
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError("");
  };

  //Håndtere form submit.
  const handleSubmit = (event) => {
    event.preventDefault();
    // setIsLoading(true);
    // Here you can call your signup API or method
    console.log("Logging in with", email, password);
    loginNewUser();
  };

  //Async funktion for at håndtere user login.
  async function loginNewUser() {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (data && data.user) {
      // Gemme user info i context.
      console.log("Successful login, email is", data.user.email);
      router.push("./bookroom");
      return;
    }

    setError("Invalid Username or Password");
    setIsLoading(false);
  }

  //Gengiver login form.
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <h1>EFIF</h1>
        <h2>Log På</h2>
        <form onSubmit={handleSubmit}>
          {/*Input felt for email. */}
          <TextInput
            placeholder="E-mail"
            inputWrapperOrder={["input"]}
            onChange={handleEmailChange}
            error={error}
            value={email}
            leftSection={<IconAt size={16} />}
          />
          {/*Input felt for password. */}
          <PasswordInput
            type="password"
            onChange={handlePasswordChange}
            inputWrapperOrder={["input"]}
            placeholder="Kodeord"
            error={error}
            value={password}
          />
          {/*Viser en error besked, hvis der er en error. */}
          {error && (
            <div className={styles.error}>Ugyldig Email eller Kodeord</div>
          )}
          {/* En motion.div tilføjer bevægelseseffekter ved hover og tryk */}
          <motion.div
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              width: "fit-content",
            }}
          >
            {/*Link til bookroom med styles */}
            {/*Submit knap. */}
            <Button
              type="submit"
              variant="filled"
              style={{
                marginTop: "1rem",
                width: "fit-content",
              }}
            >
              Log på
            </Button>
          </motion.div>

          {/*Link til signup siden.*/}
          <div>
            Har du ikke en profil?{" "}
            <Link
              href="/login/signup"
              style={{
                color: "#228BE6",
                textDecoration: "none",
              }}
            >
              Opret bruger
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
