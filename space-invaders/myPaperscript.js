var canon;
var laserShots = []; // Must be global to get accessed from both shoot and animate function

var direction = true; // True for right, false for left.
var stepSize = view.size.width / 20;

var aliens = new Group();
var startBtn = document.querySelector('#start-pause')
var resetBtn = document.querySelector('#reset')

var timerID;
var score = 0;
var scoreDisplay = document.querySelector('#score-display')

setup(2);

startBtn.addEventListener('click', function() {
  if (!timerID) {
    timerID = setInterval(aliensMove, 500);
    startBtn.textContent = 'Pause'
    startBtn.blur(); //Remove focus from the button to allow controls
  } else {
    clearInterval(timerID)
    timerID = null;
    startBtn.textContent = 'Start'
    startBtn.blur(); 
  }
})

resetBtn.addEventListener('click', function() {
  aliens.remove()
  aliens = new Group();
  canon.position = new Point(view.size.width / 2, view.size.height * 0.9)
  direction = true;
  resetBtn.blur()
  setup()
})

// canon controls
function onKeyDown(event) {
  if (event.key === "left" || event.key === "q") {
    // Move left if not at the border
    canonMoveL();

  } else if (event.key === "right" || event.key === "d") {
    // Move right if not at the border
    canonMoveR();
  } else if (event.key === "space") {
    // Shoot
    console.log("PEW PEW !!");
    shoot();

  }
}

function canonMoveL() {

  if (canon.bounds.left >= 20) {

    canon.position.x -= 10;
  }
}

function canonMoveR() {
  if (canon.bounds.right <= view.size.width - 20) {
    canon.position.x += 10;
  }
}

function shoot() {
  //offset the position of the shot from the center of the canon shape
  var laserPos = new Point(canon.position + [0, -4]);
  var laserShot = new Path(laserPos, laserPos + [0, -11]);
  laserShot.strokeColor = "red";

  laserShots.push(laserShot);

}

//General animations
function aliensMove() {

  var aliensArray = aliens.children;
  function lateralMove(alien) {
    if (direction) {
      alien.position.x += stepSize;
    } else {
      alien.position.x -= stepSize;
    }
  }
  
  lateralMove(aliens);
  var isAlienInScreen =
    aliens.bounds.right >= view.size.width - stepSize ||
    aliens.bounds.left <= stepSize;

  if (isAlienInScreen) {
    aliens.position.y += stepSize * 0.5; //adjusts for the width / height ratio of the view
    direction = !direction;
    lateralMove(aliens);
  }
  // Game over
  if (aliens.bounds.bottom >= view.size.height) {
    clearInterval(timerID);
    
  }
}

function laserMove() {
  //animate the laser shots fired (works on an empty array)
  laserShots.forEach(function (item) {
    item.position.y -= 2;
    //Remove the shots out of bounds
    if (item.position.y < 0) {
      var outOfBounds = laserShots.shift();
      outOfBounds.remove();
    }
  });
}

function isLaserHitting() {
  var aliensArray = aliens.children; //Create an array from the aliens Group to iterate over.

  laserShots.forEach(function (shot, index, array) {
    for (var i = aliensArray.length - 1; i >= 0; i--) {
      //iterate in reverse to avoid skipping an item.
      var alien = aliensArray[i]; //Select an individual alien

      if (shot.intersects(alien)) {
        shot.remove(); // Removes from the global project object
        array.splice(index, 1); // Removes the laser shot from the laserShots array
        alien.remove(); // TODO add a cool explosion

        score += 10;
        scoreDisplay.textContent = score;
      }
    }
  });
}

function onFrame(event) {
  // If a laser has been fired, animate it
  laserMove();
  isLaserHitting();
}



