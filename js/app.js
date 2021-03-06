//Global selections and variables
const root = document.documentElement;
const containers = document.querySelectorAll(".colors");
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const undoBtn = document.querySelector(".undo");
const undoPanel = document.querySelector(".undo-panel");
const redoBtn = document.querySelector(".redo");
const redoPanel = document.querySelector(".redo-panel");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const controls = document.querySelectorAll(".controls");
const dragButton = document.querySelectorAll(".drag");
const adjustButton = document.querySelectorAll(".adjust");
const lockButton = document.querySelectorAll(".lock");
const closeAdjustments = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
let initialColors;

let savedPalettes = [];

//event listeners
generateBtn.addEventListener("click", generateColorScheme);
undoBtn.addEventListener("click", undoGenerate);
redoBtn.addEventListener("click", redoGenerate);
// window.addEventListener("keydown", function (e) {
//   if (e.keyCode === 32) {
//     generateColorScheme();
//     e.preventDefault();
//   }
// });
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index, e) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
  // div.addEventListener("click", () => {
  //   toggleLock(index);
  // });
});
currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});
popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popup.classList.remove("active");
  popupBox.classList.remove("active");
});
adjustButton.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    openAdjustmentPanel(index);
    e.stopPropagation();
  });
});
closeAdjustments.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    closeAdjustmentPanel(index);
    e.stopPropagation();
  });
});
lockButton.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    toggleLock(index);
    e.stopPropagation();
  });
});

// colorDivs.forEach((color) => {
//   color.addEventListener("dragstart", () => {
//     color.classList.add("dragging");
//   });

//   color.addEventListener("dragend", () => {
//     color.classList.remove("dragging");
//   });
// });

// containers.forEach((container) => {
//   container.addEventListener("dragover", (e) => {
//     e.preventDefault();
//     const afterElement = getDragAfterElement(container, e.clientX);
//     const color = document.querySelector(".dragging");
//     if (afterElement == null) {
//       container.appendChild(color);
//     } else {
//       container.insertBefore(color, afterElement);
//     }
//   });
// });

// function getDragAfterElement(container, x) {
//   const colorElements = [
//     ...container.querySelectorAll(".color:not(.dragging)"),
//   ];

//   return colorElements.reduce(
//     (closest, child) => {
//       const box = child.getBoundingClientRect();
//       const offset = x - box.left - box.width / 2;
//       if (offset < 0 && offset > closest.offset) {
//         return { offset: offset, element: child };
//       } else {
//         return closest;
//       }
//     },
//     { offset: Number.NEGATIVE_INFINITY }
//   ).element;
// }

// Functions ------------------------------------------------
function generateRandomColorHSL() {
  const H = chroma.random().hsl();
  return H;
}
function generateRandomColor() {
  const H = chroma.random().hex();
  return H;
}

function hexToHSL(H) {
  const HSLColor = chroma(H).hsl();
  const h = HSLColor[0];
  const s = HSLColor[1];
  const l = HSLColor[2];
  const a = HSLColor[3];
  const hslArray = [h, s, l, a];
  return hslArray;
}

//todo: change this functions name (hslArrayToHSL?)
function HSLToHex(hslArray) {
  const hexColor = chroma.hsl(hslArray[0], hslArray[1], hslArray[2]).hex();
  // const hexColor = chroma.hsl(hslArray[0], hslArray[1], hslArray[2]).hsl();
  return hexColor;
}

let complimentaryColor = false;
let monochromaticColor = false;
let analogousColor = false;
let splitComplimentaryColor = false;
let triadicColor = false;
let tetradicColor = false;
function randomColorSchemeType() {
  randNo = Math.floor(Math.random() * 6) + 1;
  complimentaryColor = false;
  monochromaticColor = false;
  analogousColor = false;
  splitComplimentaryColor = false;
  triadicColor = false;
  tetradicColor = false;
  switch (randNo) {
    case 1:
      complimentaryColor = true;
      break;
    case 2:
      monochromaticColor = true;
      break;
    case 3:
      analogousColor = true;
      break;
    case 4:
      splitComplimentaryColor = true;
      break;
    case 5:
      triadicColor = true;
      break;
    case 6:
      tetradicColor = true;
      break;
    default:
      monochromaticColor = true;
  }
}

