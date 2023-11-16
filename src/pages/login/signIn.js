import React from 'react'
import { useState } from 'react';
import { TextInput } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import { PasswordInput } from '@mantine/core';
import { Button } from '@mantine/core';
import styles from "./index.module.css"
import Link from 'next/link'
import { IconUser } from '@tabler/icons-react';
import { IconPhone } from '@tabler/icons-react';
import {createClient} from '@supabase/supabase-js';

const supabase = createClient('https://ofbgpdhnblfmpijyknvf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0');

const SignIn = (error, setError) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleFirstnameChange = (event) => {
        setFirstname(event.target.value);
    }

    const handleLastnameChange = (event) => {
        setLastname(event.target.value);
    }

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    }
    
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        console.log("hej fra firstname")
        event.preventDefault();
        // Here you can call your signup API or method
        console.log('Signing up with',firstname, lastname, email, password);
        signUpNewUser();
    }

    async function signUpNewUser() {
        const { data, error } = await supabase.auth.signUp({
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: password,
           options: {
             redirectTo: 'http://localhost:3000/login'
           }
        })
        if (data) {
            console.log("Successful login, email is", data.user.email);
        }
        console.log("data", data);
        console.log("Error", error);

      }

  return (
    <div className={styles.container}>
        <div className={styles.box}>
        <h1>Opret bruger</h1>
        <div style={{
            display: "flex",
            alignItems: "center",
        }}>
        <h2 style={{
                marginRight: "5px",
        }}
        >Allerede medlem?</h2>
        <Link style={{
            textDecoration: "none",
            color: "#228BE6",
        }} href="/login">
          <span>Login</span>
        </Link>
        </div>
        <form onSubmit={handleSubmit}>
        <label htmlFor="firstname">Fornavn</label>
        <TextInput
        variant='unstyled'
        type="firstname" 
        name='firstname'
        id='firstname'
        value={firstname} 
        onChange={handleFirstnameChange} 
        className={styles.input} 
        placeholder="Nogen.." 
        leftSection={<IconUser size={16} />} />
        <label htmlFor="lastname">Efternavn</label>
        <TextInput
        variant='unstyled'
        type="lastname" 
        name='lastname'
        id='lastname'
        value={lastname} 
        onChange={handleLastnameChange}
        className={styles.input} 
        placeholder="Nogen.." 
        leftSection={<IconUser size={16} />} />
        <label htmlFor="email">Email</label>
        <TextInput
        variant='unstyled'
        type="email" 
        name='email'
        id='email'
        value={email} 
        onChange={handleEmailChange}
        className={styles.input} 
        placeholder="nogen@example.com" 
        leftSection={<IconAt size={16} />} />
        <label htmlFor="phone">Telefon</label>
        <TextInput
        variant='unstyled'
        type="phone" 
        name='phone'
        id='phone'
        value={phone} 
        onChange={handlePhoneChange}
        className={styles.input} 
        placeholder="12345678" 
        leftSection={<IconPhone size={16} />} />
        <label htmlFor="password">Adgangskode</label>
        <PasswordInput 
        variant='unstyled'
        type="password" 
        name='password'
        id='password'
        value={password} 
        onChange={handlePasswordChange}
        className={styles.input} 
        placeholder="Kodeord"
        />
          <Button
          type="submit" 
          variant="filled">Opret</Button>
        </form>
        </div>
    </div>
  )
}

export default SignIn;