function setup(magnification) {
  // Adapted from Vladimir on Codepen.io
  // https://codepen.io/vherever/pen/Inyhm?editors=0010

  var canonPos = [view.size.width / 2, view.size.height * 0.9];

  // Change these  parameters
  if (!canon) {
    canon = drawShip(canonPos[0], canonPos[1], magnification);
  }




  for (var x = 40; x < 300; x += 45) {
    // and these  parameters
    aliens.addChild(drawLimeAlien(60 + x, 10, 2));
    aliens.addChild(drawBlueAlien(60 + x, 50, 2));
    aliens.addChild(drawRedAlien(60 + x, 90, 2));
    aliens.addChild(drawYellowAlien(60 + x, 130, 2));
  }

  ///////////////////////////////////////////////////////
  //
  // this function draws a ship
  //
  function drawShip(xPosition, yPosition, magnification) {
    var xPos = xPosition;
    var yPos = yPosition;
    var m = magnification;

    var ship = new Path();
    ship.fillColor = "deepSkyBlue";
    ship.add(new Point(0 * m + xPos, yPos + m * 7));
    ship.add(new Point(0 * m + xPos, yPos + m * 4));
    ship.add(new Point(1 * m + xPos, yPos + m * 4));
    ship.add(new Point(1 * m + xPos, yPos + m * 3));
    ship.add(new Point(5 * m + xPos, yPos + m * 3));
    ship.add(new Point(5 * m + xPos, yPos + m * 1));
    ship.add(new Point(6 * m + xPos, yPos + m * 1));
    ship.add(new Point(6 * m + xPos, yPos + m * 0));
    ship.add(new Point(7 * m + xPos, yPos + m * 0));
    ship.add(new Point(7 * m + xPos, yPos + m * 1));
    ship.add(new Point(8 * m + xPos, yPos + m * 1));
    ship.add(new Point(8 * m + xPos, yPos + m * 3));
    ship.add(new Point(12 * m + xPos, yPos + m * 3));
    ship.add(new Point(12 * m + xPos, yPos + m * 4));
    ship.add(new Point(13 * m + xPos, yPos + m * 4));
    ship.add(new Point(13 * m + xPos, yPos + m * 7));

    return ship;
  }

  ///////////////////////////////////////////////////////
  //
  // this function draws the lime alien
  //

  function drawLimeAlien(xPosition, yPosition, magnification) {
    var xPos = xPosition;
    var yPos = yPosition;
    var m = magnification;

    var alien = new Path();
    alien.fillColor = "lime";
    alien.add(new Point(0 * m + xPos, yPos + m * 5));
    alien.add(new Point(0 * m + xPos, yPos + m * 2));
    alien.add(new Point(1 * m + xPos, yPos + m * 2));
    alien.add(new Point(1 * m + xPos, yPos + m * 1));
    alien.add(new Point(4 * m + xPos, yPos + m * 1));
    alien.add(new Point(4 * m + xPos, yPos + m * 0));
    alien.add(new Point(7 * m + xPos, yPos + m * 0));
    alien.add(new Point(7 * m + xPos, yPos + m * 1));
    alien.add(new Point(10 * m + xPos, yPos + m * 1));
    alien.add(new Point(10 * m + xPos, yPos + m * 2));
    alien.add(new Point(11 * m + xPos, yPos + m * 2));
    alien.add(new Point(11 * m + xPos, yPos + m * 5));
    alien.add(new Point(8 * m + xPos, yPos + m * 5));
    alien.add(new Point(8 * m + xPos, yPos + m * 6));
    alien.add(new Point(9 * m + xPos, yPos + m * 6));
    alien.add(new Point(9 * m + xPos, yPos + m * 7));
    alien.add(new Point(11 * m + xPos, yPos + m * 7));
    alien.add(new Point(11 * m + xPos, yPos + m * 8));
    alien.add(new Point(9 * m + xPos, yPos + m * 8));
    alien.add(new Point(9 * m + xPos, yPos + m * 7));
    alien.add(new Point(7 * m + xPos, yPos + m * 7));
    alien.add(new Point(7 * m + xPos, yPos + m * 6));
    alien.add(new Point(6 * m + xPos, yPos + m * 6));
    alien.add(new Point(6 * m + xPos, yPos + m * 5));
    alien.add(new Point(5 * m + xPos, yPos + m * 5));
    alien.add(new Point(5 * m + xPos, yPos + m * 6));
    alien.add(new Point(6 * m + xPos, yPos + m * 6));
    alien.add(new Point(6 * m + xPos, yPos + m * 7));
    alien.add(new Point(5 * m + xPos, yPos + m * 7));
    alien.add(new Point(5 * m + xPos, yPos + m * 6));
    alien.add(new Point(4 * m + xPos, yPos + m * 6));
    alien.add(new Point(4 * m + xPos, yPos + m * 7));
    alien.add(new Point(2 * m + xPos, yPos + m * 7));
    alien.add(new Point(2 * m + xPos, yPos + m * 8));
    alien.add(new Point(0 * m + xPos, yPos + m * 8));
    alien.add(new Point(0 * m + xPos, yPos + m * 7));
    alien.add(new Point(2 * m + xPos, yPos + m * 7));
    alien.add(new Point(2 * m + xPos, yPos + m * 6));
    alien.add(new Point(3 * m + xPos, yPos + m * 6));
    alien.add(new Point(3 * m + xPos, yPos + m * 5));
    alien.add(new Point(0 * m + xPos, yPos + m * 5));

    var eyeL = new Path();
    eyeL.fillColor = "black";
    eyeL.add(new Point(3 * m + xPos, yPos + m * 3));
    eyeL.add(new Point(5 * m + xPos, yPos + m * 3));
    eyeL.add(new Point(5 * m + xPos, yPos + m * 4));
    eyeL.add(new Point(3 * m + xPos, yPos + m * 4));
    var eyeR = new Path();
    eyeR.fillColor = "black";
    eyeR.add(new Point(6 * m + xPos, yPos + m * 3));
    eyeR.add(new Point(8 * m + xPos, yPos + m * 3));
    eyeR.add(new Point(8 * m + xPos, yPos + m * 4));
    eyeR.add(new Point(6 * m + xPos, yPos + m * 4));

    return new Group(alien, eyeL, eyeR);
  }

  ///////////////////////////////////////////////////////
  //
  // this function draws the blue alien
  //
  function drawBlueAlien(xPosition, yPosition, magnification) {
    var xPos = xPosition;
    var yPos = yPosition;
    var m = magnification;

    var alien = new Path();
    alien.fillColor = "blue";
    alien.add(new Point(16 * m + xPos - 16 * m, yPos + m * 5));
    alien.add(new Point(16 * m + xPos - 16 * m, yPos + m * 3));
    alien.add(new Point(17 * m + xPos - 16 * m, yPos + m * 3));
    alien.add(new Point(17 * m + xPos - 16 * m, yPos + m * 2));
    alien.add(new Point(18 * m + xPos - 16 * m, yPos + m * 2));
    alien.add(new Point(18 * m + xPos - 16 * m, yPos + m * 1));
    alien.add(new Point(20 * m + xPos - 16 * m, yPos + m * 1));
    alien.add(new Point(20 * m + xPos - 16 * m, yPos + m * 0));
    alien.add(new Point(23 * m + xPos - 16 * m, yPos + m * 0));
    alien.add(new Point(23 * m + xPos - 16 * m, yPos + m * 1));
    alien.add(new Point(25 * m + xPos - 16 * m, yPos + m * 1));
    alien.add(new Point(25 * m + xPos - 16 * m, yPos + m * 2));
    alien.add(new Point(26 * m + xPos - 16 * m, yPos + m * 2));
    alien.add(new Point(26 * m + xPos - 16 * m, yPos + m * 3));
    alien.add(new Point(27 * m + xPos - 16 * m, yPos + m * 3));
    alien.add(new Point(27 * m + xPos - 16 * m, yPos + m * 5));
    alien.add(new Point(24 * m + xPos - 16 * m, yPos + m * 5));
    alien.add(new Point(24 * m + xPos - 16 * m, yPos + m * 6));
    alien.add(new Point(25 * m + xPos - 16 * m, yPos + m * 6));
    alien.add(new Point(25 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(26 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(26 * m + xPos - 16 * m, yPos + m * 8));
    alien.add(new Point(25 * m + xPos - 16 * m, yPos + m * 8));
    alien.add(new Point(25 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(24 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(24 * m + xPos - 16 * m, yPos + m * 8));
    alien.add(new Point(23 * m + xPos - 16 * m, yPos + m * 8));
    alien.add(new Point(23 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(24 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(24 * m + xPos - 16 * m, yPos + m * 6));
    alien.add(new Point(23 * m + xPos - 16 * m, yPos + m * 6));
    alien.add(new Point(23 * m + xPos - 16 * m, yPos + m * 5));
    alien.add(new Point(20 * m + xPos - 16 * m, yPos + m * 5));
    alien.add(new Point(20 * m + xPos - 16 * m, yPos + m * 6));
    alien.add(new Point(23 * m + xPos - 16 * m, yPos + m * 6));
    alien.add(new Point(23 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(20 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(20 * m + xPos - 16 * m, yPos + m * 6));
    alien.add(new Point(19 * m + xPos - 16 * m, yPos + m * 6));
    alien.add(new Point(19 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(20 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(20 * m + xPos - 16 * m, yPos + m * 8));
    alien.add(new Point(19 * m + xPos - 16 * m, yPos + m * 8));
    alien.add(new Point(19 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(18 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(18 * m + xPos - 16 * m, yPos + m * 8));
    alien.add(new Point(17 * m + xPos - 16 * m, yPos + m * 8));
    alien.add(new Point(17 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(18 * m + xPos - 16 * m, yPos + m * 7));
    alien.add(new Point(18 * m + xPos - 16 * m, yPos + m * 6));
    alien.add(new Point(19 * m + xPos - 16 * m, yPos + m * 6));
    alien.add(new Point(19 * m + xPos - 16 * m, yPos + m * 5));
    alien.add(new Point(16 * m + xPos - 16 * m, yPos + m * 5));

    var eyeL = new Path();
    eyeL.fillColor = "black";
    eyeL.add(new Point(19 * m + xPos - 16 * m, yPos + m * 3));
    eyeL.add(new Point(20 * m + xPos - 16 * m, yPos + m * 3));
    eyeL.add(new Point(20 * m + xPos - 16 * m, yPos + m * 4));
    eyeL.add(new Point(19 * m + xPos - 16 * m, yPos + m * 4));
    var eyeR = new Path();
    eyeR.fillColor = "black";
    eyeR.add(new Point(23 * m + xPos - 16 * m, yPos + m * 3));
    eyeR.add(new Point(24 * m + xPos - 16 * m, yPos + m * 3));
    eyeR.add(new Point(24 * m + xPos - 16 * m, yPos + m * 4));
    eyeR.add(new Point(23 * m + xPos - 16 * m, yPos + m * 4));

    return new Group(alien, eyeL, eyeR);
  }

  ///////////////////////////////////////////////////////
  //
  // this function draws the red alien
  //
  function drawRedAlien(xPosition, yPosition, magnification) {
    var xPos = xPosition;
    var yPos = yPosition;
    var m = magnification;

    var alien = new Path();
    alien.fillColor = "red";
    alien.add(new Point(0 * m + xPos, yPos - 13 * m + m * 20));
    alien.add(new Point(0 * m + xPos, yPos - 13 * m + m * 17));
    alien.add(new Point(1 * m + xPos, yPos - 13 * m + m * 17));
    alien.add(new Point(1 * m + xPos, yPos - 13 * m + m * 16));
    alien.add(new Point(2 * m + xPos, yPos - 13 * m + m * 16));
    alien.add(new Point(2 * m + xPos, yPos - 13 * m + m * 15));
    alien.add(new Point(3 * m + xPos, yPos - 13 * m + m * 15));
    alien.add(new Point(3 * m + xPos, yPos - 13 * m + m * 13));
    alien.add(new Point(2 * m + xPos, yPos - 13 * m + m * 13));
    alien.add(new Point(2 * m + xPos, yPos - 13 * m + m * 14));
    alien.add(new Point(4 * m + xPos, yPos - 13 * m + m * 14));
    alien.add(new Point(4 * m + xPos, yPos - 13 * m + m * 15));
    alien.add(new Point(7 * m + xPos, yPos - 13 * m + m * 15));
    alien.add(new Point(7 * m + xPos, yPos - 13 * m + m * 14));
    alien.add(new Point(9 * m + xPos, yPos - 13 * m + m * 14));
    alien.add(new Point(9 * m + xPos, yPos - 13 * m + m * 13));
    alien.add(new Point(8 * m + xPos, yPos - 13 * m + m * 13));
    alien.add(new Point(8 * m + xPos, yPos - 13 * m + m * 15));
    alien.add(new Point(9 * m + xPos, yPos - 13 * m + m * 15));
    alien.add(new Point(9 * m + xPos, yPos - 13 * m + m * 16));
    alien.add(new Point(10 * m + xPos, yPos - 13 * m + m * 16));
    alien.add(new Point(10 * m + xPos, yPos - 13 * m + m * 17));
    alien.add(new Point(11 * m + xPos, yPos - 13 * m + m * 17));
    alien.add(new Point(11 * m + xPos, yPos - 13 * m + m * 20));
    alien.add(new Point(10 * m + xPos, yPos - 13 * m + m * 20));
    alien.add(new Point(10 * m + xPos, yPos - 13 * m + m * 18));
    alien.add(new Point(9 * m + xPos, yPos - 13 * m + m * 18));
    alien.add(new Point(9 * m + xPos, yPos - 13 * m + m * 20));
    alien.add(new Point(6 * m + xPos, yPos - 13 * m + m * 20));
    alien.add(new Point(6 * m + xPos, yPos - 13 * m + m * 21));
    alien.add(new Point(8 * m + xPos, yPos - 13 * m + m * 21));
    alien.add(new Point(8 * m + xPos, yPos - 13 * m + m * 19));
    alien.add(new Point(3 * m + xPos, yPos - 13 * m + m * 19));
    alien.add(new Point(3 * m + xPos, yPos - 13 * m + m * 21));
    alien.add(new Point(5 * m + xPos, yPos - 13 * m + m * 21));
    alien.add(new Point(5 * m + xPos, yPos - 13 * m + m * 20));
    alien.add(new Point(2 * m + xPos, yPos - 13 * m + m * 20));
    alien.add(new Point(2 * m + xPos, yPos - 13 * m + m * 18));
    alien.add(new Point(1 * m + xPos, yPos - 13 * m + m * 18));
    alien.add(new Point(1 * m + xPos, yPos - 13 * m + m * 20));
    alien.add(new Point(0 * m + xPos, yPos - 13 * m + m * 20));

    var eyeL = new Path();
    eyeL.fillColor = "black";
    eyeL.add(new Point(3 * m + xPos, yPos - 13 * m + m * 16));
    eyeL.add(new Point(4 * m + xPos, yPos - 13 * m + m * 16));
    eyeL.add(new Point(4 * m + xPos, yPos - 13 * m + m * 17));
    eyeL.add(new Point(3 * m + xPos, yPos - 13 * m + m * 17));
    var eyeR = new Path();
    eyeR.fillColor = "black";
    eyeR.add(new Point(7 * m + xPos, yPos - 13 * m + m * 16));
    eyeR.add(new Point(8 * m + xPos, yPos - 13 * m + m * 16));
    eyeR.add(new Point(8 * m + xPos, yPos - 13 * m + m * 17));
    eyeR.add(new Point(7 * m + xPos, yPos - 13 * m + m * 17));

    return new Group(alien, eyeL, eyeR);
  }

  ///////////////////////////////////////////////////////
  //
  // this function draws the yellow alien
  //
  function drawYellowAlien(xPosition, yPosition, magnification) {
    var xPos = xPosition;
    var yPos = yPosition;
    var m = magnification;

    var alien = new Path();
    alien.fillColor = "yellow";
    alien.add(new Point(16 * m + xPos - 16 * m, yPos - 13 * m + m * 20));
    alien.add(new Point(16 * m + xPos - 16 * m, yPos - 13 * m + m * 14));
    alien.add(new Point(17 * m + xPos - 16 * m, yPos - 13 * m + m * 14));
    alien.add(new Point(17 * m + xPos - 16 * m, yPos - 13 * m + m * 16));
    alien.add(new Point(18 * m + xPos - 16 * m, yPos - 13 * m + m * 16));
    alien.add(new Point(18 * m + xPos - 16 * m, yPos - 13 * m + m * 15));
    alien.add(new Point(19 * m + xPos - 16 * m, yPos - 13 * m + m * 15));
    alien.add(new Point(19 * m + xPos - 16 * m, yPos - 13 * m + m * 13));
    alien.add(new Point(18 * m + xPos - 16 * m, yPos - 13 * m + m * 13));
    alien.add(new Point(18 * m + xPos - 16 * m, yPos - 13 * m + m * 14));
    alien.add(new Point(20 * m + xPos - 16 * m, yPos - 13 * m + m * 14));
    alien.add(new Point(20 * m + xPos - 16 * m, yPos - 13 * m + m * 15));
    alien.add(new Point(23 * m + xPos - 16 * m, yPos - 13 * m + m * 15));
    alien.add(new Point(23 * m + xPos - 16 * m, yPos - 13 * m + m * 14));
    alien.add(new Point(25 * m + xPos - 16 * m, yPos - 13 * m + m * 14));
    alien.add(new Point(25 * m + xPos - 16 * m, yPos - 13 * m + m * 13));
    alien.add(new Point(24 * m + xPos - 16 * m, yPos - 13 * m + m * 13));
    alien.add(new Point(24 * m + xPos - 16 * m, yPos - 13 * m + m * 15));
    alien.add(new Point(25 * m + xPos - 16 * m, yPos - 13 * m + m * 15));
    alien.add(new Point(25 * m + xPos - 16 * m, yPos - 13 * m + m * 16));
    alien.add(new Point(26 * m + xPos - 16 * m, yPos - 13 * m + m * 16));
    alien.add(new Point(26 * m + xPos - 16 * m, yPos - 13 * m + m * 14));
    alien.add(new Point(27 * m + xPos - 16 * m, yPos - 13 * m + m * 14));
    alien.add(new Point(27 * m + xPos - 16 * m, yPos - 13 * m + m * 18));
    alien.add(new Point(26 * m + xPos - 16 * m, yPos - 13 * m + m * 18));
    alien.add(new Point(26 * m + xPos - 16 * m, yPos - 13 * m + m * 19));
    alien.add(new Point(25 * m + xPos - 16 * m, yPos - 13 * m + m * 19));
    alien.add(new Point(25 * m + xPos - 16 * m, yPos - 13 * m + m * 21));
    alien.add(new Point(26 * m + xPos - 16 * m, yPos - 13 * m + m * 21));
    alien.add(new Point(26 * m + xPos - 16 * m, yPos - 13 * m + m * 20));
    alien.add(new Point(24 * m + xPos - 16 * m, yPos - 13 * m + m * 20));
    alien.add(new Point(24 * m + xPos - 16 * m, yPos - 13 * m + m * 19));
    alien.add(new Point(19 * m + xPos - 16 * m, yPos - 13 * m + m * 19));
    alien.add(new Point(19 * m + xPos - 16 * m, yPos - 13 * m + m * 20));
    alien.add(new Point(17 * m + xPos - 16 * m, yPos - 13 * m + m * 20));
    alien.add(new Point(17 * m + xPos - 16 * m, yPos - 13 * m + m * 21));
    alien.add(new Point(18 * m + xPos - 16 * m, yPos - 13 * m + m * 21));
    alien.add(new Point(18 * m + xPos - 16 * m, yPos - 13 * m + m * 19));
    alien.add(new Point(17 * m + xPos - 16 * m, yPos - 13 * m + m * 19));
    alien.add(new Point(17 * m + xPos - 16 * m, yPos - 13 * m + m * 18));
    alien.add(new Point(16 * m + xPos - 16 * m, yPos - 13 * m + m * 18));

    var eyeL = new Path();
    eyeL.fillColor = "black";
    eyeL.add(new Point(19 * m + xPos - 16 * m, yPos - 13 * m + m * 16));
    eyeL.add(new Point(20 * m + xPos - 16 * m, yPos - 13 * m + m * 16));
    eyeL.add(new Point(20 * m + xPos - 16 * m, yPos - 13 * m + m * 17));
    eyeL.add(new Point(19 * m + xPos - 16 * m, yPos - 13 * m + m * 17));
    var eyeR = new Path();
    eyeR.fillColor = "black";
    eyeR.add(new Point(23 * m + xPos - 16 * m, yPos - 13 * m + m * 16));
    eyeR.add(new Point(24 * m + xPos - 16 * m, yPos - 13 * m + m * 16));
    eyeR.add(new Point(24 * m + xPos - 16 * m, yPos - 13 * m + m * 17));
    eyeR.add(new Point(23 * m + xPos - 16 * m, yPos - 13 * m + m * 17));

    return new Group(alien, eyeL, eyeR);
  }
}