function randDecimal() {
  const randNo = Math.random() * 0.5;
  return randNo;
}

function setWebTemplateColors() {
  boxShadowColors = [];
  boxShadowLight = chroma(initialColors[0]).darken(0.3).hex();
  boxShadowDark = chroma(initialColors[0]).darken(0.8).hex();
  boxShadowColors.push(boxShadowDark);
  boxShadowColors.push(boxShadowLight);
  root.style.setProperty("--boxShadow1", boxShadowColors[0]);
  root.style.setProperty("--boxShadow2", boxShadowColors[1]);
  if (complimentaryColor) {
    root.style.setProperty("--primaryColor", initialColors[0]);
    root.style.setProperty("--secondaryColor", initialColors[4]);
    root.style.setProperty("--accentColor", initialColors[3]);
    root.style.setProperty("--accentColor2", initialColors[3]);
    root.style.setProperty("--accentColor3", initialColors[1]);
  } else if (monochromaticColor) {
    root.style.setProperty("--primaryColor", initialColors[0]);
    root.style.setProperty("--secondaryColor", initialColors[1]);
    root.style.setProperty("--accentColor", initialColors[3]);
    root.style.setProperty("--accentColor2", initialColors[2]);
    root.style.setProperty("--accentColor3", initialColors[2]);
  } else if (analogousColor) {
    root.style.setProperty("--primaryColor", initialColors[0]);
    root.style.setProperty("--secondaryColor", initialColors[4]);
    root.style.setProperty("--accentColor", initialColors[3]);
    root.style.setProperty("--accentColor2", initialColors[3]);
    root.style.setProperty("--accentColor3", initialColors[0]);
  } else if (splitComplimentaryColor) {
    root.style.setProperty("--primaryColor", initialColors[0]);
    root.style.setProperty("--secondaryColor", initialColors[4]);
    root.style.setProperty("--accentColor", initialColors[3]);
    root.style.setProperty("--accentColor2", initialColors[3]);
    root.style.setProperty("--accentColor3", initialColors[0]);
  } else if (triadicColor) {
    root.style.setProperty("--primaryColor", initialColors[0]);
    root.style.setProperty("--secondaryColor", initialColors[4]);
    root.style.setProperty("--accentColor", initialColors[3]);
    root.style.setProperty("--accentColor2", initialColors[3]);
    root.style.setProperty("--accentColor3", initialColors[0]);
  } else if (tetradicColor) {
    root.style.setProperty("--primaryColor", initialColors[0]);
    root.style.setProperty("--secondaryColor", initialColors[4]);
    root.style.setProperty("--accentColor", initialColors[3]);
    root.style.setProperty("--accentColor2", initialColors[3]);
    root.style.setProperty("--accentColor3", initialColors[0]);
  }
}

function generateAccent(NoAccents, colorLocation, array) {
  const numberOfAccents = NoAccents;
  for (i = 0; i < numberOfAccents; i++) {
    chooseColor = colorLocation;
    RandRandNo = Math.random() * 3;
    saturationRandNo = Math.random() * 1;
    darkenRandNo = Math.random() * 3.5;
    arrayHex = HSLToHex(array);
    accentColor = arrayHex;
    const lum = chroma(accentColor).luminance();
    if (lum >= 0.8 && lum < 1) {
      accentColorSaturation = chroma(accentColor)
        .desaturate(saturationRandNo)
        .darken(darkenRandNo)
        .hex();
    } else if (lum >= 0.5 && lum < 0.8) {
      accentColorSaturation = chroma(accentColor)
        .desaturate(saturationRandNo)
        .darken(darkenRandNo)
        .hex();
    } else if (lum >= 0.3 && lum < 0.5) {
      accentColorSaturation = chroma(accentColor)
        .saturate(saturationRandNo)
        .brighten(darkenRandNo)
        .hex();
    } else {
      accentColorSaturation = chroma(accentColor)
        .saturate(saturationRandNo)
        .brighten(darkenRandNo)
        .hex();
    }
    accentColors2.push(accentColorSaturation);
  }
}

