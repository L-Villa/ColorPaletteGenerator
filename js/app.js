//Global selections and variables
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

function generateHArrays() {
  hs = [];
  ss = [];
  ls = [];
  for (let i = 0; i < 3; i++) {
    hs[i] = mainColorArray[0];
    ss[i] = mainColorArray[1];
    ls[i] = mainColorArray[2];
  }
  return [hs, ss, ls];
}

function generateColorScheme() {
  // const numberOfColors = Math.floor(Math.random() * 2) + 2;
  initialColors = [];
  mainColors = [];
  accentColors = [];
  colorLuminance = [];
  const randSchemeType = randomColorSchemeType();
  const randomHex = generateRandomColor();
  mainColorArray = hexToHSL(randomHex);

  // generateHArrays();
  // console.log(hs);
  // console.log(ss);
  // console.log(ls);
  let h1;
  let s1;
  let l1;
  let h2;
  let s2;
  let l2;
  let h3;
  let s3;
  let l3;
  let hslString1;
  let hslString2;
  let hslString3;
  h1Array = [];
  h2Array = [];
  h3Array = [];
  h1Color = [];
  mainColor = [HSLToHex(mainColorArray)];
  secondColor = [];
  thirdColor = [];
  fourthColor = [];
  if (complimentaryColor) {
    //----------This 150 should be 180 but that is not giving me right color against blue
    h1 = Math.abs(mainColorArray[0] + 180 - 360);
    s1 = Math.abs(mainColorArray[1] - randDecimal());
    l1 = Math.abs(mainColorArray[2] - randDecimal());
    hslString1 = "hsl(" + h1 + "," + s1 * 100 + "%," + l1 * 100 + "%)";
    h1Array.push(h1, s1, l1);
    secondColor = [HSLToHex(h1Array)];
  } else if (monochromaticColor) {
    h1 = Math.abs(mainColorArray[0] - randDecimal() * 5);
    s1 = Math.abs(mainColorArray[1] - randDecimal());
    l1 = Math.abs(mainColorArray[2] - randDecimal());
    hslString1 = "hsl(" + h1 + "," + s1 * 100 + "%," + l1 * 100 + "%)";
    h1Array.push(h1, s1, l1);
    secondColor = [HSLToHex(h1Array)];
  } else if (analogousColor) {
    h1 = Math.abs(mainColorArray[0] + 60 - 360);
    s1 = Math.abs(mainColorArray[1] - randDecimal());
    l1 = Math.abs(mainColorArray[2] - randDecimal());
    h2 = Math.abs(mainColorArray[0] + 120 - 360);
    s2 = Math.abs(mainColorArray[1] - randDecimal());
    l2 = Math.abs(mainColorArray[2] - randDecimal());
    hslString1 = "hsl(" + h1 + "," + s1 * 100 + "%," + l1 * 100 + "%)";
    hslString2 = "hsl(" + h2 + "," + s1 * 100 + "%," + l2 * 100 + "%)";
    h1Array = [h1, s1, l1];
    h2Array = [h2, s2, l2];
    secondColor = [HSLToHex(h1Array)];
    thirdColor = [HSLToHex(h2Array)];
  } else if (splitComplimentaryColor) {
    h1 = Math.abs(mainColorArray[0] + 150 - 360);
    s1 = Math.abs(mainColorArray[1] - randDecimal());
    l1 = Math.abs(mainColorArray[2] - randDecimal());
    h2 = Math.abs(mainColorArray[0] + 210 - 360);
    s2 = Math.abs(mainColorArray[1] - randDecimal());
    l2 = Math.abs(mainColorArray[2] - randDecimal());
    hslString1 = "hsl(" + h1 + "," + s1 * 100 + "%," + l1 * 100 + "%)";
    hslString2 = "hsl(" + h2 + "," + s1 * 100 + "%," + l2 * 100 + "%)";
    h1Array = [h1, s1, l1];
    h2Array = [h2, s2, l2];
    secondColor = [HSLToHex(h1Array)];
    thirdColor = [HSLToHex(h2Array)];
  } else if (triadicColor) {
    h1 = Math.abs(mainColorArray[0] + 120 - 360);
    s1 = Math.abs(mainColorArray[1] - randDecimal());
    l1 = Math.abs(mainColorArray[2] - randDecimal());
    h2 = Math.abs(mainColorArray[0] + 240 - 360);
    s2 = Math.abs(mainColorArray[1] - randDecimal());
    l2 = Math.abs(mainColorArray[2] - randDecimal());
    hslString1 = "hsl(" + h1 + "," + s1 * 100 + "%," + l1 * 100 + "%)";
    hslString2 = "hsl(" + h2 + "," + s1 * 100 + "%," + l2 * 100 + "%)";
    h1Array = [h1, s1, l1];
    h2Array = [h2, s2, l2];
    secondColor = [HSLToHex(h1Array)];
    thirdColor = [HSLToHex(h2Array)];
  } else if (tetradicColor) {
    h1 = Math.abs(mainColorArray[0] + 90 - 360);
    s1 = Math.abs(mainColorArray[1] - randDecimal());
    l1 = Math.abs(mainColorArray[2] - randDecimal());
    h2 = Math.abs(mainColorArray[0] + 180 - 360);
    s2 = Math.abs(mainColorArray[1] - randDecimal());
    l2 = Math.abs(mainColorArray[2] - randDecimal());
    h3 = Math.abs(mainColorArray[0] + 270 - 360);
    s3 = Math.abs(mainColorArray[1] - randDecimal());
    l3 = Math.abs(mainColorArray[2] - randDecimal());
    hslString1 = "hsl(" + h1 + "," + s1 * 100 + "%," + l1 * 100 + "%)";
    hslString2 = "hsl(" + h2 + "," + s1 * 100 + "%," + l3 * 100 + "%)";
    hslString3 = "hsl(" + h3 + "," + s1 * 100 + "%," + l2 * 100 + "%)";
    h1Array = [h1, s1, l1];
    h2Array = [h2, s2, l2];
    h3Array = [h3, s3, l3];
    secondColor = [HSLToHex(h1Array)];
    thirdColor = [HSLToHex(h2Array)];
    fourthColor = [HSLToHex(h3Array)];
  } else {
    console.log("Did not understand");
  }
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
  const numberOfColors = primaryColors.length;
  const numberOfAccents = 5 - numberOfColors;
  for (i = 0; i < numberOfAccents; i++) {
    chooseColor = Math.floor(Math.random() * numberOfColors);
    saturationRandNo = Math.random() * 3;
    darkenRandNo = Math.random() * 4;
    accentColor = primaryColors[chooseColor];
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
    accentColors.push(accentColorSaturation);
  }
  finalColors = [...primaryColors, ...accentColors];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    //add color to array
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
    checkTextContrast(finalColors[index], hexText);
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
    checkTextContrast(initialColors[index], button);
    checkTextContrast(initialColors[index], lockButton[index]);
  });
}

function generateRandomColor() {
  const H = chroma.random().hex();
  return H;
}

function checkTextContrast(color, text) {
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
  checkTextContrast(color, textHex);
  for (icon of icons) {
    checkTextContrast(color, icon);
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
  controls[index].children[0].classList.toggle('active');
  sliderContainers[index].classList.toggle("active");
}

function closeAdjustmentPanel(index) {
  controls[index].children[0].classList.toggle('active');
  sliderContainers[index].classList.remove("active");
}

function toggleLock(index) {
  const currentBg = colorDivs[index];
  const lockSVG = lockButton[index].children[0];
  const locker = lockButton[index];
  currentBg.classList.toggle("locked");
  locker.classList.toggle('active');
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
      checkTextContrast(color, text);
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
          checkTextContrast(color, text);
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

function init() {
  getLocal();
  generateColorScheme();
}

init();