// ==================================================
// SETTINGS
// ==================================================

const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const colours = [
  "#171717",
  "#174a7e",
  "#c62828",
  "#d4a017"
];

const fonts = [
  "Georgia",
  "Arial",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Trebuchet MS"
];

// 15 minutes in seconds
const TOTAL_TIME = 15 * 60;


// ==================================================
// HTML ELEMENTS
// ==================================================

const letter =
  document.getElementById("letter");

const poetryInput =
  document.getElementById("poetryInput");

const submitButton =
  document.getElementById("submitLine");

const message =
  document.getElementById("message");

const syllableDisplay =
  document.getElementById("syllables");

const lineInstruction =
  document.getElementById("lineInstruction");

const canvas =
  document.getElementById("canvas");

const ctx =
  canvas.getContext("2d");


// ==================================================
// VARIABLES
// ==================================================

let currentLetter = "";

let currentLine = 1;

// Timer
let timeLeft = TOTAL_TIME;

let timerInterval = null;

let artworkStarted = false;

let artworkExpired = false;

// Selected canvas position
let selectedX = null;

let selectedY = null;

// Whether the selected position is
// inside the secret timer area
let secretAreaSelected = false;

// Syllable targets
const targets = [];


// ==================================================
// CANVAS
// ==================================================

canvas.width = 1000;
canvas.height = 600;

// Canvas background
ctx.fillStyle =
  "#f7f3e9";

ctx.fillRect(
  0,
  0,
  canvas.width,
  canvas.height
);


// ==================================================
// RANDOM SYLLABLE TARGET
// ==================================================

function generateTarget() {

  return Math.floor(
    Math.random() * 13
  ) + 8;

}


// ==================================================
// FORMAT TIMER
// ==================================================

function formatTime(seconds) {

  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    seconds % 60;

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(remainingSeconds).padStart(2, "0")
  );

}


// ==================================================
// DRAW TIMER
// ==================================================

function drawTimer() {

  const timerText =
    formatTime(timeLeft);


  // ----------------------------------------------
  // TIMER POSITION
  // ----------------------------------------------

  const timerX =
    canvas.width - 30;

  const timerY =
    40;


  // ----------------------------------------------
  // CLEAR TIMER AREA
  // ----------------------------------------------

  ctx.save();

  ctx.fillStyle =
    "#f7f3e9";

  ctx.fillRect(
    canvas.width - 190,
    0,
    190,
    80
  );


  // ----------------------------------------------
  // TIMER TEXT
  // ----------------------------------------------

  ctx.font =
    "28px Arial";

  ctx.textAlign =
    "right";

  ctx.textBaseline =
    "middle";

  ctx.fillStyle =
    "#171717";

  ctx.fillText(
    timerText,
    timerX,
    timerY
  );

  ctx.restore();

}


// ==================================================
// START 15-MINUTE TIMER
// ==================================================

function startArtworkTimer() {

  // Don't start another timer
  if (artworkStarted) {
    return;
  }

  artworkStarted = true;

  artworkExpired = false;

  timerInterval =
    setInterval(
      function() {

        timeLeft--;

        drawTimer();


        // ----------------------------------------
        // TIME HAS RUN OUT
        // ----------------------------------------

        if (timeLeft <= 0) {

          timeLeft = 0;

          clearInterval(
            timerInterval
          );

          artworkExpired = true;

          drawTimer();

          message.textContent =
            "Time has run out.";

        }

      },
      1000
    );

}


// ==================================================
// RESET TIMER
// ==================================================

function resetArtworkTimer() {

  clearInterval(
    timerInterval
  );

  timeLeft =
    TOTAL_TIME;

  artworkStarted =
    true;

  artworkExpired =
    false;

  drawTimer();

  startArtworkTimer();

}


// ==================================================
// GENERATE RANDOM LETTER
// ==================================================

function generateLetter() {

  const number =
    Math.floor(
      Math.random() *
      alphabet.length
    );

  currentLetter =
    alphabet[number];


  // Generate new syllable target
  const target =
    generateTarget();


  targets[currentLine - 1] =
    target;


  // Update interface
  letter.textContent =
    currentLetter;


  lineInstruction.textContent =
    "Line " +
    currentLine +
    " — " +
    target +
    " syllables";


  syllableDisplay.textContent =
    "Syllables: 0 / " +
    target;


  // Clear previous writing
  poetryInput.value = "";


  // Clear selected position
  selectedX = null;

  selectedY = null;

  secretAreaSelected = false;

}