// !move these arrays up top later?
let history = [];
function ColorHSL(hue, saturation, lightness, luminance) {
  this.hue = hue;
  this.saturation = saturation;
  this.lightness = lightness;
  this.luminance = luminance;
}
let sortableColors = [];
let sortedHex = [];
function sortColors() {
  if (fourthColor.length > 0) {
    primaryColors = [
      ...mainColor,
      ...secondColor,
      ...thirdColor,
      ...fourthColor,
    ];
  } else if (thirdColor.length > 0) {
    primaryColors = [...mainColor, ...secondColor, ...thirdColor];
  } else {
    primaryColors = [...mainColor, ...secondColor];
  }
  sortTheseHexColors = [...primaryColors, ...accentColors2];
  for (let i = 0; i < sortTheseHexColors.length; i++) {
    const lum = chroma(sortTheseHexColors[i]).luminance();
    const hexConvertedToHSL = hexToHSL(sortTheseHexColors[i]);
    sortableColors.push(
      new ColorHSL(
        hexConvertedToHSL[0],
        hexConvertedToHSL[1],
        hexConvertedToHSL[2],
        lum
      )
    );
  }
  sortTheseColors = [...sortableColors];
  if (complimentaryColor) {
    const compSort = [...sortTheseColors];
    const primaryColors = [compSort[0], compSort[2], compSort[3]];
    const secondaryColors = [compSort[1], compSort[4]];
    primaryColors.sort((a, b) => a.luminance - b.luminance);
    secondaryColors.sort((a, b) => b.luminance - a.luminance);
    sortTheseColors = [...primaryColors, ...secondaryColors];
  } else if (monochromaticColor) {
    sortTheseColors.sort((a, b) => a.luminance - b.luminance);
  } else if (analogousColor) {
    analogousSort = [...sortTheseColors];
    firstColor = [analogousSort[0], analogousSort[3]];
    secondColor = [analogousSort[1]];
    thirdColor = [analogousSort[2], analogousSort[4]];
    firstColor.sort((a, b) => a.luminance - b.luminance);
    thirdColor.sort((a, b) => b.luminance - a.luminance);
    sortTheseColors = [...firstColor, ...secondColor, ...thirdColor];
  } else if (splitComplimentaryColor) {
    splitSort = [...sortTheseColors];
    firstColor = [splitSort[1], splitSort[3]];
    secondColor = [splitSort[0]];
    thirdColor = [splitSort[2], splitSort[4]];
    firstColor.sort((a, b) => a.luminance - b.luminance);
    thirdColor.sort((a, b) => b.luminance - a.luminance);
    sortTheseColors = [...firstColor, ...secondColor, ...thirdColor];
  } else if (triadicColor) {
    triSort = [...sortTheseColors];
    firstColor = [triSort[1], triSort[3]];
    secondColor = [triSort[0]];
    thirdColor = [triSort[2], triSort[4]];
    firstColor.sort((a, b) => a.luminance - b.luminance);
    thirdColor.sort((a, b) => b.luminance - a.luminance);
    sortTheseColors = [...firstColor, ...secondColor, ...thirdColor];
  }
  for (let i = 0; i < sortTheseHexColors.length; i++) {
    const hexColor = chroma
      .hsl(
        sortTheseColors[i].hue,
        sortTheseColors[i].saturation,
        sortTheseColors[i].lightness
      )
      .hex();
    sortedHex.push(hexColor);
  }
  finalColors = [...sortedHex];
  sortableColors = [];
  sortedHex = [];
}

let lockedColors = [];
let prevLockedColors = [];
function currentColors() {
  initialColors = [...finalColors];
  for (let i = 0; i < prevLockedColors.length; i++) {
    indexed = initialColors.indexOf(prevLockedColors[i]);
    if (indexed != -1) {
      initialColors.splice(indexed, 1);
    }
  }
  indexed = -1;
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    if (div.classList.contains("locked")) {
      initialColors.splice(index, 0, hexText.innerText);
    }
  });
  if (undoButtonCount3 > 0) {
    int = int + 5;
  }
  undoButtonCount3 = 0;

  for (let i = 0; i < 5; i++) {
    history[int] = initialColors[i];
    int++;
  }
  prevLockedColors = [];
}

