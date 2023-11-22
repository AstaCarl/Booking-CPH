import React, { useEffect, useState } from "react";
import { Notification } from "@mantine/core";
import { Button } from "@mantine/core";
import classes from "./index.module.css";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { getUser } from "@/utils";
import { IconLogout } from "@tabler/icons-react";
import Link from "next/link";

const Home = () => {
  const [booking, setBooking] = useState([]);
  const [room, setRoom] = useState([]);
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState({});

  const supabase = createClient(
    "https://ofbgpdhnblfmpijyknvf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0"
  );

  //Tjekker om brugeren er logget ind, med authtoken som er gemt i local storage
  useEffect(() => {
    const user = getUser();
    setUser(user);

    // Hvis brugeren ikke er logget redirecter den til login side
    if (!user.isLoggedIn) {
      router.push("/login");
    } else {
      setUserEmail(user.email);
    }
  }, [router]);

  useEffect(() => {
    fetchBooking();
    fetchRoom();
  }, [userEmail]);

  const fetchBooking = async () => {
    const { data, error } = await supabase
      .from("Booking")
      .select("Email, rumId, Dato")
      .eq("Email", userEmail);

    if (userEmail && "Email") {
      console.log(data, "booking");
      setBooking(data);
    }

    if (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  const fetchRoom = async () => {
    const { data, error } = await supabase.from("Rooms").select("*");
    console.log(data, "rooms");
    setRoom(data);

    if (error) {
      console.error("Error fetching rooms data");
    }
  };

  const activeBooking = booking && booking.length > 0 && booking[0].rumId;
  console.log(user);
  console.log(room);
  return (
    <>
      <div className={classes.container}>
        <div className={classes.box}>
          <h1 className={classes.firstHeading}>
            Hej! {user.firstName} {user.lastName}
          </h1>
          <h2 className={classes.secondHeading}>
            {booking.Dato}
            {activeBooking
              ? "Du har 1 aktiv booking"
              : "Du har ingen aktive bookinger"}
          </h2>
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
              <Button className={classes.btn} variant="filled" color="red">
                Afmeld
              </Button>
              <Button className={classes.btn} variant="filled">
                Afslut Tid
              </Button>
            </>
          ) : (
            <Link href="/bookroom">
              <Button className={classes.btn} variant="filled">
                Book et lokale
              </Button>
            </Link>
          )}
          <Link
            href="#"
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <div className={classes.logOut}>
              Log ud <IconLogout size={24} />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
export default Home;
