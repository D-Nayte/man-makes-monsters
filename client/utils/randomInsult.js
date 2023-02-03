const randomInsult = () => {
  const reason = [
    "with your Mom ",
    "just went pooping",
    "is dancing in the rain",
    "just cries",
    "Really sucks",
    "Nobody likes him",
  ];
  const randomIndex = Math.floor(Math.random() * (reason.length - 1));

  return reason[randomIndex];
};

export default randomInsult;
