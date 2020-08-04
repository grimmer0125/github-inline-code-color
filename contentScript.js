// Slack: 206 55 92
// Notion: 218 97 92 = "#DA5C44
const NEW_DEFAULT_COLOR = "#DA5C44";

// function start() {
//   alert("started");
// }

function changeColorByVisibility(visibility, color) {
  if (!visibility || visibility === "enable") {
    if (color) {
      if (color.indexOf(",") > -1) {
        changeColor(`rgb(${color})`);
      } else {
        changeColor(color);
      }
    } else {
      changeColor(NEW_DEFAULT_COLOR);
    }
  } else {
    changeColor("");
  }
}

chrome.storage.sync.get(["currentColor", "visibility"], (result) => {
  const { visibility, currentColor } = result;
  if (!visibility || visibility === "enable") {
    changeColorByVisibility(visibility, currentColor);
  }
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.message === "changeColor") {
      const { visibility, color } = request;
      changeColorByVisibility(visibility, color);
    }
  });
});

function changeColor(colorStr) {
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
      continue;
    }
    if (parent.nodeName === "PRE" || checkIfA(parent)) {
      continue;
    }

    // e.g. <a <strong
    const parentParnet = parent.parentNode;
    if (!parentParnet) {
      code.style.color = colorStr;
      continue;
    }
    if (checkIfA(parentParnet)) {
      continue;
    }

    // e.g. <a <strong < em
    const parentParnetParent = parentParnet.parentNode;
    if (!parentParnetParent) {
      code.style.color = colorStr;
      continue;
    }
    if (checkIfA(parentParnetParent)) {
      continue;
    }

    // e.g. <a <strong < em < del
    const parentParnetParentParent = parentParnetParent.parentNode;
    if (!parentParnetParentParent) {
      code.style.color = colorStr;
      continue;
    }
    if (checkIfA(parentParnetParentParent)) {
      continue;
    }

    code.style.color = colorStr;
  }
}
