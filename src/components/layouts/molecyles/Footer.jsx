import { IconLogout, IconUserCircle } from '@tabler/icons-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from "next/router";

export default function Footer() {
    const router = useRouter();

      //Når brugeren logger ud.
  const logoutUser = () => {
    localStorage.clear();
    router.push("/");
  };

    //Array der definerer de sidder hvor footeren ikke skal være
    const pagesWithoutFooter = ['/', '/login', '/login/signup',];

    //Checker om den nuværende route er i det ovenstående array
    const shouldRenderFooter = !pagesWithoutFooter.includes(router.pathname);
  
    if (!shouldRenderFooter) {
      return null; // Return "null" hvis footeren ikke skal renderes på den nuværende route
    }

  return (
    <footer>
        <div>
        <section>
            <p>CPH Business Lokaler ©</p>
        </section>
        <section>
            <p>Cphbusiness@lokaler.dk</p>
        </section>
        <section className='links'>
            <Link
            style={{
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "14px",
            }} href="/login"
            onClick={logoutUser}
            >
            Log ud <IconLogout size={18}/>
            </Link>
            <Link style={{
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "14px",
            }} href="/profile">
            Profil <IconUserCircle size={18}/>
            </Link>
        </section>
        </div>
    </footer>
  )
}
