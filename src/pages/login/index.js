import React from "react";
import { useState } from "react";
import { TextInput } from "@mantine/core";
import { IconAt } from "@tabler/icons-react";
import { PasswordInput } from "@mantine/core";
import { Button } from "@mantine/core";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

import styles from "./index.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState();

  const supabase = createClient(
    "https://ofbgpdhnblfmpijyknvf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0"
  );

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
      //   options: {
      //     redirectTo: 'https//example.com/welcome'
      //   }
    });
    // setIsLoading(false);

    if (data && data.user) {
      // Gemme user info i context.
      console.log("Successful login, email is", data.user.email);
      router.push("./bookroom");
    } else {
      console.log("hov");
      setError("Invalid Username or Password");
    }
    console.log("data", data);
    console.log("Error", error);
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
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
          <Button type="submit" variant="filled">
            Log på
          </Button>
          <div>
            Har du ikke en profil? <Link href="/">Opret bruger</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
