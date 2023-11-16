import React from 'react'
import { useState } from 'react';
import { TextInput } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import { PasswordInput } from '@mantine/core';
import { Button } from '@mantine/core';
import styles from "./index.module.css"
import Link from 'next/link'
import {createClient} from '@supabase/supabase-js';
import { useRouter } from 'next/router';


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [error,setError]=useState();

    const supabase = createClient('https://ofbgpdhnblfmpijyknvf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // setIsLoading(true);
        // Here you can call your signup API or method
        console.log('Logging in with', email, password);
        loginNewUser();
    }

    async function loginNewUser() {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        //   options: {
        //     redirectTo: 'https//example.com/welcome'
        //   }
        })
        // setIsLoading(false);

        if (data && data.user) {
            // Gemme user info i context.
            console.log("Successful login, email is", data.user.email);
            router.push('/bookRoom');
        }
        else {
            console.log("hov")
            setError('Invalid Username or Password')
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
        variant="unstyled"
        type="email" 
        name='email'
        id='email'
        value={email} 
        onChange={handleEmailChange}
        className={`${styles.input} ${error ? styles.errorInput : ''}`}
        placeholder="  nogen@example.com" 
        rightSection={<IconAt size={16} className={error ? styles.errorIcon : ''} />} 
        error={error ? " " : null}/>
        <PasswordInput 
        variant="unstyled"
        className={`${styles.input} ${error ? styles.errorInput : ''}`}
        type="password" 
        name='password'
        id='password'
        value={password} 
        onChange={handlePasswordChange}
        placeholder="  Kodeord"
        error={error ? " " : null}
        />
         {error && <p className={styles.errorMessage}>Ugyldig Email eller Kodeord</p>}
        <Button
        style={{
            marginRight: "20px",
        }} 
        type='submit'
        variant="filled">Log på</Button>
        <Link href="/login/signIn">
          <Button variant="filled">Opret</Button>
    </Link>
        </form>
        </div>
    </div>
  )
}
export default Login;
