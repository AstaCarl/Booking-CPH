import React from "react";
import { useState } from "react";
import { Stepper, Button, Group, Stack, Grid, GridCol } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { IconInfoCircle } from "@tabler/icons-react";
import { Container } from "@mantine/core";


export default function ChooseDate() {
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [value, setValue] = useState(Date | (null > null));

  return (
    <div>
      <div>
        <h1>Book et lokale</h1>
        <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Step 1" description="Vælg dato"></Stepper.Step>
        <Stepper.Step label="Step 2" description="Vælg lokale"></Stepper.Step>
        <Stepper.Step label="Step 3" description="Bekræft"></Stepper.Step>
        <Stepper.Completed></Stepper.Completed>
        </Stepper>
        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
           Back
         </Button>
         <Button onClick={nextStep}>Next step</Button>
        </Group>
      </div>
      <div>
        <Grid>
          <div>
          <Grid.Col span={6}>     <h2 pl>Vælg dato</h2>
           <DatePicker value={value} onChange={setValue}  />
           <IconInfoCircle size={16} />
           <p>Du kan maks have 1 aktiv booking pr. profil</p>
         </Grid.Col>
          </div>
          <div>
          <Grid.Col span={6}>
           <Stack>
             <h2 pl>Vælg lokale<p> Alle lokaler indeholder whiteboards, stikkontakter, borde og stole.</p></h2>
             
             <Button variant="default" color="gray" size="xs">CL 2.01</Button>
             <Button variant="default" color="gray" size="xs">CL 2.02</Button>
             <Button variant="default" color="gray" size="xs">CL 3.01</Button>
             <Button variant="default" color="gray" size="xs">CL 3.02</Button>
             <Button variant="default" color="gray" size="xs">CL 3.03</Button>
             <Button variant="default" color="gray" size="xs">CL 3.04</Button>
           </Stack>
          </Grid.Col>
          </div>
       </Grid>
      </div>

      
      <Grid>
        <Grid.Col span={6}>
          <Stack>
            13/11-2023(Placeholder)
            <Button variant="default" color="gray" size="xs">CL 3.04 (placeholder)</Button>
            Vil du bekræfte denne booking? du kan altid afmelde den igen
            <Button variant="filled">Bekræft</Button>;
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          image(Placeholder)
        </Grid.Col>
      </Grid>

    
     
   
    
     
     <Button variant="outline" size="md">Tilbage</Button>
    </div>
    
    
  );
}
