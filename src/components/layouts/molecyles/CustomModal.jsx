import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';

export function CustomModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal size="sm" opened={opened} onClose={close} withCloseButton={false}>
        <h1>placeholder</h1>
        <p></p>
        <Button variant='outline'>Knap</Button>
      </Modal>

      {/* <Button onClick={open}>Open Modal</Button> */}
    </>
  );
}