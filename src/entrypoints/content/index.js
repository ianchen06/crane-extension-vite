import "@webcomponents/custom-elements";
import HelloWorld from "../../components/helloworld";

console.log("content script loaded");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });

  enterClipperMode();
});

customElements.define("hello-world", HelloWorld);
const myElement = document.createElement("hello-world");
document.body.prepend(myElement);
let clipperMode = false;
let selectedElements = [];
let hoverElement = null;

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    exitClipperMode();
  }
});

document.addEventListener("mousemove", (e) => {
  if (!clipperMode) return;

  const element = document.elementFromPoint(e.clientX, e.clientY);
  if (
    hoverElement &&
    hoverElement !== element &&
    !selectedElements.includes(hoverElement)
  ) {
    hoverElement.style.outline = "";
  }
  if (element && !selectedElements.includes(element)) {
    hoverElement = element;
    hoverElement.style.outline = "2px solid blue";
  }
});

document.addEventListener(
  "click",
  (e) => {
    if (!clipperMode) return;

    // Check if the click is on the deselect button
    if (e.target.classList.contains("deselect-button")) {
      e.preventDefault();
      e.stopPropagation();
      deselectElement(e.target.parentElement); // Deselect the parent element
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const element = e.target;
    if (element) {
      if (selectedElements.includes(element)) {
        deselectElement(element);
      } else {
        selectElement(element);
      }
    }
  },
  true
);

function enterClipperMode() {
  clipperMode = true;
  document.body.style.cursor = "crosshair";
}

function exitClipperMode() {
  clipperMode = false;
  document.body.style.cursor = "default";
  if (hoverElement && !selectedElements.includes(hoverElement)) {
    hoverElement.style.outline = "";
  }
  selectedElements.forEach(deselectElement);
  selectedElements = [];
}

function selectElement(element) {
  element.style.position = "relative";
  element.style.outline = "2px solid blue";

  const deselectButton = document.createElement("button");
  deselectButton.textContent = "X";
  deselectButton.classList.add("deselect-button");
  deselectButton.style.position = "absolute";
  deselectButton.style.top = "0";
  deselectButton.style.right = "0";
  deselectButton.style.backgroundColor = "blue";
  deselectButton.style.color = "white";
  deselectButton.style.border = "none";
  deselectButton.style.cursor = "pointer";
  deselectButton.style.zIndex = "1000"; // Ensure button is above other content

  element.appendChild(deselectButton);
  selectedElements.push(element);
}

function deselectElement(element) {
  element.style.outline = "";
  const button = element.querySelector(".deselect-button");
  if (button) {
    element.removeChild(button);
  }
  selectedElements = selectedElements.filter((el) => el !== element);
}
