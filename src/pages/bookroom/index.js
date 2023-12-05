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
import { createClient } from "@supabase/supabase-js";
import { Notification } from "@mantine/core";
import { useRouter } from "next/router";
import emailjs from "emailjs-com";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import Link from "next/link";
import {
  formatDateToDDMMYY,
  formatDateToYYYYMMDD,
  getTimeSlots,
  getUser,
} from "@/utils";
import { motion } from "framer-motion";
import { IconCalendar, IconClock } from "@tabler/icons-react";

//ChooseDate compontent defineres.
export default function ChooseDate() {
  //State og funktioner er for at håndtere staten.
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const [selectedDate, setSelectedDate] = useState(Date | (null > null));
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [room, setRoom] = useState([]);
  const [showRooms, setShowRooms] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [booking, setBooking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const timeSlots = getTimeSlots();

  //Supabase client
  const supabase = createClient(
    "https://ofbgpdhnblfmpijyknvf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0"
  );

  //Håndtere boookingen
  const handleCreateBooking = async () => {
    setIsLoading(true);

    //Objekter som er i Create booking
    const booking = {
      Email: user.email,
      Dato: selectedDate,
      rumId: selectedRoomId,
      timeSlot: selectedTimeSlot,
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
          date: formatDateToDDMMYY(selectedDate),
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

    setIsLoading(false);
    setBookingConfirmed(true);
    setActive(3);
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
    setSelectedDate(date);
    setActive(1); //sætter stepperen til step 1
  };

  const activeBookingsForDate = selectedDate
    ? bookings.filter(
        (booking) => booking.Dato == formatDateToYYYYMMDD(selectedDate)
      )
    : null;

  console.log(selectedDate);

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
        withCloseButton={true}
        centered
      ></Modal>

      <Modal
        size="lg"
        opened={selectedRoomId !== null}
        onClose={() => {
          !bookingConfirmed ? setSelectedRoomId(null) : router.push("/profile");
        }}
        withCloseButton={false}
        centered
      >
        {bookingConfirmed ? (
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
              {selectedDate ? formatDateToDDMMYY(selectedDate) : ""}{" "}
              {timeSlots[selectedTimeSlot] ?? ""}
            </Notification>
            <p>
              Du får tilsendt en mail med en bekræftelse, samt en påmindelse om
              din booking 24 timer før.
            </p>
            <motion.div
              whileHover={{
                scale: 1.0,
              }}
              whileTap={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/profile">
                <Button variant="outline">Se booking</Button>
              </Link>
            </motion.div>
          </div>
        ) : (
          <div className={classes.modal}>
            <div>
              <Stack>
                <h1>Bekræft</h1>
                <h2
                  style={{
                    margin: "0",
                  }}
                >
                  <IconCalendar
                    size={20}
                    style={{
                      marginRight: "5px",
                    }}
                  />
                  {selectedDate ? formatDateToDDMMYY(selectedDate) : ""} kl.{" "}
                  {timeSlots[selectedTimeSlot] ?? ""}
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
                    scale: 1.02,
                    opacity: 2,
                  }}
                  whileTap={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    className={classes.btn}
                    onClick={handleCreateBooking}
                    variant="filled"
                  >
                    Bekræft
                  </Button>
                </motion.div>
              </Group>
            </div>
          </div>
        )}
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
        <Stepper
          active={active}
          size="xs"
          style={{
            marginBottom: "2rem",
          }}
        >
          <Stepper.Step label="Step 1" description="Vælg dato"></Stepper.Step>
          <Stepper.Step
            label="Step 2"
            description="Vælg tidspunkt"
          ></Stepper.Step>
          <Stepper.Step label="Step 3" description="Vælg lokale"></Stepper.Step>
        </Stepper>
      </div>
      <div>
        <Grid justify="space-between">
          {/* Step 1 - vælg dato */}
          <Grid.Col span={4}>
            {" "}
            <h2>Vælg dato</h2>
            <div className={classes.border}>
              <DatePicker
                value={selectedDate}
                size="md"
                onChange={handleDateChange}
                minDate={new Date()}
              />
            </div>
          </Grid.Col>

          <Grid.Col span={4}>
            <div className={classes.timeslotWrapper}>
              {selectedDate !== null && selectedDate !== 0 && (
                <>
                  <h2>Vælg tidspunkt</h2>
                  <ul className={classes.timeSlots}>
                    {timeSlots.map((timeSlot, i) => (
                      <li
                        key={`timeSlot-${i}`}
                        style={
                          selectedTimeSlot == i
                            ? { color: "#228BE5", fontWeight: 700 }
                            : {}
                        }
                        onClick={() => {
                          setSelectedTimeSlot(i);
                          setSelectedRoomId(null);
                          setActive(2);
                        }}
                      >
                        <div>
                          <IconClock size={20} /> {timeSlot}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </Grid.Col>

          {/* Step 3 - vælg rum */}
          <Grid.Col span={4}>
            {selectedDate !== null &&
              selectedDate !== 0 &&
              selectedTimeSlot !== null && (
                <Stack>
                  <div className={classes.rooms}>
                    <h2
                      style={{
                        marginBottom: "1rem",
                      }}
                    >
                      Vælg lokale
                    </h2>
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
                          const isDisabled = activeBookingsForDate.find(
                            (booking) =>
                              booking.rumId == roomItem.id &&
                              booking.timeSlot == selectedTimeSlot
                          );

                          if (isDisabled) {
                            return;
                          }

                          setSelectedRoomId(roomItem.id);
                          setShowConfirm(true); //viser bekræft sektionen
                          setActive(2); //sætter stepperen til 2
                        }}
                        withCloseButton={false}
                        className={classes.roomItem}
                        disabled={activeBookingsForDate.find(
                          (booking) =>
                            booking.rumId == roomItem.id &&
                            booking.timeSlot == selectedTimeSlot
                        )}
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
        </Grid>
      </div>
    </div>
  );
}
