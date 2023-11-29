import { useState } from "react";
import { Container, Group, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUserCircle } from "@tabler/icons-react";
import Link from "next/link";

{
  /*Definerer navigationslink */
}
const links = [{ link: "./pages/bookroom/", label: "Book et lokale" }];

/*Header component */
export function Header() {

  return (
    <header>
      {/*Header component container */}
      <div>
        {/*Logo med link til en specifik URL*/}
        <Link href="https://cphbusiness.mrooms.net/">
        <div>
          <img style={{
            width:"180px",
          }} src="/cphbusiness_payoff_neg-1854815586.png" alt="Logo" />
        </div>
        </Link>

        {/*Navigation items container */}
        <div className="items">

          {/*Link til bookroom med styles */}
          <Link
            href="/bookroom"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: "20px",
            }}
          >
            Book et lokale
          </Link>

          {/*Link til forsiden med et ikon */}
          <Link href="/">
            <IconUserCircle size={40} />
          </Link>
        </div>
      </div>
    </header>
  );
}
