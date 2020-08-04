const codes = document.getElementsByTagName("code");

// Slack: 206 55 92
// Notion: 218 97 92
const NEW_DEFAULT_COLOR = "#DA5C44";
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
    code.style.color = NEW_DEFAULT_COLOR;
    continue;
  }
  if (parent.nodeName === "PRE" || checkIfA(parent)) {
    continue;
  }

  // e.g. <a <strong
  const parentParnet = parent.parentNode;
  if (!parentParnet) {
    code.style.color = NEW_DEFAULT_COLOR;
    continue;
  }
  if (checkIfA(parentParnet)) {
    continue;
  }

  // e.g. <a <strong < em
  const parentParnetParent = parentParnet.parentNode;
  if (!parentParnetParent) {
    code.style.color = NEW_DEFAULT_COLOR;
    continue;
  }
  if (checkIfA(parentParnetParent)) {
    continue;
  }

  // e.g. <a <strong < em < del
  const parentParnetParentParent = parentParnetParent.parentNode;
  if (!parentParnetParentParent) {
    code.style.color = NEW_DEFAULT_COLOR;
    continue;
  }
  if (checkIfA(parentParnetParentParent)) {
    continue;
  }

  code.style.color = NEW_DEFAULT_COLOR;
}
