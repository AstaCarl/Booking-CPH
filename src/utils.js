export const getUser = () => {
  if (!localStorage["sb-ofbgpdhnblfmpijyknvf-auth-token"]) {
    return {
      isLoggedIn: false,
    };
  }

  const user = JSON.parse(
    localStorage["sb-ofbgpdhnblfmpijyknvf-auth-token"]
  )?.user;

  return {
    isLoggedIn: true,
    userId: user.id,
    firstName: user.user_metadata.first_name ?? "",
    lastName: user.user_metadata.last_name ?? "",
    email: user.email,
  };
};

export const formatDateToDDMMYY = (date) => {
  // Get day, month, and year components from the date
  let day = date.getDate();
  let month = date.getMonth() + 1; // Months are zero-based
  let year = date.getFullYear() % 100; // Get last two digits of the year

  // Add leading zeros if needed
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  year = year < 10 ? "0" + year : year;

  // Combine components into the desired format
  const formattedDate = day + "/" + month + "-" + year;

  return formattedDate;
};

export const formatDateToYYYYMMDD = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const getTimeSlots = () =>
  Array.from({ length: 8 }, (_, i) => i + 8).map(
    (hour) =>
      `${hour.toString().padStart(2, "0")}:00 — ${(hour + 1)
        .toString()
        .padStart(2, "0")}:00`
  );
