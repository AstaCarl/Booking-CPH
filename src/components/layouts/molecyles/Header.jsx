import { IconUserCircle } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";

/*Header component */
export function Header() {

  return (
    <header>
      {/*Header component container */}
      <div>
        {/*Logo med link til en specifik URL*/}
        <Link href="/">
        <div>
          <img style={{
            width:"180px",
          }} src="/cphbusiness_payoff_neg-1854815586.png" alt="Logo" />
        </div>
        </Link>

        {/*Navigation items container */}
        <div className="items">
          <motion.div
            whileHover={{
              opacity: 0.8,
            }} // Define the hover animation
            transition={{ duration: 0.2 }}
            style={{
              width: "fit-content"
            }}
          >
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
          </motion.div>
          <motion.div
            whileHover={{
              opacity: 0.8,
            }}
            transition={{ duration: 0.2 }}
            style={{
              width: "fit-content"
            }}
          >
          {/*Link til profilsiden */}
          <Link href="/profile">
            <IconUserCircle size={30} />
          </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
