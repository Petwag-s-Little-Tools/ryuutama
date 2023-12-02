export const activateSpellListeners = (html) => {
  html.on("click", ".card-buttons button", (event) => console.log(event));
};
