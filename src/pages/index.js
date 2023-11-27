//Importere nødvendige indhold og styles.
import React, { useEffect, useState } from "react";
import { Notification } from "@mantine/core";
import { Button } from "@mantine/core";
import classes from "./index.module.css";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { getUser } from "@/utils";
import { IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { LoadingOverlay } from "@mantine/core";

//Funktional component defineres.
const Home = () => {
  const [booking, setBooking] = useState([]);
  const [room, setRoom] = useState([]);
  const router = useRouter();
  const [user, setUser] = useState({});
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
    action: null,
  });

  //Supabase Client.
  const supabase = createClient(
    "https://ofbgpdhnblfmpijyknvf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0"
  );

  //Tjekker om brugeren er logget ind, med authtoken som er gemt i local storage
  useEffect(() => {
    const user = getUser();

    // Hvis brugeren ikke er logget redirecter den til login side
    if (!user.isLoggedIn) {
      router.push("/login");
      return;
    }

    setUser(user);
    setIsLoading(false);
  }, []);

  //Fetcher booking og rum data, når brugeren skifter.
  useEffect(() => {
    fetchBooking();
    fetchRoom();
  }, [user]);

  //Fetcher brugerens booking data fra Supabase.
  const fetchBooking = async () => {
    const { data, error } = await supabase
      .from("Booking")
      .select("Email, rumId, Dato")
      .eq("Email", user.email);

    if (error) {
      console.error("Error fetching booking data:", error);
      return;
    }

    setBooking(data);
  };

  //Fetcher rum data fra Supabase.
  const fetchRoom = async () => {
    const { data, error } = await supabase.from("Rooms").select("*");
    if (error) {
      console.error("Error fetching rooms data");
    }

    setRoom(data);
  };

  //Håndterer sletning af brugerens booking.
  const handleDeleteBooking = async () => {
    const { data, error } = await supabase
      .from("Booking")
      .delete()
      .eq("Email", user.email);

    if (error) {
      console.error("error deleting data");
    }
    close();
    window.location.reload();
  };

  //Når brugeren logger ud.
  const logoutUser = () => {
    setIsLoading(true);
    localStorage.clear();
    router.push("/login");
  };

  //Åbner modalen i en specifik handling.
  const openModal = (title, description, action) => {
    setModalContent({ title, description, action });
    open();
  };

  //Chekker om brugeren har en aktive booking.
  const activeBooking = booking && booking.length > 0 && booking[0].rumId;

  //Log bruger og rum til console.
  console.log(user);
  console.log(room);

  //JSX gengiver.
  return (
    <>
      <div className={classes.container}>
        <div className={classes.box}>
          {/* Loading overlay mens data bliver fetchet. */}
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
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
              <h1 className={classes.margin}>{modalContent.title}</h1>
              <p className={classes.margin}>
                Du er ved at afmelde din nuværende tid og frigiver lokalet.
              </p>
              <p>Er du sikker på det?</p>

              {/*Notifiktion med booking informationer.*/}
              <Notification
                className={classes.notification}
                withCloseButton={false}
                title={
                  booking.length > 0 &&
                  room.find((r) => r.id === booking[0]?.rumId)?.lokale
                }
              >
                <p className={classes.notificationText}>
                  {booking.length > 0 &&
                    room.find((r) => r.id === booking[0]?.rumId)?.beskrivelse}
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
          <h1 className={classes.firstHeading}>
            Hej, {user.firstName} {user.lastName}!
          </h1>
          <h2 className={classes.secondHeading}>
            {booking.Dato}
            {activeBooking
              ? "Du har 1 aktiv booking"
              : "Du har ingen aktive bookinger"}
          </h2>
          {/*Viser booking detaljer og muligheder baseret på den aktive bookings status. */}
          {activeBooking ? (
            <>
              <h3>{booking.length > 0 && booking[0].Dato}</h3>
              <Notification
                className={classes.notification}
                withCloseButton={false}
                title={
                  booking.length > 0 &&
                  room.find((r) => r.id === booking[0]?.rumId)?.lokale
                }
              >
                <p className={classes.notificationText}>
                  {booking.length > 0 &&
                    room.find((r) => r.id === booking[0]?.rumId)?.beskrivelse}
                </p>
              </Notification>

              {/*Knapper for at afslutte eller afmelde tid. */}
              <Button
                className={classes.btn}
                variant="filled"
                color="red"
                onClick={() =>
                  openModal(
                    "Afmeld tid!",
                    "Du er ved at afmelde din nuværende tid og frigiver lokalet. Er du sikker på det?",
                    handleDeleteBooking
                  )
                }
              >
                Afmeld tid
              </Button>
              <Button
                onClick={() =>
                  openModal(
                    "Afslut tid!",
                    "Du er ved at afmelde din nuværende tid og frigiver lokalet. Er du sikker på det?",
                    handleDeleteBooking
                  )
                }
                className={classes.btn}
                variant="filled"
              >
                Afslut Tid
              </Button>
            </>
          ) : (
            //Knap til at navigere til bookroom, når der ingen aktive bookinger er. 
            <Link href="/bookroom">
              <Button className={classes.btn} variant="filled">
                Book et lokale
              </Button>
            </Link>
          )}

          {/*Log ud link */}
          <div className={classes.logOut}>
            <Link
              href="#"
              style={{
                textDecoration: "none",
                color: "black",
              }}
              onClick={logoutUser}
            >
              Log ud <IconLogout size={24} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
