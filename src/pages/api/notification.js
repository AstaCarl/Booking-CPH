//Importer nødvendige moduler og funktioner
import { supabase } from "@/supabase";
import {
  formatDateToDDMMYY,
  formatDateToYYYYMMDD,
  getTimeSlots,
} from "@/utils";
import emailjs from "@emailjs/nodejs";

//Hovedfunktionen, der håndterer forespørgslen
export default async function handler(request, response) {
  //Beregn datoen for i morgen
  const date = new Date(new Date().setDate(new Date().getDate() + 1));

  //Funktion til at hente bookinger for notifikation baseret på dato
  const getBookingsForNotification = async () => {
    const { data, error } = await supabase
      .from("Booking")
      .select("*")
      .eq("Dato", formatDateToYYYYMMDD(date));

    if (error) {
      return false;
    }

    return data;
  };

  //Funktion til at hente alle lokaler
  const getRooms = async () => {
    const { data, error } = await supabase.from("Rooms").select("*");

    if (error) {
      return false;
    }

    return data;
  };

  //Henter bookinger for notifikation
  const bookings = await getBookingsForNotification(date);
  if (bookings === false) {
    return response.json({ success: false, error: "Couldn't fetch bookings!" });
  }

  //Henter alle lokaler
  const rooms = await getRooms();
  if (rooms === false) {
    return response.json({ success: false, error: "Couldn't fetch rooms!" });
  }

  //Henter tidsslots
  const timeSlots = getTimeSlots();

  //Gruppe data efter e-mail
  const groupedData = bookings.reduce((acc, current) => {
    const email = current.Email;
    if (!acc[email]) {
      acc[email] = [];
    }
    acc[email].push(current);
    return acc;
  }, {});

  //Loop gennem grupperet data og send e-mails
  for (const [email, value] of Object.entries(groupedData)) {
    const bookingsMessage = value.reduce(
      (accumulator, booking) =>
        `${accumulator}- Lokale ${rooms[booking.rumId].lokale} kl. ${
          timeSlots[booking.timeSlot]
        }\n`,
      ""
    );

    //Send e-mails med EmailJS
    emailjs
      .send(
        "service_ambw8nr",
        "template_6xbafdq",
        {
          email,
          date: formatDateToDDMMYY(date),
          bookinger: bookingsMessage,
        },
        {
          publicKey: "DHs-0RPe7FVACEeuX",
          privateKey: "8-xq7OKVGYiFNvDymN8wf",
        }
      )
      .then(() => {
        console.log("Successfully notified", email);
      })
      .catch((error) => {
        console.error("Couldn't send e-mail", error);
      });
  }

  //Sender svar tilbage med grupperet data
  return response.json({ success: groupedData });
}
