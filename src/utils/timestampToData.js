// input is date type timestamp without timezone from potgreSQL
// example inputs : "2005-05-28T00:00:00Z"
export default function formatDateAndCheckPast(dateString) {
  const date = new Date(dateString);

  const formattedDate = date
    .toLocaleString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Jakarta",
    })
    .replace(",", "")
    .replace(" at ", " - ");

  return {
    formattedDate,
    dateOnly: date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }),
    timeOnly: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Jakarta",
    }),
    isPast: date < new Date(),
  };
}

