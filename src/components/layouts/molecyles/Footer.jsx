import { IconLogout, IconUserCircle } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
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
            <p>Log ud <IconLogout size={18}/></p>
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
