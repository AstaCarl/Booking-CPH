import React from "react";
import { useState, useEffect } from "react";
import { Stepper, Button, Group, Stack, Grid } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import classes from "./index.module.css";
import "@mantine/dates/styles.css";
import { IconInfoCircle } from "@tabler/icons-react";
import { Container } from "@mantine/core";
import { createClient } from "@supabase/supabase-js";
import { Notification } from "@mantine/core";
import { useRouter } from "next/router";
import emailjs from "emailjs-com";
import { useToggle } from "@mantine/hooks";

export default function ChooseDate() {
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
  const [showCalender, setShowCalendar] = useState(true);
  const [stepperIncremented, setStepperIncremented] = useState(false);
  const router = useRouter();
  const [bookings, setBookings] = useState([]);

  const supabase = createClient(
    "https://ofbgpdhnblfmpijyknvf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0"
  );

  const handleCreateBooking = () => {
    const user = JSON.parse(
      localStorage["sb-ofbgpdhnblfmpijyknvf-auth-token"]
    )?.user;
    //Indsætte data i booking tabllen
    const booking = {
      Email: user.email,
      Dato: value,
      rumId: selectedRoomId,
      fornavn: user.firstname,
      efternavn: user.lastname,
    };

    var emailInfo = {
      name: user.firstname,
      email: user.email,
    };

    console.log(booking);
    addNewRow(booking, emailInfo);
    console.error("No room selected");
  };

  async function addNewRow(booking, emailInfo) {
    const { data, error } = await supabase.from("Booking").insert(booking);
    if (error) {
      console.error("Error inserting data:", error);
      return;
    }

    console.log("Data inserted:", data);
    emailjs
      .send(
        "service_ambw8nr",
        "template_vle6iha",
        emailInfo,
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
  }

  useEffect(() => {
    checkAvailableRooms();
    getActiveBookings();
  }, []);

  const handleNextClick = () => {
    setShowConfirm(true);
    setActive(3);
    setShowCalendar(false);
    setShowRooms(false);
  };

  const checkAvailableRooms = async () => {
    const { data, error } = await supabase.from("Rooms").select("id, lokale");
    console.log(data, "Room");
    setRoom(data);
    if (error) {
      console.error("No data");
    }
  };

  const getActiveBookings = async () => {
    const { data, error } = await supabase.from("Booking").select("*");
    setBookings(data);
  };

  const handleDateChange = async (date) => {
    function formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    }

    setValue(date);
    console.log(date);

    const { data, error } = await supabase
      .from("Booking")
      .select("*")
      .eq("Dato", formatDate(date));
    setBookings(data.map((b) => b.rumId));

    if (!stepperIncremented) {
      setShowRooms(true);
      nextStep();
      setStepperIncremented(true);
    }
  };

  return (
    <div>
      <div>
        {showCalender && (
          <h1 className={classes.firstHeading}>Book et lokale</h1>
        )}
        {showConfirm && (
          <h1 className={classes.firstHeading}>Bekræft din booking</h1>
        )}
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
            {showCalender && (
              <Grid.Col span={12}>
                {" "}
                <h2 className={classes.secondHeading}>Vælg dato</h2>
                <div className={classes.border}>
                  <DatePicker
                    value={value}
                    size="md"
                    onChange={handleDateChange}
                  />
                </div>
                <p className={classes.infoText}>
                  <IconInfoCircle size={16} />
                  Du kan maks have 1 aktiv booking pr. profil
                </p>
              </Grid.Col>
            )}
          </div>
          <div className={classes.roomWrapper}>
            <Grid.Col span={10}>
              {showRooms && (
                <Stack>
                  <h2 className={classes.secondHeading}>Vælg lokale</h2>
                  <p className={classes.roomDescription}>
                    {" "}
                    Alle lokaler indeholder whiteboards, stikkontakter, borde og
                    stole.
                  </p>
                  {room.map((roomItem) => (
                    <Button
                      className={classes.btn}
                      variant={
                        selectedRoomId === roomItem.id ? "filled" : "light"
                      }
                      key={roomItem.id}
                      disabled={bookings.includes(roomItem.id)}
                      onClick={() => setSelectedRoomId(roomItem.id)}
                      size="xs"
                    >
                      {roomItem.lokale}
                    </Button>
                  ))}
                  <div className={classes.endPlacement}>
                    <Button
                      className={classes.nextBtn}
                      variant="outline"
                      onClick={handleNextClick}
                    >
                      Videre
                    </Button>
                  </div>
                </Stack>
              )}
            </Grid.Col>
          </div>
        </Grid>
      </div>
      {showConfirm && (
        <>
          <Grid>
            <Grid.Col span={6}>
              <Stack>
                <h2 className={classes.thirdHeading}>placeholder</h2>
                <Notification withCloseButton={false} title="placeholder">
                  You are now obligated to give a star to Mantine project on
                  GitHub
                </Notification>
                Vil du bekræfte denne booking? du kan altid afmelde den igen
                <Button
                  className={classes.nextBtn}
                  onClick={handleCreateBooking}
                  variant="filled"
                >
                  Bekræft
                </Button>
              </Stack>
            </Grid.Col>
          </Grid>
          <Button className={classes.nextBtn} variant="outline" size="md">
            Tilbage
          </Button>
        </>
      )}
    </div>
  );
}
