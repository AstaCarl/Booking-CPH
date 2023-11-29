import { Overlay, Container, Title, Button, } from '@mantine/core';
import classes from './homepage.module.css';
import React from 'react';

export function Homepage() {
  return (
    <div className={classes.hero}> 
      <Container className={classes.container} size="md">
        <Title className={classes.title}>Book lokaler hos Cph Business</Title>

        <div className={classes.buttons}>
        
        <Button variant="filled" size="xl" radius="xl" className={classes.control}>
          Log på
        </Button>
        <Button variant="filled" size="xl" radius="xl" className={classes.control}>
          Opret profil
        </Button>
        </div>
      </Container>
    </div>
  );
} export default Homepage