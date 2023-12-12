//Importere nødvendigt indhold og styles
import React from "react";
import { useState, useEffect } from "react";
import {
  Stepper,
  Button,
  Group,
  Stack,
  Grid,
  LoadingOverlay,
  Notification,
  Modal,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import classes from "./index.module.css";
import "@mantine/dates/styles.css";
import { useRouter } from "next/router";
import emailjs from "emailjs-com";
import Link from "next/link";
import {
  formatDateToDDMMYY,
  formatDateToYYYYMMDD,
  getTimeSlots,
  getUser,
} from "@/utils";
import { motion } from "framer-motion";
import { IconCalendar, IconClock } from "@tabler/icons-react";
import { supabase } from "@/supabase";

//Bookroom compontent defineres.
export default function Bookroom() {
  //State og funktioner er for at håndtere staten.
  const [activeStepper, setActiveStepper] = useState(0);
  const [selectedDate, setSelectedDate] = useState(Date | (null > null));
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [room, setRoom] = useState([]);
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const timeSlots = getTimeSlots();

  //Funktion der håndterer bookingen
  const handleCreateBooking = async () => {
    setIsLoading(true);

    //Objekter som er i booking
    const booking = {
      Email: user.email,
      Dato: formatDateToYYYYMMDD(selectedDate),
      rumId: selectedRoomId,
      timeSlot: selectedTimeSlot,
    };

    //Indsætter booking data i vores database som er i Supbase.
    const { data, error } = await supabase.from("Booking").insert(booking);
    if (error) {
      console.error("Error inserting data:", error);
      return;
    }

    //Her logger vi den indsatte data og sender en bekræftelses email med emailjs.
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
          timeslot: timeSlots[booking.timeSlot],
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
    setActiveStepper(3);
  };

  //Fetcher bruger data og data i componentet, hvis brugeren ikke er logget ind redirecter siden til login siden.
  useEffect(() => {
    const user = getUser();
    if (!user.isLoggedIn) {
      router.push("./login");
      return;
    }
    //hvis brugeren er logget ind sættes user objektet ind i state.
    setUser(user);

    getDataFromSupabase();
  }, []);

  //Fetcher ledige rum og aktive bookinger fra Supabase.
  const getDataFromSupabase = async () => {
    await getAvailableRooms();
    await getActiveBookings();
    setIsLoading(false);
  };

  //Fetcher ledige rum fra Supabase, henter alt data med select *
  const getAvailableRooms = async () => {
    const { data, error } = await supabase.from("Rooms").select("*");
    if (error) {
      console.error("No data");
      return;
    }

    setRoom(data);
  };

  //Fetcher aktive bookinger fra Supbase, henter alt data med select *
  const getActiveBookings = async () => {
    const { data, error } = await supabase.from("Booking").select("*");
    if (error) {
      console.error("No data");
      return;
    }

    setBookings(data);
  };

  //Håndterer data ændringer i date picker.
  const handleDateChange = async (date) => {
    setSelectedRoomId(null);
    setSelectedDate(date);
    setActiveStepper(1); //sætter stepperen til step 1
  };

  //Filtrer booking array i forhold til selectedDate.
  const activeBookingsForDate = selectedDate
    ? bookings.filter(
        (booking) => booking.Dato == formatDateToYYYYMMDD(selectedDate) //tjekker om Dato for hvert booking objekt er lig med den formatterede dato, hvis dette matcher inkluderes den i det filtrerede resultat.
      )
    : null; // retunerer null hvis ingen dato er valgt

  console.log(selectedDate);

  return (
    <>
      {/*Loading overlay */}
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <div
        style={{
          position: "relative",
        }}
      >
        <Modal
          size="lg"
          //Bekræft modalen åbner hvis selectedRoomId ikke er null, skifter modalen til "tak for din booking" modal når bookingen er gået igennem.
          opened={selectedRoomId !== null}
          onClose={() => {
            //når modalen lukker, altså hvis man trykker på vinduet sætter den selectedRoomId til null og redirceter til profile.
            !bookingConfirmed
              ? setSelectedRoomId(null)
              : router.push("/profile");
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
                  //bruger find() istedet for filter() for kun at returnere en istedet for et array
                  selectedRoomId && room.length > 0
                    ? room.find((r) => r.id == selectedRoomId).lokale
                    : ""
                }
              >
                {/* Ternary operator, if else one liner */}
                {selectedDate ? formatDateToDDMMYY(selectedDate) : ""}{" "}
                {/* Nullish coalescing operator, returnerer det til højre hvis det til venstre er null eller undefined, eller returnerer den det til venstre */}
                {timeSlots[selectedTimeSlot] ?? ""}
              </Notification>
              <p>
                Du får tilsendt en mail med en bekræftelse, samt en påmindelse
                om din booking 24 timer før.
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
                    {/* Vis valgt dato i formatet DDMMYY, hvis der er valgt en dato ellers vis en tom string */}
                    {/* Derefter vis tidspunkt for det valgte tidspunkt ellers vi en tom string, hvis tidspunktet ikke er valgt */}
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
                      //for at lukke modal sættes setSelectedRoomId til null
                      onClick={() => setSelectedRoomId(null)}
                      variant="outline"
                    >
                      Tilbage
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
          {/* Mantine stepper */}
          <Stepper
            active={activeStepper}
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
            <Stepper.Step
              label="Step 3"
              description="Vælg lokale"
            ></Stepper.Step>
          </Stepper>
        </div>
        <div>
          <Grid justify="space-between">
            {/* Step 1 - vælg dato */}
            <Grid.Col span={4}>
              {" "}
              <h2>Vælg dato</h2>
              {/* Mantine kalender */}
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
                      {/* Looper og retunerer timeslots fra databasen */}
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
                            setActiveStepper(2); //sætter Stepperen til 2
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
                        Alle lokaler indeholder whiteboards, stikkontakter,
                        borde og stole.
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
                            setActiveStepper(2); //sætter stepperen til 2
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
    </>
  );
}