function updateUI() {
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    div.style.backgroundColor = initialColors[index];
    hexText.innerText = initialColors[index];
    checkContrast(initialColors[index], hexText);
    const color = chroma(initialColors[index]);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSliders(color, hue, brightness, saturation);
  });
  resetInputs();
  adjustButton.forEach((button, index) => {
    checkContrast(initialColors[index], button);
    checkContrast(initialColors[index], lockButton[index]);
  });
  setWebTemplateColors();
}

let undoButtonCount = 0;
let undoButtonCount2 = 0;
let undoButtonCount3 = 0;
let int = 0;
let int2 = 0;
function undoGenerate() {
  undoButtonCount++;
  undoButtonCount2++;
  undoButtonCount3++;
  redoBtn.classList.add("active");
  if (undoButtonCount === 1) {
    int = int - 10;
    redoButtonCount = 0;
    generateButtonCount = 1;
  } else {
    int = int - 5;
  }
  int2 = int;
  for (let i = 0; i < 5; i++) {
    initialColors[i] = history[int2];
    int2++;
  }
  updateUI();
  if (int === 0) {
    undoBtn.classList.remove("active");
  }
}

let redoButtonCount = 0;
let redoButtonCountMax = 0;
function redoGenerate() {
  initialColors = [];
  redoButtonCount++;
  undoButtonCount3 = 0;
  if (redoButtonCount === 1) {
    int = int2;
    redoButtonCountMax = undoButtonCount;
    undoButtonCount = 0;
  }
  for (let i = 0; i < 5; i++) {
    initialColors.push(history[int]);
    int++;
  }
  updateUI();
  if (!undoBtn.classList.contains("active")) {
    undoBtn.classList.add("active");
  }
  if (redoButtonCount === redoButtonCountMax) {
    redoBtn.classList.remove("active");
  }
}

lockedColorsObjects = [];
function findPrimaryColors() {
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    if (div.classList.contains("locked")) {
      lockedColors.push(hexText.innerText);
    }
  });
  for (let i = 0; i < lockedColors.length; i++) {
    const lum = chroma(lockedColors[i]).luminance();
    const hsl = chroma(lockedColors[i]).hsl();
    lockedColorsObjects.push(new ColorHSL(hsl[0], hsl[1], hsl[2], lum));
  }
  prevLockedColors = [...lockedColors];
  prevLockedColors = prevLockedColors.map(function (x) {
    return x.toLowerCase();
  });
  lockedColors = [];
}

