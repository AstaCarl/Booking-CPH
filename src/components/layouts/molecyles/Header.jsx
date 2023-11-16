import { useState } from 'react';
import { Container, Group, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './HeaderSimple.module.css';
import {IconUserCircle} from '@tabler/icons-react';

{/*Links */}
const links = [
  { link: '/about', label: 'Book et lokale' },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>

      <Container size="ml" className={classes.inner}>
        {/*Dette er vores logo */}
        <div className={classes.logo}>
          <img src="/cphbusiness_payoff_neg-1854815586.png" alt="Logo" />
        </div>

        <div>
        
        {/*Dette er links, som er oppe i const links.  */}
        <Group gap={5} visibleFrom="sm" >
          {items}

        {/*Dette er ikonet som er ude i højre side af headeren.   */}
          <IconUserCircle className={classes.icon}/>
        </Group>
        </div>
        
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}