// ==================================================
// SYLLABLE COUNTING
// ==================================================

function countSyllables(word) {

  word =
    word.toLowerCase();


  word =
    word.replace(
      /[^a-z]/g,
      ""
    );


  if (
    word.length === 0
  ) {

    return 0;

  }


  if (
    word.length <= 3
  ) {

    return 1;

  }


  // Remove silent final e
  word =
    word.replace(
      /e$/,
      ""
    );


  const groups =
    word.match(
      /[aeiouy]+/g
    );


  if (!groups) {

    return 1;

  }


  return Math.max(
    1,
    groups.length
  );

}


// ==================================================
// COUNT WHOLE LINE
// ==================================================

function countLine(line) {

  if (
    line.trim() === ""
  ) {

    return 0;

  }


  const words =
    line
      .trim()
      .split(/\s+/);


  let total = 0;


  for (
    let word of words
  ) {

    total +=
      countSyllables(word);

  }


  return total;

}


// ==================================================
// LIVE SYLLABLE COUNTER
// ==================================================

poetryInput.addEventListener(
  "input",
  function() {

    const count =
      countLine(
        poetryInput.value
      );


    const target =
      targets[currentLine - 1];


    syllableDisplay.textContent =
      "Syllables: " +
      count +
      " / " +
      target;

  }
);


// ==================================================
// CANVAS CLICK
// ==================================================

canvas.addEventListener(
  "click",
  function(event) {

    const rect =
      canvas.getBoundingClientRect();


    // ----------------------------------------------
    // CONVERT SCREEN POSITION TO CANVAS POSITION
    // ----------------------------------------------

    selectedX =
      (
        event.clientX -
        rect.left
      ) *
      (
        canvas.width /
        rect.width
      );


    selectedY =
      (
        event.clientY -
        rect.top
      ) *
      (
        canvas.height /
        rect.height
      );


    // ----------------------------------------------
    // SECRET TIMER AREA
    // ----------------------------------------------

    const timerAreaLeft =
      canvas.width - 200;

    const timerAreaTop =
      0;

    const timerAreaRight =
      canvas.width;

    const timerAreaBottom =
      80;


    secretAreaSelected =
      selectedX >= timerAreaLeft &&
      selectedX <= timerAreaRight &&
      selectedY >= timerAreaTop &&
      selectedY <= timerAreaBottom;


    // ----------------------------------------------
    // MESSAGE
    // ----------------------------------------------

    if (
      artworkExpired &&
      secretAreaSelected
    ) {

      message.textContent =
        "The canvas is waiting.";

    } else {

      message.textContent =
        "Writing position selected. Write your line.";

    }


    // Put cursor into text box
    poetryInput.focus();

  }
);


// ==================================================
// SUBMIT LINE
// ==================================================

