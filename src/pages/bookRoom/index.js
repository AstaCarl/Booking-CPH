import React from "react";
import { useState } from "react";
import { Stepper, Button, Group, Stack, Grid, GridCol } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { IconInfoCircle } from "@tabler/icons-react";
import { Container } from "@mantine/core";
import { createClient } from "@supabase/supabase-js";


export default function ChooseDate() {

  const supabase = createClient(
    "https://ofbgpdhnblfmpijyknvf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0"
  );

  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [value, setValue] = useState(Date | (null > null));

  const handleCreateBooking = () => {
    const user = JSON.parse(
      localStorage["sb-ofbgpdhnblfmpijyknvf-auth-token"]
    )?.user
    const booking = {Email: user.email, Dato: value, rumId: 3, fornavn: "Monique", efternavn: "Fruerlund"}
    console.log(booking)
    addNewRow(booking);
  }

  async function addNewRow(booking) {
    const { data, error } = await supabase
      .from('Booking')
      .insert(
        booking
      );
  
    if (error) {
      console.error('Error inserting data:', error);
      return;
    }
  
    console.log('Data inserted:', data);
  }


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
            <Button onClick={handleCreateBooking} variant="filled">Bekræft</Button>;
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
