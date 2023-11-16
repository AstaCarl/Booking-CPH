import React, { useEffect, useState } from "react";
import { Notification } from '@mantine/core';
import { Button } from '@mantine/core';
import "./index.module.css"


const Home = () => {

  const [booking, setBooking] = useState([]);
  const [room, setRoom] = useState([]);

  const fetchBooking = async () => {
    const tableName = "Booking";
    const projectUrl = "https://ofbgpdhnblfmpijyknvf.supabase.co"
    const data = await fetch(projectUrl + '/rest/v1/' + tableName, {
      headers: {
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0'
      }
    }).then(result => result.json())

    console.log(data);
    setBooking(data)
  }

  useEffect(() => {
    fetchBooking();
    fetchRoom();
  }, [])

  const fetchRoom = async () => {
    const tableName = "Rooms";
    const projectUrl = "https://ofbgpdhnblfmpijyknvf.supabase.co"
    const data = await fetch(projectUrl + '/rest/v1/' + tableName, {
      headers: {
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0'
      }
    }).then(result => result.json())

    console.log(data);
    setRoom(data)
  }

  console.log(room)

  const activeBooking = booking.length > 0 && booking[0].rumId;


  return <>
  <div className="container">
  <h1>
    Hej, {booking.length > 0 && booking[0].fornavn} {booking.length > 0 && booking[0].efternavn}!
  </h1>
  <h2>{activeBooking ? "Du har 1 aktiv booking" : "Du har ingen aktive bookinger"}</h2>
  {activeBooking ? (
  <>
  <h2>{booking.length > 0 && booking[0].Dato}</h2>
  <Notification withCloseButton={false} title={booking.length > 0 && booking[0].lokale}>
    {/* <h2>{booking.length > 0 && room[booking[0].rumId].lokale}</h2> */}
        You are now obligated to give a star to Mantine project on GitHub
      </Notification>
      <Button variant="filled" color="red">Afmeld</Button>
      <Button variant="filled">Afslut Tid</Button>
      </>
    ) : <Button variant="filled">Book et lokale</Button>}
  </div>
  </>;
};
export default Home;
