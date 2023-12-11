import { supabase } from "@/supabase";
import {
  formatDateToDDMMYY,
  formatDateToYYYYMMDD,
  getTimeSlots,
} from "@/utils";
import emailjs from "@emailjs/nodejs";

export default async function handler(request, response) {
  const date = new Date(new Date().setDate(new Date().getDate() + 1));

  const getBookingsForNotification = async () => {
    const { data, error } = await supabase
      .from("Booking")
      .select("*")
      .eq("notified", false)
      .eq("Dato", formatDateToYYYYMMDD(date));

    if (error) {
      return false;
    }

    return data;
  };

  const getRooms = async () => {
    const { data, error } = await supabase.from("Rooms").select("*");

    if (error) {
      return false;
    }

    return data;
  };

  const bookings = await getBookingsForNotification(date);
  if (bookings === false) {
    return response.json({ success: false, error: "Couldn't fetch bookings!" });
  }

  const rooms = await getRooms();
  if (rooms === false) {
    return response.json({ success: false, error: "Couldn't fetch rooms!" });
  }

  const timeSlots = getTimeSlots();

  const groupedData = bookings.reduce((acc, current) => {
    const email = current.Email;
    if (!acc[email]) {
      acc[email] = [];
    }
    acc[email].push(current);
    return acc;
  }, {});

  for (const [email, value] of Object.entries(groupedData)) {
    const bookingsMessage = value.reduce(
      (accumulator, booking) =>
        `${accumulator}- Lokale ${rooms[booking.rumId].lokale} kl. ${
          timeSlots[booking.timeSlot]
        }\n`,
      ""
    );

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

  return response.json({ success: groupedData });
}
