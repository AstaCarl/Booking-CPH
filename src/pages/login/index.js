import React, { useEffect } from "react";
import { useState } from "react";
import { Loader, LoadingOverlay, TextInput } from "@mantine/core";
import { IconAt } from "@tabler/icons-react";
import { PasswordInput } from "@mantine/core";
import { Button } from "@mantine/core";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

import styles from "./index.module.css";
import { getUser } from "@/utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tjekker om brugeren er logget ind allerede
    const user = getUser();
    if (user.isLoggedIn) {
      router.push("/");
      return;
    }

    setIsLoading(false);
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // setIsLoading(true);
    // Here you can call your signup API or method
    console.log("Logging in with", email, password);
    loginNewUser();
  };

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
          <TextInput
            placeholder="E-mail"
            inputWrapperOrder={["input"]}
            onChange={handleEmailChange}
            error={error}
            value={email}
            leftSection={<IconAt size={16} />}
          />
          <PasswordInput
            type="password"
            onChange={handlePasswordChange}
            inputWrapperOrder={["input"]}
            placeholder="Kodeord"
            error={error}
            value={password}
          />
          {error && (
            <div className={styles.error}>Ugyldig Email eller Kodeord</div>
          )}
          <Button
            type="submit"
            variant="filled"
            style={{
              width: "80px",
              marginTop: "1rem",
              width: "fit-content",
            }}
          >
            Log på
          </Button>
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
