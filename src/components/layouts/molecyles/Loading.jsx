// import React from 'react';
// import { useDisclosure } from '@mantine/hooks';
// import { LoadingOverlay, Button, Group, Box } from '@mantine/core';

// export function Loader() {
//   const [visible, { toggle }] = useDisclosure(false);

//   // Note that position: relative is required
//   return (
//     <>
//       <Box pos="relative">
//         <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
//         {/* ...other content */}
//       </Box>

//       <Group position="center">
//         <Button onClick={toggle}>Toggle overlay</Button>
//       </Group>
//     </>
//   );
// };
// export default Loader;


// Loading.js
import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { LoadingOverlay, Center, Container } from '@mantine/core';

const Loading = () => {
  const [visible, { toggle }] = useDisclosure(false);

  return (
    <Container>
      <Center style={{ minHeight: '5vh' }}>
        <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <button onClick={toggle}>Toggle Loading</button>
      </Center>
    </Container>
  );
};

export default Loading;
