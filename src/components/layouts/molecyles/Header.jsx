import { useState } from "react";
import { Container, Group, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUserCircle } from "@tabler/icons-react";
import Link from "next/link";

{
  /*Links */
}
const links = [{ link: "./pages/bookroom/", label: "Book et lokale" }];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  return (
    <header>
      <div>
        {/*Dette er vores logo */}
        <div>
          <img src="/cphbusiness_payoff_neg-1854815586.png" alt="Logo" />
        </div>

        <div className="items">
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
          <Link href="/">
            <IconUserCircle size={40} />
          </Link>
        </div>
      </div>
    </header>
  );
}
