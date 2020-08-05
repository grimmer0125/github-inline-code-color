// Slack: 206 55 92
// Notion: 218 97 92 = "#DA5C44
const DEFAULT_NOTION_COLOR = "#DA5C44";
const ORIGINAL_BG_COLOR = "#F3F4F4";

function changeColorByVisibility(color, bgColor, visibility) {
  if (!visibility || visibility === "enable") {
    let finalColor = "";
    let finalBGColor = "";
    if (color) {
      if (color.indexOf(",") > -1) {
        finalColor = `rgb(${color})`;
      } else {
        finalColor = color;
      }
    } else {
      finalColor = DEFAULT_NOTION_COLOR;
    }
    if (bgColor) {
      if (bgColor.indexOf(",") > -1) {
        finalBGColor = `rgb(${bgColor})`;
      } else {
        finalBGColor = bgColor;
      }
    } else {
      finalBGColor = ORIGINAL_BG_COLOR;
    }
    changeColor(finalColor, finalBGColor);
  } else {
    // set color = "" + bgColr = ""
    changeColor("", ORIGINAL_BG_COLOR);
  }
}

chrome.storage.sync.get(
  ["currentColor", "currentBGColor", "visibility"],
  (result) => {
    const { visibility, currentColor, currentBGColor } = result;
    if (!visibility || visibility === "enable") {
      changeColorByVisibility(currentColor, currentBGColor, visibility);
    }
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request.message === "changeColor") {
        const { color, bgColor, visibility } = request;
        changeColorByVisibility(color, bgColor, visibility);
      }
    });
  }
);

function changeColor(colorStr, bgColorStr) {
  const codes = document.getElementsByTagName("code");

  function checkIfA(node) {
    if (node.nodeName === "A") {
      return true;
    }
    return false;
  }

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const parent = code.parentNode;
    if (!parent) {
      code.style.color = colorStr;
      code.style.backgroundColor = bgColorStr;
      continue;
    }
    if (parent.nodeName === "PRE" || checkIfA(parent)) {
      continue;
    }

    // e.g. <a <strong
    const parentParnet = parent.parentNode;
    if (!parentParnet) {
      code.style.color = colorStr;
      code.style.backgroundColor = bgColorStr;
      continue;
    }
    if (checkIfA(parentParnet)) {
      continue;
    }

    // e.g. <a <strong < em
    const parentParnetParent = parentParnet.parentNode;
    if (!parentParnetParent) {
      code.style.color = colorStr;
      code.style.backgroundColor = bgColorStr;
      continue;
    }
    if (checkIfA(parentParnetParent)) {
      continue;
    }

    // e.g. <a <strong < em < del
    const parentParnetParentParent = parentParnetParent.parentNode;
    if (!parentParnetParentParent) {
      code.style.color = colorStr;
      code.style.backgroundColor = bgColorStr;
      continue;
    }
    if (checkIfA(parentParnetParentParent)) {
      continue;
    }

    code.style.color = colorStr;
    code.style.backgroundColor = bgColorStr;
  }
}
