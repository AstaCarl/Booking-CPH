import { IconLogout, IconUserCircle } from '@tabler/icons-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from "next/router";

export default function Footer() {
    const router = useRouter();

      //Når brugeren logger ud.
  const logoutUser = () => {
    localStorage.clear();
    router.push("/login");
  };
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
            }} href="/">
            Profil <IconUserCircle size={18}/>
            </Link>
        </section>
        </div>
    </footer>
  )
}
