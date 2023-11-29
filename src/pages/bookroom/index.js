//Importere nødvendige indhold og styles
import React from "react";
import { useState, useEffect } from "react";
import {
  Stepper,
  Button,
  Group,
  Stack,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import classes from "./index.module.css";
import "@mantine/dates/styles.css";
import { IconInfoCircle } from "@tabler/icons-react";
import { createClient } from "@supabase/supabase-js";
import { Notification } from "@mantine/core";
import { useRouter } from "next/router";
import emailjs from "emailjs-com";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import Link from "next/link";
import { formatDateToDDMMYY, formatDateToYYYYMMDD, getUser } from "@/utils";
import { motion } from "framer-motion";
import { IconCalendar } from "@tabler/icons-react";

//ChooseDate compontent defineres.
export default function ChooseDate() {
  //State og funktioner er for at håndtere staten.
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
  const [stepperIncremented, setStepperIncremented] = useState(false);
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [booking, setBooking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  //Supabase client
  const supabase = createClient(
    "https://ofbgpdhnblfmpijyknvf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0"
  );

  //Håndtere boookingen
  const handleCreateBooking = async () => {
    //Objekter som er i Create booking
    const booking = {
      Email: user.email,
      Dato: value,
      rumId: selectedRoomId,
      fornavn: user.firstname,
      efternavn: user.lastname,
    };

    //Indsætter booking data i vores database som er i Supbase.
    const { data, error } = await supabase.from("Booking").insert(booking);
    if (error) {
      console.error("Error inserting data:", error);
      return;
    }

    //Her logger vi den indsatte data og sender en bekræftelses email med at bruge emailjs.
    console.log("Data inserted:", data);
    emailjs
      .send(
        "service_ambw8nr",
        "template_vle6iha",
        {
          name: user.firstName,
          lastname: user.lastName,
          email: user.email,
          date: formatDateToDDMMYY(value),
          room: room[selectedRoomId].lokale,
        },
        "DHs-0RPe7FVACEeuX"
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );
    open(); //Åbner modalen.
  };

  //Fetcher bruger data og data i componentet.
  useEffect(() => {
    const user = getUser();
    if (!user.isLoggedIn) {
      router.push("./login");
      return;
    }

    setUser(user);

    getDataFromSupabase();
  }, []);

  //Fetcher ledige rum og aktive bookinger fra Supabase.
  const getDataFromSupabase = async () => {
    await getAvailableRooms();
    await getActiveBookings();
    setIsLoading(false);
  };

  //Fetcher ledige room fra Supabase
  const getAvailableRooms = async () => {
    const { data, error } = await supabase.from("Rooms").select("*");
    if (error) {
      console.error("No data");
      return;
    }

    setRoom(data);
  };

  //Fetcher aktive booking fra Supbase.
  const getActiveBookings = async () => {
    const { data, error } = await supabase.from("Booking").select("*");
    if (error) {
      console.error("No data");
      return;
    }

    setBookings(data);
  };

  //Håndtere data ændringer i date picker.
  const handleDateChange = async (date) => {
    setSelectedRoomId(null);
    setValue(date);
    console.log(bookings);

    //Viser rum og inkrement, hvis det ikke allerede er gjort.
    if (!stepperIncremented) {
      setShowRooms(true);
      nextStep();
      setStepperIncremented(true);
    }
  };

  const activeBookingsForDate = value
    ? bookings
        .filter((booking) => booking.Dato == formatDateToYYYYMMDD(value))
        .map((booking) => booking.rumId)
    : null;

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {/*Loading overlay */}
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      {/*Modal*/}
      <Modal
        size="lg"
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
      >
        <div className={classes.modal}>
          <h1 className={classes.margin}>Tak for din booking!</h1>
          <Notification
            withCloseButton={false}
            title={
              selectedRoomId && room.length > 0
                ? room.find((r) => r.id == selectedRoomId).lokale
                : ""
            }
          >
            {value ? formatDateToDDMMYY(value) : ""}
          </Notification>
          <p>Du får tilsendt en mail med en bekræftelse</p>
          <motion.div
            whileHover={{
              scale: 1.0,
            }} // Define the hover animation
            whileTap={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/">
              <Button variant="outline">Se booking</Button>
            </Link>
          </motion.div>
        </div>
      </Modal>

      {/*Main content */}
      <div>
        <h1
          style={{
            marginBottom: "15px",
          }}
        >
          Book et lokale
        </h1>
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="Step 1" description="Vælg dato"></Stepper.Step>
          <Stepper.Step label="Step 2" description="Vælg lokale"></Stepper.Step>
          <Stepper.Step label="Step 3" description="Bekræft"></Stepper.Step>
          <Stepper.Completed></Stepper.Completed>
        </Stepper>
      </div>
      <div>
        <Grid justify="space-between">
          <div className={classes.wrapper}>
            <Grid.Col span={4}>
              {" "}
              <h2>Vælg dato</h2>
              <div className={classes.border}>
                <DatePicker
                  value={value}
                  size="md"
                  onChange={handleDateChange}
                  minDate={new Date()}
                />
              </div>
              <p className={classes.infoText}>
                <IconInfoCircle size={16} />
                Du kan maks have 1 aktiv booking pr. profil
              </p>
            </Grid.Col>
          </div>
          <div className={classes.roomWrapper}>
            <Grid.Col span={4}>
              {showRooms && (
                <Stack>
                  <div className={classes.rooms}>
                    <h2>Vælg lokale</h2>
                    <p>
                      {" "}
                      Alle lokaler indeholder whiteboards, stikkontakter, borde
                      og stole.
                    </p>
                    {room.map((roomItem) => (
                      <Notification
                        title={roomItem.lokale}
                        key={`room-${roomItem.id}`}
                        onClick={() => {
                          if (!activeBookingsForDate.includes(roomItem.id)) {
                            setSelectedRoomId(roomItem.id);
                            setShowConfirm(true);
                            setActive(3);
                          }
                        }}
                        withCloseButton={false}
                        className={classes.roomItem}
                        disabled={activeBookingsForDate.includes(roomItem.id)}
                        style={{
                          marginBottom: "10px",
                          border:
                            selectedRoomId == roomItem.id
                              ? "2px solid #228BE5"
                              : "2px solid transparent",
                        }}
                      >
                        {roomItem.beskrivelse}
                      </Notification>
                    ))}
                  </div>
                </Stack>
              )}
            </Grid.Col>
          </div>

          <div className={classes.wrapper}>
            {showConfirm && (
              <Grid.Col span={4}>
                <div className={classes.confirm}>
                  <Stack>
                    <h2>Bekræft</h2>
                    <h2>
                      <IconCalendar
                        size={20}
                        style={{
                          marginRight: "5px",
                        }}
                      />
                      {value ? formatDateToDDMMYY(value) : ""}
                    </h2>
                    <Notification
                      withCloseButton={false}
                      title={
                        selectedRoomId && room.length > 0
                          ? room.find((r) => r.id == selectedRoomId).lokale
                          : ""
                      }
                    >
                      {selectedRoomId && room.length > 0
                        ? room.find((r) => r.id == selectedRoomId).beskrivelse
                        : ""}
                    </Notification>
                    Vil du bekræfte denne booking? du kan altid afmelde den igen
                  </Stack>
                  <Group>
                    <motion.div
                      whileHover={{
                        scale: 1.01,
                        opacity: 2,
                      }} // Define the hover animation
                      whileTap={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        className={classes.nextBtn}
                        onClick={handleCreateBooking}
                        variant="filled"
                      >
                        Bekræft
                      </Button>
                    </motion.div>
                  </Group>
                </div>
              </Grid.Col>
            )}
          </div>
        </Grid>
      </div>
    </div>
  );
}
