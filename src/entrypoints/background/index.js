console.log("background script loaded, nice");

function getCurrentTab(callback) {
  let queryOptions = { active: true, lastFocusedWindow: true };
  chrome.tabs.query(queryOptions, ([tab]) => {
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    console.log("tab", tab);
    callback(tab);
  });
}

chrome.action.onClicked.addListener((tab) => {
  console.log("HIHI");
  chrome.tabs.sendMessage(tab.id, { message: "clicked" });
});
