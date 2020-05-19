let numSquares = 6;
let colors
var pickedColor;

var squares = document.querySelectorAll(".square");
var colorDisplay = document.getElementById("colorDisplay");
var messageDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
const resetBtn = document.querySelector("#reset");
const modeBtn = document.querySelectorAll(".mode");

init();

function init() {
  setUpModeButtons();
  setUpSquares();
  reset();
}

function setUpModeButtons() {
  for (let i = 0; i < modeBtn.length; i++) {
    modeBtn[i].addEventListener("click", function () {
      modeBtn[0].classList.remove("selected");
      modeBtn[1].classList.remove("selected");
      this.classList.add("selected");
      if (this.textContent === "Easy") {
        numSquares = 3;
      } else {
        numSquares = 6;
      }
      reset();
    });
  }
}

function setUpSquares() {
  for (let i = 0; i < squares.length; i++) {
    // add click listeners
    squares[i].addEventListener("click", function () {
      //grab color of picked square
      let clickedColor = this.style.backgroundColor;
      //compare color to picked color
      if (clickedColor === pickedColor) {
        messageDisplay.textContent = "Correct";
        changeColors(pickedColor);
        h1.style.backgroundColor = pickedColor;
        resetBtn.textContent = "Play Again";
      } else {
        this.style.backgroundColor = "#232323";
        messageDisplay.textContent = "Try again";
      }
    });
  }
}

function reset() {
  // generate all new colors
  colors = generateRandomColors(numSquares);
  // Pick a new winning color and display it
  pickedColor = pickColor();
  colorDisplay.textContent = pickedColor;
  resetBtn.textContent = "New Colors";
  messageDisplay.textContent = "";
  h1.style.backgroundColor = "steelblue";

  // Change the colors of the squares
  for (let i = 0; i < squares.length; i++) {
    if (colors[i]) {
      squares[i].style.display = "block";
      squares[i].style.backgroundColor = colors[i];
    } else {
      squares[i].style.display = "none";
    }
  }
}

resetBtn.addEventListener("click", function () {
  reset();
});


function changeColors(color) {
  //loop through all squares
  for (let i = 0; i < squares.length; i++) {
    //change their colors
    squares[i].style.backgroundColor = color;
  }
}

function pickColor() {
  let random = Math.floor(Math.random() * colors.length);
  return colors[random];
}

function generateRandomColors(num) {
  //make an array
  let arr = [];
  //add num random colors to array
  for (let i = 0; i < num; i++) {
    //get random color and push into array
    arr.push(randomColor());
  }
  //return that array
  return arr;
}

function randomColor() {
  //Pick a 'red' from 0 to 255
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // Generate a string : 'rgb(r, g, b)'
  return "rgb(" + r + ", " + g + ", " + b + ")";
}
