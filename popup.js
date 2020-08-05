const DEFAULT_NOTION_COLOR = "#DA5C44";
const ORIGINAL_BG_COLOR = "#F3F4F4";

function notifyContentChangeColor(color, bgColor, visibility) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: "changeColor",
      color,
      bgColor,
      visibility,
    });
  });
}

function setColor(newColor) {
  chrome.storage.sync.set({ currentColor: newColor }, () => {});
  if (newColor !== DEFAULT_NOTION_COLOR) {
    currentColorLabel.textContent = newColor;
  } else {
    currentColorLabel.textContent = "Notion style";
  }
  colorMsg.textContent = "ok";

  let bgColor;
  if (currentBGColorLabel.textContent !== "Original GitHub style") {
    bgColor = currentBGColorLabel.textContent;
  } else {
    bgColor = ORIGINAL_BG_COLOR;
  }
  notifyContentChangeColor(newColor, bgColor, onOffDropdown.value);
}

// TODO: change later
function setBGColor(newColor) {
  chrome.storage.sync.set({ currentBGColor: newColor }, () => {});
  if (newColor !== ORIGINAL_BG_COLOR) {
    currentBGColorLabel.textContent = newColor;
  } else {
    currentBGColorLabel.textContent = "Original GitHub style";
  }
  colorMsg.textContent = "ok";

  let color;
  if (currentColorLabel.textContent !== "Notion style") {
    color = currentColorLabel.textContent;
  } else {
    color = DEFAULT_NOTION_COLOR;
  }
  notifyContentChangeColor(color, newColor, onOffDropdown.value);
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["currentColor"], (result) => {
    if (result.currentColor && result.currentColor !== DEFAULT_NOTION_COLOR) {
      currentColorLabel.textContent = result.currentColor;
    } else {
      currentColorLabel.textContent = "Notion style";
    }
  });
  chrome.storage.sync.get(["currentBGColor"], (result) => {
    if (result.currentBGColor && result.currentBGColor !== ORIGINAL_BG_COLOR) {
      currentBGColorLabel.textContent = result.currentBGColor;
    } else {
      currentBGColorLabel.textContent = "Original GitHub style";
    }
  });

  apployNewColorBtn.addEventListener("click", () => {
    const newColor = newColorInput.value;
    if (checkValidColor(newColor)) {
      setColor(newColor);
    } else {
      colorMsg.textContent = "invalid Color";
    }
  });
  apployNewBGColorBtn.addEventListener("click", () => {
    const newBGColor = newBGColorInput.value;
    if (checkValidColor(newBGColor)) {
      setBGColor(newBGColor);
    } else {
      colorMsg.textContent = "invalid BG Color";
    }
  });

  resetButton.addEventListener("click", () => {
    setColor(DEFAULT_NOTION_COLOR);
  });
  resetBGButton.addEventListener("click", () => {
    setBGColor(ORIGINAL_BG_COLOR);
  });

  const onOffDropdown = document.getElementById("onOffDropdown");
  chrome.storage.sync.get(["visibility"], (result) => {
    if (result.visibility) {
      onOffDropdown.value = result.visibility;
    }
  });
  onOffDropdown.addEventListener("change", () => {
    chrome.storage.sync.set({ visibility: onOffDropdown.value }, () => {});
    let color = currentColorLabel.textContent;
    if (color === "Notion style") {
      color = DEFAULT_NOTION_COLOR;
    }
    let bgColor = currentBGColorLabel.textContent;
    if (bgColor === "Original GitHub style") {
      bgColor = ORIGINAL_BG_COLOR;
    }
    notifyContentChangeColor(color, bgColor, onOffDropdown.value);
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