mainColorArray = [];
generateButtonCount = 0;
function generateColorScheme() {
  findPrimaryColors();
  generateButtonCount++;
  initialColors = [];
  mainColors = [];
  accentColors = [];
  accentColors2 = [];
  colorLuminance = [];
  undoButtonCount = 0;
  redoButtonCount = 0;
  redoBtn.classList.remove("active");
  if (generateButtonCount == 2) {
    undoBtn.classList.add("active");
  }
  randomColorSchemeType();
  mainColorArray = [];
  if (lockedColorsObjects.length > 0) {
    for (let i = 0; i < lockedColorsObjects.length; i++) {
      mainColorArray = [
        lockedColorsObjects[i].hue,
        lockedColorsObjects[i].saturation,
        lockedColorsObjects[i].lightness,
      ];
    }
  } else {
    mainColorArray = generateRandomColorHSL();
  }
  lockedColorsObjects = [];
  let h1;
  let s1;
  let l1;
  let h2;
  let s2;
  let l2;
  let h3;
  let s3;
  let l3;
  // let hslString1;
  // let hslString2;
  // let hslString3;
  const a = 1;
  primaryColors = [];
  h1Array = [];
  h2Array = [];
  h3Array = [];
  h1Color = [];
  mainColor = [HSLToHex(mainColorArray)];
  secondColor = [];
  thirdColor = [];
  fourthColor = [];
  accentColors = [];
  if (complimentaryColor) {
    const primaryColorLocation = 0;
    const numberOfPrimaryAccents = 2;
    const numberOfSecondaryAccents = 1;
    generateAccent(
      numberOfPrimaryAccents,
      primaryColorLocation,
      mainColorArray
    );
    if (mainColorArray[0] <= 180) {
      h1 = mainColorArray[0] + 180;
    } else {
      h1 = Math.abs(mainColorArray[0] + 180 - 360);
    }
    s1 = Math.abs(mainColorArray[1] - randDecimal() * 0.05);
    l1 = Math.abs(mainColorArray[2] - randDecimal() * 0.05);
    // hslString1 = "hsl(" + h1 + "," + s1 * 100 + "%," + l1 * 100 + "%)";
    h1Array.push(h1, s1, l1, a);
    secondColorArray = h1Array;
    secondColor = [HSLToHex(h1Array)];
    generateAccent(
      numberOfSecondaryAccents,
      primaryColorLocation,
      secondColorArray
    );
    sortColors();
  } else if (monochromaticColor) {
    const primaryColorLocation = 0;
    const numberOfPrimaryAccents = 4;
    const numberOfSecondaryAccents = 0;
    generateAccent(
      numberOfPrimaryAccents,
      primaryColorLocation,
      mainColorArray
    );
    sortColors();
  } else if (analogousColor) {
    const primaryColorLocation = 0;
    const numberOfPrimaryAccents = 1;
    const numberOfSecondaryAccents = 1;
    generateAccent(
      numberOfPrimaryAccents,
      primaryColorLocation,
      mainColorArray
    );
    if (mainColorArray[0] <= 300) {
      h1 = mainColorArray[0] + 60;
    } else {
      h1 = Math.abs(mainColorArray[0] + 60 - 360);
    }
    s1 = Math.abs(mainColorArray[1] - randDecimal() * 0.05);
    l1 = Math.abs(mainColorArray[2] - randDecimal() * 0.05);
    if (mainColorArray[0] <= 240) {
      h2 = mainColorArray[0] + 120;
    } else {
      h2 = Math.abs(mainColorArray[0] + 120 - 360);
    }
    s2 = Math.abs(mainColorArray[1] - randDecimal() * 0.05);
    l2 = Math.abs(mainColorArray[2] - randDecimal() * 0.05);
    h1Array = [h1, s1, l1, a];
    h2Array = [h2, s2, l2, a];
    secondColorArray = h1Array;
    thirdColorArray = h2Array;
    secondColor = [HSLToHex(h1Array)];
    thirdColor = [HSLToHex(h2Array)];
    generateAccent(
      numberOfSecondaryAccents,
      primaryColorLocation,
      thirdColorArray
    );
    sortColors();
  } else if (splitComplimentaryColor) {
    const primaryColorLocation = 0;
    const numberOfSecondaryAccents = 1;
    if (mainColorArray[0] <= 210) {
      h1 = mainColorArray[0] + 150;
    } else {
      h1 = Math.abs(mainColorArray[0] + 150 - 360);
    }
    s1 = Math.abs(mainColorArray[1] - randDecimal() * 0.05);
    l1 = Math.abs(mainColorArray[2] - randDecimal() * 0.05);
    if (mainColorArray[0] <= 150) {
      h2 = mainColorArray[0] + 210;
    } else {
      h2 = Math.abs(mainColorArray[0] + 210 - 360);
    }
    s2 = Math.abs(mainColorArray[1] - randDecimal() * 0.05);
    l2 = Math.abs(mainColorArray[2] - randDecimal() * 0.05);
    h1Array = [h1, s1, l1, a];
    h2Array = [h2, s2, l2, a];
    secondColorArray = h1Array;
    thirdColorArray = h2Array;
    secondColor = [HSLToHex(h1Array)];
    thirdColor = [HSLToHex(h2Array)];
    generateAccent(
      numberOfSecondaryAccents,
      primaryColorLocation,
      secondColorArray
    );
    generateAccent(
      numberOfSecondaryAccents,
      primaryColorLocation,
      thirdColorArray
    );
    sortColors();
  } else if (triadicColor) {
    const primaryColorLocation = 0;
    const numberOfSecondaryAccents = 1;
    if (mainColorArray[0] <= 240) {
      h1 = mainColorArray[0] + 120;
    } else {
      h1 = Math.abs(mainColorArray[0] + 120 - 360);
    }
    s1 = Math.abs(mainColorArray[1] - randDecimal() * 0.05);
    l1 = Math.abs(mainColorArray[2] - randDecimal() * 0.05);
    if (mainColorArray[0] <= 120) {
      h2 = mainColorArray[0] + 240;
    } else {
      h2 = Math.abs(mainColorArray[0] + 240 - 360);
    }
    s2 = Math.abs(mainColorArray[1] - randDecimal() * 0.05);
    l2 = Math.abs(mainColorArray[2] - randDecimal() * 0.05);
    h1Array = [h1, s1, l1, a];
    h2Array = [h2, s2, l2, a];
    secondColorArray = h1Array;
    thirdColorArray = h2Array;
    secondColor = [HSLToHex(h1Array)];
    thirdColor = [HSLToHex(h2Array)];
    generateAccent(
      numberOfSecondaryAccents,
      primaryColorLocation,
      secondColorArray
    );
    generateAccent(
      numberOfSecondaryAccents,
      primaryColorLocation,
      thirdColorArray
    );
    sortColors();
  } else if (tetradicColor) {
    const primaryColorLocation = 0;
    const numberOfPrimaryAccents = 1;
    generateAccent(
      numberOfPrimaryAccents,
      primaryColorLocation,
      mainColorArray
    );
    if (mainColorArray[0] <= 270) {
      h1 = mainColorArray[0] + 90;
    } else {
      h1 = Math.abs(mainColorArray[0] + 90 - 360);
    }
    s1 = Math.abs(mainColorArray[1] - randDecimal() * 0.05);
    l1 = Math.abs(mainColorArray[2] - randDecimal() * 0.05);
    if (mainColorArray[0] <= 180) {
      h2 = mainColorArray[0] + 180;
    } else {
      h2 = Math.abs(mainColorArray[0] + 180 - 360);
    }
    s2 = Math.abs(mainColorArray[1] - randDecimal() * 0.05);
    l2 = Math.abs(mainColorArray[2] - randDecimal() * 0.05);
    if (mainColorArray[0] <= 90) {
      h2 = mainColorArray[0] + 270;
    } else {
      h2 = Math.abs(mainColorArray[0] + 270 - 360);
    }
    s3 = Math.abs(mainColorArray[1] - randDecimal() * 0.05);
    l3 = Math.abs(mainColorArray[2] - randDecimal() * 0.05);
    h1Array = [h1, s1, l1, a];
    h2Array = [h2, s2, l2, a];
    h3Array = [h3, s3, l3, a];
    secondColorArray = h1Array;
    thirdColorArray = h2Array;
    fourthColorArray = h3Array;
    secondColor = [HSLToHex(h1Array)];
    thirdColor = [HSLToHex(h2Array)];
    fourthColor = [HSLToHex(h3Array)];
    sortColors();
  }
  currentColors();
  updateUI();
}

function checkContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "rgb(30,30,30)";
  } else {
    text.style.color = "rgb(220,220,220)";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  const minSat = color.set("hsl.s", 0);
  const maxSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([minSat, color, maxSat]);
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )}, ${scaleSat(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
    0
  )}, ${scaleBright(0.5)},${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75),rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue");
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];
  const bgColor = initialColors[index];
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);
  colorDivs[index].style.backgroundColor = color;
  colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  textHex.innerText = color.hex();
  checkContrast(color, textHex);
  for (icon of icons) {
    checkContrast(color, icon);
  }
}

function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

function copyToClipboard(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  //popup animation
  const popupBox = popup.children[0];
  popup.classList.add("active");
  popupBox.classList.add("active");
}

function openAdjustmentPanel(index) {
  controls[index].children[0].classList.toggle("active");
  sliderContainers[index].classList.toggle("active");
}

function closeAdjustmentPanel(index) {
  controls[index].children[0].classList.toggle("active");
  sliderContainers[index].classList.remove("active");
}

function toggleLock(index) {
  const currentBg = colorDivs[index];
  const lockSVG = lockButton[index].children[0];
  const locker = lockButton[index];
  currentBg.classList.toggle("locked");
  locker.classList.toggle("active");
  if (lockSVG.classList.contains("fa-lock-open")) {
    lockSVG.classList.add("fa-lock");
  } else {
    lockSVG.classList.add("fa-lock-open");
  }
}

