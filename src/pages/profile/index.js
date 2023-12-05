//Importere nødvendige indhold og styles.
import React, { useEffect, useState } from "react";
import { Notification } from "@mantine/core";
import { Button } from "@mantine/core";
import classes from "./index.module.css";
import { useRouter } from "next/router";
import { formatDateToDDMMYY, getUser } from "@/utils";
import { IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { LoadingOverlay } from "@mantine/core";
import { supabase } from "@/supabase";
import { motion } from "framer-motion";

//Funktional component defineres.
const Home = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const router = useRouter();
  const [user, setUser] = useState({});
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  //Tjekker om brugeren er logget ind, med authtoken som er gemt i local storage
  useEffect(() => {
    const user = getUser();

    // Hvis brugeren ikke er logget redirecter den til login side
    if (!user.isLoggedIn) {
      router.push("/login");
      return;
    }

    setUser(user);
  }, []);

  //Fetcher booking og rum data, når brugeren skifter.
  useEffect(() => {
    if (user !== null && Object.keys(user).length > 0) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    await fetchBooking();
    await fetchRoom();
    setIsLoading(false);
  };

  //Fetcher brugerens booking data fra Supabase.
  const fetchBooking = async () => {
    const { data, error } = await supabase
      .from("Booking")
      .select("*")
      .eq("Email", user.email);

    if (error) {
      console.error("Error fetching booking data:", error);
      return;
    }

    setBookings(data);
  };

  //Fetcher rum data fra Supabase.
  const fetchRoom = async () => {
    const { data, error } = await supabase.from("Rooms").select("*");
    if (error) {
      console.error("Error fetching rooms data");
    }

    setRooms(data);
  };

  //Håndterer sletning af brugerens booking.
  const handleDeleteBooking = async () => {
    const { _, error } = await supabase
      .from("Booking")
      .delete()
      .eq("id", selectedBooking.id);

    if (error) {
      console.error("error deleting data");
      return;
    }

    setBookings((bookings) =>
      bookings.filter((booking) => booking.id !== selectedBooking.id)
    );

    setSelectedBooking(null);
    close();
  };

  //Når brugeren logger ud.
  const logoutUser = () => {
    setIsLoading(true);
    localStorage.clear();
    router.push("/");
  };

  //JSX gengiver.
  return (
    <>
      <div className={classes.container}>
        {/* Loading overlay mens data bliver fetchet. */}
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <div className={classes.box}>
          {/*Modal for at sikre sletningen af booking.*/}
          <Modal
            size="lg"
            opened={opened}
            onClose={close}
            withCloseButton={false}
            centered
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                padding: "40px",
              }}
            >
              <h1 className={classes.margin}>Afmeld tid</h1>
              <p className={classes.margin}>
                Du er ved at afmelde din nuværende tid og frigiver lokalet.
              </p>
              <p>Er du sikker på det?</p>

              {/* Notifiktion med booking informationer. */}
              <Notification
                className={classes.notification}
                withCloseButton={false}
                title={
                  selectedBooking !== null
                    ? `${formatDateToDDMMYY(
                        new Date(selectedBooking.Dato)
                      )} - ${
                        rooms.find((room) => room.id === selectedBooking.rumId)
                          ?.lokale ?? "Ukendt"
                      }`
                    : ""
                }
              >
                <p>
                  {selectedBooking !== null
                    ? rooms.find((room) => room.id === selectedBooking.rumId)
                        ?.beskrivelse ?? "Ukendt"
                    : ""}
                </p>
              </Notification>

              {/*Knapperne for at bekræfte eller slette booking.*/}
              <Button
                onClick={handleDeleteBooking}
                style={{ marginRight: "15px" }}
                color="red"
              >
                Ja
              </Button>
              <Button onClick={close} variant="outline">
                Annullér
              </Button>
            </div>
          </Modal>

          {/*Booking status.*/}
          <h1>
            Hej, {user.firstName} {user.lastName}!
          </h1>
          <h2>
            {bookings.Dato}
            {bookings.length == 1
              ? "Du har 1 aktiv booking."
              : `Du har ${
                  bookings.length > 0 ? bookings.length : "ingen"
                } aktive bookinger.`}
          </h2>
          {/*Viser booking detaljer og muligheder baseret på den aktive bookings status. */}

          {bookings.map((booking) => (
            <div key={`booking-${booking.id}`}>
              <Notification
                className={classes.notification}
                withCloseButton={true}
                onClose={() => {
                  setSelectedBooking(booking);
                  open();
                }}
                title={`${formatDateToDDMMYY(new Date(booking.Dato))} - ${
                  rooms.find((r) => r.id === booking.rumId)?.lokale ?? ""
                }`}
              >
                <p className={classes.notificationText}>
                  {rooms.length > 0 &&
                    rooms.find((r) => r.id === booking.rumId)?.beskrivelse}
                </p>
              </Notification>
            </div>
          ))}

          <motion.div
            whileHover={{
              scale: 1.02,
              opacity: 2,
            }}
            whileTap={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            style={{
              width: "fit-content",
              marginTop: "1rem",
            }}
          >
            <Link href="/bookroom">
              <Button variant="filled">Book et lokale</Button>
            </Link>
          </motion.div>

          {/*Log ud link */}
          <div className={classes.logOut}>
            <motion.div
              whileHover={{
                scale: 1.02,
                opacity: 2,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={logoutUser}
              style={{ width: "fit-content" }} // Add pointer cursor on hover
            >
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
                onClick={logoutUser}
              >
                Log ud <IconLogout size={24} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
