import React, { useEffect, useState } from "react";
import { Notification } from '@mantine/core';
import { Button } from '@mantine/core';
import "./index.module.css"
import { useRouter } from 'next/router';
import { createClient } from "@supabase/supabase-js";


const Home = () => {

  const [booking, setBooking] = useState([]);
  const [room, setRoom] = useState([]);
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  const supabase = createClient(
    "https://ofbgpdhnblfmpijyknvf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0"
  );

//Tjekker om brugeren er logget ind, med authtoken som er gemt i local storage
useEffect(() => {
  // Tjekker om brugeren er logget ind, med authtoken som er gemt i local storage
  const authToken = localStorage.getItem('sb-ofbgpdhnblfmpijyknvf-auth-token');

  // Hvis brugeren ikke er logget redirecter den til login side
  if (!authToken) {
    router.push('/login');
  } else {
    // Assuming you have user data stored in local storage, extract the email
    const userData = JSON.parse(authToken).user;

    // Check if email exists before setting it
    if (userData && userData.email) {
      setUserEmail(userData.email);
    } else {
      console.error("User email is undefined");
      // Handle this case as needed, e.g., redirect to login
      router.push('/login');
    }
  }
}, [router]);

  useEffect(() => {
    fetchBooking();
    fetchRoom();
  }, [userEmail])

  const fetchBooking = async () => {
    const { data, error } = await supabase
      .from('Booking')
      .select('*')
      .eq('Email', userEmail);
  
    console.log(data);
  
    if (data) {
      setBooking(data);
    }
  
    if (error) {
      console.error("Error fetching booking data:", error);
    }
  }


  const fetchRoom = async () => {
    const { data, error } = await supabase
    .from('Rooms')
    .select('*')
    console.log(data);
    setRoom(data);
    if (error){
      console.error("No data")
    }
  }


  const activeBooking = booking && booking.length > 0 && booking[0].rumId;

  const bookedRoom = room.find(room => room.id === activeBooking);

  return <>
  <div className="container">
  <h1>
    Hej!
    {/* Hej, {booking.length > 0 && booking[0].fornavn} {booking.length > 0 && booking[0].efternavn}! */}
  </h1>
  <h2>{activeBooking ? "Du har 1 aktiv booking" : "Du har ingen aktive bookinger"}</h2>
  {activeBooking ? (
  <>
  <h2>{booking.length > 0 && booking[0].Dato}</h2>
  <Notification withCloseButton={false} title={booking.length > 0 && booking[0].lokale} >
    {/* <h2>{booking.length > 0 && room[booking[0].rumId].lokale}</h2> */}
      </Notification>
      <Button variant="filled" color="red">Afmeld</Button>
      <Button variant="filled">Afslut Tid</Button>
      </>
    ) : <Button variant="filled">Book et lokale</Button>}
  </div>
  </>;
};
export default Home;