//implement save to palette and local storage stuff
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");

//event listeners
saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);

//functions
function openPalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
}

function closePalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}

function savePalette(e) {
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
  const name = saveInput.value;
  const colors = [];
  currentHexes.forEach((hex) => {
    colors.push(hex.innerText);
  });
  //generate object
  let paletteNr;
  const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
  if (paletteObjects) {
    paletteNr = paletteObjects.length;
  } else {
    paletteNr = savedPalettes.length;
  }
  const paletteObj = { name, colors, nr: paletteNr };
  savedPalettes.push(paletteObj);
  // save to local storage
  savetoLocal(paletteObj);
  saveInput.value = "";
  //generate the palette for library
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");
  const title = document.createElement("h4");
  title.innerText = paletteObj.name;
  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  paletteObj.colors.forEach((smallColor) => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = smallColor;
    preview.appendChild(smallDiv);
  });
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(paletteObj.nr);
  paletteBtn.innerText = "select";
  //attachevent to the select button
  paletteBtn.addEventListener("click", (e) => {
    closeLibrary();
    const paletteIndex = e.target.classList[1];
    initialColors = [];
    savedPalettes[paletteIndex].colors.forEach((color, index) => {
      initialColors.push(color);
      colorDivs[index].style.backgroundColor = color;
      const text = colorDivs[index].children[0];
      checkContrast(color, text);
      updateTextUI(index);
    });
    resetInputs();
  });
  //append to library
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);
  libraryContainer.children[0].appendChild(palette);
}

function savetoLocal(paletteObj) {
  let localPalettes;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalettes.push(paletteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function openLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
}

function closeLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
}

function getLocal() {
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    savedPalettes = [...paletteObjects];
    paletteObjects.forEach((paletteObj) => {
      //generate the palette for library
      const palette = document.createElement("div");
      palette.classList.add("custom-palette");
      const title = document.createElement("h4");
      title.innerText = paletteObj.name;
      const preview = document.createElement("div");
      preview.classList.add("small-preview");
      paletteObj.colors.forEach((smallColor) => {
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
      });
      const paletteBtn = document.createElement("button");
      paletteBtn.classList.add("pick-palette-btn");
      paletteBtn.classList.add(paletteObj.nr);
      paletteBtn.innerText = "select";
      //attachevent to the select button
      paletteBtn.addEventListener("click", (e) => {
        closeLibrary();
        const paletteIndex = e.target.classList[1];
        initialColors = [];
        paletteObjects[paletteIndex].colors.forEach((color, index) => {
          initialColors.push(color);
          colorDivs[index].style.backgroundColor = color;
          const text = colorDivs[index].children[0];
          checkContrast(color, text);
          updateTextUI(index);
        });
        resetInputs();
      });
      //append to library
      palette.appendChild(title);
      palette.appendChild(preview);
      palette.appendChild(paletteBtn);
      libraryContainer.children[0].appendChild(palette);
    });
  }
}

//For webpage example---------------------------------------------------------------
var container = document.getElementById("landingContainer");
window.onmousemove = function (e) {
  var x = -e.clientX / 5,
    y = -e.clientY / 5;
  container.style.backgroundPositionX = x + "px";
  container.style.backgroundPositionY = y + "px";
};

document.addEventListener("mousemove", parallax);
function parallax(f) {
  this.querySelectorAll(".parallaxClass").forEach((Layer) => {
    let x = (window.innerWidth - f.pageX * -2) / 100;
    let y = (window.innerHeight - f.pageY * -2) / 100;
    Layer.style.transform = `translate(${x}px,${y}px)`;
  });
}

window.onload = function () {
  document.getElementById("loader-wrapper").style.display = "none";
  document.body.classList.remove("stop-scrolling");
};

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  if (document.body.classList.contains("stop-scrolling") == false) {
    document.body.classList.add("stop-scrolling");
  } else {
    document.body.classList.remove("stop-scrolling");
  }
  links.forEach((link) => {
    link.classList.toggle("fade");
  });
});

//--Function initialization ------------------------------------------------
function init() {
  getLocal();
  generateColorScheme();
}

init();
