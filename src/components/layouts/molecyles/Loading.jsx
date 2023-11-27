import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { LoadingOverlay, Button, Group, Box } from '@mantine/core';

//Loader components defineres.
export function Loader() {
  //State og funktion som håndtere visibility på loading overlay
  const [visible, { toggle }] = useDisclosure(false);

  // Note that position: relative is required
  return (
    <>
    {/*Container med positon realtvie for LoadingOverlay */}
      <Box pos="relative">
        {/*LoadingOverlay component */}
        <LoadingOverlay
        visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        {/* ...other content */}
      </Box>

      {/*Knap med toogle overlay*/}
      <Group position="center">
        <Button onClick={toggle}>Toggle overlay</Button>
      </Group>
    </>
  );
};
//Eksportere Loader components til en default export.
export default Loader;


