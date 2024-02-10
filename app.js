import visualize from "./main.js";

const inputCard = document.getElementById("inputCard");
const plotCard = document.getElementById("plotCard");
const visualizeButton = document.querySelector(".btn-visualize");

// Add a state to the history representing the 'input' state
history.replaceState({ page: "input" }, "");

visualizeButton.addEventListener("click", () => {
  visualize();
  // Hide the input card and show the plot card
  inputCard.style.display = "none";
  plotCard.style.display = "block";
  // Add a state to the history representing the 'plot' state
  history.pushState({ page: "plot" }, "");
});

// Listen for the popstate event
window.addEventListener("popstate", function (event) {
  // If the state is the 'input' state, show the input card and hide the plot card
  if (event.state && event.state.page === "input") {
    inputCard.style.display = "block";
    plotCard.style.display = "none";
  }
  // If the state is the 'plot' state, hide the input card and show the plot card
  else if (event.state && event.state.page === "plot") {
    inputCard.style.display = "none";
    plotCard.style.display = "block";
  }
});

const textarea = document.getElementById("dlsCode");

textarea.addEventListener("focus", function () {
  this.style.height = "12em";
});

textarea.addEventListener("blur", function () {
  if (this.value === "") {
    this.style.height = "5em";
  }
});
