const TextDate = (date) => {
  const dates = new Date(date);
  const formattedDate = dates.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formattedDate;
};

export default TextDate;