submitButton.addEventListener(
  "click",
  function() {

    const line =
      poetryInput.value.trim();


    const target =
      targets[currentLine - 1];


    // ==================================================
    // SECRET TIMER RESET
    // ==================================================

    const lowerCaseLine =
      line.toLowerCase();


    const containsClock =
      lowerCaseLine.includes(
        "clock"
      );


    const containsTime =
      lowerCaseLine.includes(
        "time"
      );


    if (
      secretAreaSelected &&
      (
        containsClock ||
        containsTime
      )
    ) {

      // Draw the secret line
      drawPoetry(
        line,
        selectedX,
        selectedY
      );


      // Reset timer to 15 minutes
      resetArtworkTimer();


      message.textContent =
        "15 minutes restored.";


      // Reset position
      selectedX = null;

      selectedY = null;

      secretAreaSelected = false;


      // Move to next line
      if (
        currentLine < 3
      ) {

        currentLine++;

      } else {

        currentLine = 1;

      }


      generateLetter();


      return;

    }


    // ==================================================
    // TIMER HAS EXPIRED
    // ==================================================

    if (
      artworkExpired
    ) {

      message.textContent =
        "Time has run out. Find another way.";

      return;

    }


    // ==================================================
    // CHECK CANVAS POSITION
    // ==================================================

    if (
      selectedX === null ||
      selectedY === null
    ) {

      message.textContent =
        "Click somewhere on the canvas first.";

      return;

    }


    // ==================================================
    // CHECK EMPTY LINE
    // ==================================================

    if (
      line === ""
    ) {

      message.textContent =
        "Write your line first.";

      return;

    }


    // ==================================================
    // CHECK FIRST LETTER
    // ==================================================

    if (
      line
        .charAt(0)
        .toUpperCase()
      !== currentLetter
    ) {

      message.textContent =
        "Your line must begin with " +
        currentLetter +
        ".";

      return;

    }


    // ==================================================
    // CHECK SYLLABLES
    // ==================================================

    const syllables =
      countLine(
        line
      );


    if (
      syllables !== target
    ) {

      message.textContent =
        "Your line has " +
        syllables +
        " syllables. It needs " +
        target +
        ".";

      return;

    }


    // ==================================================
    // SUCCESSFUL LINE
    // ==================================================

    drawPoetry(
      line,
      selectedX,
      selectedY
    );


    // ==================================================
    // START TIMER AFTER FIRST SUCCESSFUL LINE
    // ==================================================

    if (
      !artworkStarted
    ) {

      startArtworkTimer();

    }


    // ==================================================
    // RESET SELECTED POSITION
    // ==================================================

    selectedX = null;

    selectedY = null;

    secretAreaSelected = false;


    // ==================================================
    // MOVE TO NEXT LINE
    // ==================================================

    if (
      currentLine < 3
    ) {

      currentLine++;

      message.textContent =
        "Line complete. Choose another position.";

      generateLetter();

    } else {

      message.textContent =
        "Haiku complete.";

      currentLine = 1;

      generateLetter();

    }

  }
);


// ==================================================
// DRAW POETRY ON CANVAS
// ==================================================

function drawPoetry(
  text,
  x,
  y
) {

  ctx.save();


  const words =
    text
      .trim()
      .split(/\s+/);


  let currentX =
    x;

  let currentY =
    y;


  words.forEach(
    function(word) {

      // --------------------------------------------
      // RANDOM COLOUR
      // --------------------------------------------

      const randomColour =
        colours[
          Math.floor(
            Math.random() *
            colours.length
          )
        ];


      // --------------------------------------------
      // RANDOM FONT
      // --------------------------------------------

      const randomFont =
        fonts[
          Math.floor(
            Math.random() *
            fonts.length
          )
        ];


      // --------------------------------------------
      // RANDOM SIZE
      // --------------------------------------------

      let randomSize;


      // 8% chance of a huge word
      if (
        Math.random() <
        0.08
      ) {

        randomSize =
          Math.floor(
            Math.random() * 41
          ) + 60;

      } else {

        randomSize =
          Math.floor(
            Math.random() * 21
          ) + 16;

      }


      // --------------------------------------------
      // SET FONT
      // --------------------------------------------

      ctx.font =
        randomSize +
        "px " +
        randomFont;


      // --------------------------------------------
      // MEASURE WORD
      // --------------------------------------------

      const wordWidth =
        ctx.measureText(
          word
        ).width;


      // --------------------------------------------
      // WRAP TO NEXT LINE
      // --------------------------------------------

      if (
        currentX +
        wordWidth >
        canvas.width - 20
      ) {

        currentX =
          20;

        currentY +=
          randomSize + 15;

      }


      // --------------------------------------------
      // STOP IF WE REACH BOTTOM
      // --------------------------------------------

      if (
        currentY >
        canvas.height - 20
      ) {

        return;

      }


      // --------------------------------------------
      // DRAW WORD
      // --------------------------------------------

      ctx.fillStyle =
        randomColour;


      ctx.fillText(
        word,
        currentX,
        currentY
      );


      // --------------------------------------------
      // MOVE TO NEXT WORD
      // --------------------------------------------

      currentX +=
        wordWidth + 10;

    }
  );


  ctx.restore();

}


// ==================================================
// INITIALISE ARTWORK
// ==================================================

drawTimer();

generateLetter();