const NEW_DEFAULT_COLOR = "#DA5C44";

function setColor(newColor) {
  chrome.storage.sync.set({ currentColor: newColor }, () => {});
  if (newColor !== NEW_DEFAULT_COLOR) {
    currentColorLabel.textContent = newColor;
  } else {
    currentColorLabel.textContent = "Notion style";
  }
  colorMsg.textContent = "ok";
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["currentColor"], (result) => {
    if (result.currentColor) {
      currentColorLabel.textContent = result.currentColor;
    } else {
      currentColorLabel.textContent = "Notion style";
    }
  });

  function updateInput(e) {
    console.log("update input:", e.target.value);
  }

  newColorInput.addEventListener("input", updateInput);

  apployNewColorBtn.addEventListener("click", () => {
    const newColor = newColorInput.value;
    console.log("apply new color button click:", newColor);
    if (checkValidColor(newColor)) {
      console.log("valid");
      setColor(newColor);
    } else {
      console.log("invalid:", newColor);
      colorMsg.textContent = "invalid";
    }
  });

  resetButton.addEventListener("click", () => {
    console.log("reset button click");
    setColor(NEW_DEFAULT_COLOR);
  });
});

function isHexColor(colorStr) {
  if (/^#[0-9A-F]{6}$/i.test(colorStr)) {
    return true;
  }
  return false;
}

function isColorName(colorStr) {
  const s = new Option().style;
  s.color = colorStr;
  if (s.color === colorStr) {
    return true;
  }
  return false;
}

function isRGBColor(colorStr) {
  const subStrings = colorStr.split(",");
  if (subStrings.length !== 3) {
    return false;
  }
  for (const subStr of subStrings) {
    const subInt = parseInt(subStr);
    if (isNaN(subInt)) {
      return false;
    }
    if (subInt < 0 && subInt > 255) {
      return false;
    }
  }
  return true;
}

function checkValidColor(colorStr) {
  if (!colorStr) {
    return false;
  }
  if (isColorName(colorStr) || isHexColor(colorStr) || isRGBColor(colorStr)) {
    return true;
  }
  return false;
}

// Hex:
// https://stackoverflow.com/questions/8027423/how-to-check-if-a-string-is-a-valid-hex-color-representation/8027444
// /^#[0-9A-F]{6}$/i.test('#AABBCC')
// RGB,
// normal color ?
// https://stackoverflow.com/questions/48484767/javascript-check-if-string-is-valid-css-color
