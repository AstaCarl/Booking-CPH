import React from "react";
import { useState, useEffect } from "react";
import { Stepper, Button, Group, Stack, Grid, GridCol, Select } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { IconInfoCircle } from "@tabler/icons-react";
import { Container } from "@mantine/core";
import { createClient } from "@supabase/supabase-js";
import { Notification } from '@mantine/core';



export default function ChooseDate() {

  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [value, setValue] = useState(Date | (null > null));
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [room, setRoom] = useState([]);
  const [showRooms, setShowRooms] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCalender, setShowCalendar] = useState(true);
  const [stepperIncremented, setStepperIncremented] = useState(false);

  const supabase = createClient(
    "https://ofbgpdhnblfmpijyknvf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0"
  );

  const handleCreateBooking = () => {
    const user = JSON.parse(
      localStorage["sb-ofbgpdhnblfmpijyknvf-auth-token"]
    )?.user
    //Indsætte data i booking tabllen
      const booking = {
        Email: user.email,
        Dato: value,
        rumId: selectedRoomId,
        fornavn: user.firstname,
        efternavn: user.lastname,
      };

      console.log(booking);
      addNewRow(booking);
      console.error("No room selected");
  };

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


  useEffect(() => {
    checkAvailableRooms();
  }, []);


  const handleNextStep = () => {
    nextStep();
    if (active === 1) {
      setShowRooms(true);
      setShowConfirm(true);
    } else {
      setShowRooms(false);
      setShowCalendar(false);
    }
  }

  const checkAvailableRooms = async () => {
  const { data, error } = await supabase
  .from('Rooms')
  .select('id, lokale')
  console.log(data, "Room");
  setRoom(data)
  if (error){
    console.error("No data")
  }
  }

  // ... (other state variables)

  const handleDateChange = async (date) => {
    setValue(date);

    // Check if the stepper has already been incremented
    if (!stepperIncremented) {
      // Show rooms and move to the next step
      setShowRooms(true);
      nextStep();

      // Set the flag to true to prevent further increments
      setStepperIncremented(true);
    }
  };



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
         <Button onClick={handleNextStep}>Next step</Button>
        </Group>
      </div>
      <div>
        <Grid>
          <div>
          {showCalender &&
          <Grid.Col span={6}>     <h2 pl>Vælg dato</h2>
            <DatePicker
              value={value}
              onChange={handleDateChange}
            />
           <IconInfoCircle size={16} />
           <p>Du kan maks have 1 aktiv booking pr. profil</p>
         </Grid.Col>
                   }
          </div>
          <div>
          <Grid.Col span={6}>
          {showRooms &&
           <Stack>
             <h2 pl>Vælg lokale<p> Alle lokaler indeholder whiteboards, stikkontakter, borde og stole.</p></h2>
             {room.map((roomItem) => (
                <Button
                  withCloseButton={false}
                  key={roomItem.id}
                  onClick={() => setSelectedRoomId(roomItem.id)}
                  size="xs"
                >
                  {roomItem.lokale}
                </Button>
              ))}
           </Stack>
            }
          </Grid.Col>
          </div>
       </Grid>
      </div>
      {/* {showConfirm && active === 3 && */}
      <><Grid>
          <Grid.Col span={6}>
            <Stack>
              13/11-2023(Placeholder)
              <Button variant="default" color="gray" size="xs">CL 3.04 (placeholder)</Button>
              Vil du bekræfte denne booking? du kan altid afmelde den igen
              <Button onClick={handleCreateBooking} variant="filled">Bekræft</Button>
            </Stack>
          </Grid.Col>
        </Grid><Button variant="outline" size="md">Tilbage</Button></>
      {/* } */}
    </div>
  );
}
