import React from "react";
import { useState } from "react";
import { Stepper, Button, Group } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { IconInfoCircle } from "@tabler/icons-react";

export default function ChooseDate() {
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [value, setValue] = useState(Date | (null > null));

  return (
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
      <h2>Vælg dato</h2>
      <DatePicker value={value} onChange={setValue} />
      <IconInfoCircle size={16} />
      <p>Du kan maks have 1 aktiv booking pr. profil</p>
    </div>
  );
}
