const consoleSuccess = (input) => {
  const green = "\x1b[32m";
  if (input) return console.log(green, input);
  console.warn("paste in some input to log it in green");
};

export default consoleSuccess;
