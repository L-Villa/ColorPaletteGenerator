//Global selections and variables
const root = document.documentElement;
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const controls = document.querySelectorAll(".controls");
const adjustButton = document.querySelectorAll(".adjust");
const lockButton = document.querySelectorAll(".lock");
const closeAdjustments = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
let initialColors;

//This is for local storage
let savedPalettes = [];

//event listeners
//todo: remove the generate button. Only use space to generate so that it doesnt mess things up
generateBtn.addEventListener("click", generateColorScheme);
window.addEventListener("keydown", function (e) {
  if (e.keyCode === 32) {
    generateColorScheme();
    e.preventDefault();
  }
});
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index, e) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
  div.addEventListener("click", () => {
    toggleLock(index);
  });
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
// lockButton.forEach((button, index) => {
//   button.addEventListener('click', (e) => {
//     toggleLock(index);
//     e.stopPropagation();
//   })
// })

// Functions ------------------------------------------------
//!So i can just generate random colors straight to hsl. Only convert to Hex for the HexText?
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
  const hslArray = [h, s, l];
  return hslArray;
}

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
  // randNo = Math.floor(Math.random() * 6) + 1;
  randNo = Math.floor(Math.random() * 6) + 1;
  complimentaryColor = false;
  monochromaticColor = false;
  analogousColor = false;
  splitComplimentaryColor = false;
  triadicColor = false;
  tetradicColor = false;
  switch (3) {
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

//todo: work on this function. Try sorting colors so that dark are primary?
//todo: also, try to make another webpage that uses more colors so that tetradic doesnt look bad?
function setWebTemplateColors() {
  boxShadowColors = [];
  boxShadowLight = chroma(finalColors[0]).darken(0.3).hex();
  boxShadowDark = chroma(finalColors[0]).darken(0.8).hex();
  boxShadowColors.push(boxShadowDark);
  boxShadowColors.push(boxShadowLight);
  root.style.setProperty("--boxShadow1", boxShadowColors[0]);
  root.style.setProperty("--boxShadow2", boxShadowColors[1]);

  if (complimentaryColor) {
    root.style.setProperty("--primaryColor", finalColors[0]);
    root.style.setProperty("--secondaryColor", finalColors[4]);
    root.style.setProperty("--accentColor", finalColors[3]);
    root.style.setProperty("--accentColor2", finalColors[3]);
    root.style.setProperty("--accentColor3", finalColors[1]);
  } else if (monochromaticColor) {
    root.style.setProperty("--primaryColor", finalColors[0]);
    root.style.setProperty("--secondaryColor", finalColors[1]);
    root.style.setProperty("--accentColor", finalColors[3]);
    root.style.setProperty("--accentColor2", finalColors[2]);
    root.style.setProperty("--accentColor3", finalColors[2]);
  } else if (analogousColor) {
    root.style.setProperty("--primaryColor", finalColors[0]);
    root.style.setProperty("--secondaryColor", finalColors[4]);
    root.style.setProperty("--accentColor", finalColors[3]);
    root.style.setProperty("--accentColor2", finalColors[3]);
    root.style.setProperty("--accentColor3", finalColors[0]);
  }
}

// function createAccentColors() {
//   const numberOfColors = primaryColors.length;
//   const numberOfAccents = 5 - numberOfColors;
//   for (i = 0; i < numberOfAccents; i++) {
//     chooseColor = Math.floor(Math.random() * numberOfColors);
//     saturationRandNo = Math.random() * 2;
//     darkenRandNo = Math.random() * 3;
//     accentColor = primaryColors[chooseColor];
//     const lum = chroma(accentColor).luminance();
//     if (lum >= 0.8 && lum < 1) {
//       accentColorSaturation = chroma(accentColor)
//         .desaturate(saturationRandNo)
//         .darken(darkenRandNo)
//         .hex();
//     } else if (lum >= 0.5 && lum < 0.8) {
//       accentColorSaturation = chroma(accentColor)
//         .desaturate(saturationRandNo)
//         .darken(darkenRandNo)
//         .hex();
//     } else if (lum >= 0.3 && lum < 0.5) {
//       accentColorSaturation = chroma(accentColor)
//         .saturate(saturationRandNo)
//         .brighten(darkenRandNo)
//         .hex();
//     } else {
//       accentColorSaturation = chroma(accentColor)
//         .saturate(saturationRandNo)
//         .brighten(darkenRandNo)
//         .hex();
//     }
//     accentColors.push(accentColorSaturation);
//   }
// }

function generateAccent(NoAccents, colorLocation, array) {
  const numberOfAccents = NoAccents;
  for (i = 0; i < numberOfAccents; i++) {
    chooseColor = colorLocation;
    saturationRandNo = Math.random() * 3;
    darkenRandNo = Math.random() * 4;
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
    console.log("comp is not issue");
  } else if (monochromaticColor) {
    sortTheseColors.sort((a, b) => a.luminance - b.luminance);
    console.log("mono is not issue");
  } else if (analogousColor) {
    anaSort = [...sortTheseColors];
    firstColor = [anaSort[0], anaSort[3]];
    secondColor = [anaSort[1]];
    thirdColor = [anaSort[2], anaSort[4]];
    firstColor.sort((a, b) => a.luminance - b.luminance);
    thirdColor.sort((a, b) => b.luminance - a.luminance);
    sortTheseColors = [...firstColor, ...secondColor, ...thirdColor];
    console.log("analagous is not issue");
  } else if (splitComplimentaryColor) {
    splitSort = [...sortTheseColors];
    firstColor = [splitSort[1], splitSort[3]];
    secondColor = [splitSort[0]];
    thirdColor = [splitSort[2], splitSort[4]];
    firstColor.sort((a, b) => a.luminance - b.luminance);
    thirdColor.sort((a, b) => b.luminance - a.luminance);
    sortTheseColors = [...firstColor, ...secondColor, ...thirdColor];
    console.log("split is not issue");
  } else if (triadicColor) {
    triSort = [...sortTheseColors];
    firstColor = [triSort[1], triSort[3]];
    secondColor = [triSort[0]];
    thirdColor = [triSort[2], triSort[4]];
    firstColor.sort((a, b) => a.luminance - b.luminance);
    thirdColor.sort((a, b) => b.luminance - a.luminance);
    sortTheseColors = [...firstColor, ...secondColor, ...thirdColor];
    console.log("triadic is not issue");
  } else if (tetradicColor) {
    //tetradic does not require the colors to be sorted
    console.log("tetra is not issue");
  } // I should add an else statement
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

function generateColorScheme() {
  // const numberOfColors = Math.floor(Math.random() * 2) + 2;
  initialColors = [];
  mainColors = [];
  accentColors = [];
  accentColors2 = [];
  colorLuminance = [];
  randomColorSchemeType();
  mainColorArray = generateRandomColorHSL();
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
  } else {
    console.log("Did not understand");
  }
  // if (fourthColor.length > 0) {
  //   primaryColors = [
  //     ...mainColor,
  //     ...secondColor,
  //     ...thirdColor,
  //     ...fourthColor,
  //   ];
  // } else if (thirdColor.length > 0) {
  //   primaryColors = [...mainColor, ...secondColor, ...thirdColor];
  // } else {
  //   primaryColors = [...mainColor, ...secondColor];
  // }
  //!generate accent colors here or above?
  // createAccentColors()
  // finalColors = [...primaryColors, ...accentColors2];
  // finalColors = [...sortedHex];
  // sortableColors = [];
  // sortedHex = [];
  setWebTemplateColors();
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    //add color to array
    //todo: bug here. If first color div is locked, then that color should be pushed to primary color array
    if (div.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(finalColors[index]);
    }
    //add color to bg
    div.style.backgroundColor = finalColors[index];
    hexText.innerText = finalColors[index];
    //check for contrast
    checkContrast(finalColors[index], hexText);
    //initial colorize sliders
    const color = chroma(finalColors[index]);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSliders(color, hue, brightness, saturation);
  });
  //reset inputs
  resetInputs();
  //check for button contrast
  adjustButton.forEach((button, index) => {
    checkContrast(initialColors[index], button);
    checkContrast(initialColors[index], lockButton[index]);
  });
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
  //saturation scale
  const minSat = color.set("hsl.s", 0);
  const maxSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([minSat, color, maxSat]);
  //brightness scale
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);
  //update input colors
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
  //check contrast
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

// mybutton = document.getElementById("myBtn");
// window.onscroll = function () {
//   scrollFunction();
// };
// function scrollFunction() {
//   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//     mybutton.style.display = "block";
//   } else {
//     mybutton.style.display = "none";
//   }
// }
// function topFunction() {
//   document.body.scrollTop = 0;
//   document.documentElement.scrollTop = 0;
// }

//--Function initialization ------------------------------------------------
function init() {
  getLocal();
  generateColorScheme();
}

init();
