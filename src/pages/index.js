import React, { useEffect, useState } from "react";
import { Notification } from "@mantine/core";
import { Button } from "@mantine/core";
import "./index.module.css";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { getUser } from "@/utils";

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
      <div className="container">
        <h1 className="">
          Hej! {user.firstName} {user.lastName}
          {/* Hej, {booking.length > 0 && booking[0].fornavn} {booking.length > 0 && booking[0].efternavn}! */}
        </h1>
        <h2>
          {booking.Dato}
          {activeBooking
            ? "Du har 1 aktiv booking"
            : "Du har ingen aktive bookinger"}
        </h2>
        {activeBooking ? (
          <>
            <h2>{booking.length > 0 && booking[0].Dato}</h2>
            <Notification
              withCloseButton={false}
              title={booking.length > 0 && room[booking[0]?.rumId]?.lokale}
            >
              <h2>
                {booking.length > 0 &&
                  room.find((r) => r.id === booking[0]?.rumId)?.beskrivelse}
              </h2>
            </Notification>
            <Button variant="filled" color="red">
              Afmeld
            </Button>
            <Button variant="filled">Afslut Tid</Button>
          </>
        ) : (
          <Button variant="filled">Book et lokale</Button>
        )}
      </div>
    </>
  );
};
export default Home;
