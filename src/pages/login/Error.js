import React from 'react'
import { Group, Title, Button } from '@mantine/core'
import classes from './error.module.css' 
import {IconError404} from '@tabler/icons-react';


export default function Error() {
  return (
    <div classname={classes.root}>
      <IconError404 className={classes.icon}/>
        <Title className={classes.title} >Noget er gået galt</Title>
        <Group justify="center">
            <Button size="md">
                <h>Tilbage til forsiden</h>
            </Button>
        </Group>
    </div>
  )
}
