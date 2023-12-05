// Funktion til at hente brugeroplysninger fra local storage
export const getUser = () => {
  // Tjek om authenticationtoken er til stede i lokal lagring
  if (!localStorage["sb-ofbgpdhnblfmpijyknvf-auth-token"]) {
    // Returner objekt der angiver, at brugeren ikke er logget ind
    return {
      isLoggedIn: false,
    };
  }

  // Laver JSON string om til JSON objekt af brugeroplysninger fra authenticationtoken i local storage
  const user = JSON.parse(
    localStorage["sb-ofbgpdhnblfmpijyknvf-auth-token"]
  )?.user;

  // Returner brugeroplysninger
  return {
    isLoggedIn: true,
    userId: user.id,
    firstName: user.user_metadata.first_name ?? "",
    lastName: user.user_metadata.last_name ?? "",
    email: user.email,
  };
};

// Funktion til at formatere dato til DD/MM-ÅÅ, som skal vises på siden
export const formatDateToDDMMYY = (date) => {
  // Få dag, måned og årskomponenter fra datoen
  let day = date.getDate();
  let month = date.getMonth() + 1; // Måneder er nulbaserede, derfor +1
  let year = date.getFullYear() % 100; // Få de sidste to cifre i året

  // Tilføj førende nuller hvis dag, måned og år er mindre end 10.
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  year = year < 10 ? "0" + year : year;

  // Tilføjer / og - imellem dag, måned og år
  const formattedDate = day + "/" + month + "-" + year;

  // Returner den formaterede dato
  return formattedDate;
};

// Funktion til at formatere dato til ÅÅÅÅ-MM-DD, for at databasen, kan tage imod den.
export const formatDateToYYYYMMDD = (date) => {
  // Udtræk måneds-, dags- og års komponenter fra datoen
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  // Tilføj foranstående nuller
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  // Tilføjer - i det ønskede format
  const formattedDate = [year, month, day].join("-");

  // Returner den formaterede dato
  return formattedDate;
};

export const getTimeSlots = () =>
  /*
  Array.from({ length: 8 } opretter en ny array med 8 entries (alle undefined)
  Bagefter looper vi igennem alle entries, men definerer entrien som `_`, da vi ikke skal bruge den
  I stedet for bruger vi `i`, som er vores nuværende index. Vi tilføjer 8 til den, da vi starter fra kl. 8
  Da vores array er 8 entries langt, vil vi derfor få tallene 8 til 15, som vi formaterer til en læsbar string.

  Returns: [08:00 - 09:00, ..., 15:00 - 16:00]
  */
  Array.from({ length: 8 }, (_, i) => i + 8).map(
    (hour) =>
      `${hour.toString().padStart(2, "0")}:00 — ${(hour + 1)
        .toString()
        .padStart(2, "0")}:00`
  );
