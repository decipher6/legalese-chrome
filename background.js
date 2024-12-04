// Ensure the side panel opens on action click
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

let lastProcessedText = "";

setInterval(async () => {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    const url = tab.url;

    if (!url.endsWith(".pdf") && !url.includes("chrome-extension://")) {
      // Handle normal web pages
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText.trim(), // Read entire webpage text
      });

      const pageText = result.result;

      if (pageText && pageText !== lastProcessedText) {
        lastProcessedText = pageText;

        const subsection = getRandomSubsection(pageText, 3000);
        chrome.runtime.sendMessage({ type: "NEW_TEXT", text: subsection });
      }
    }
  } catch (error) {
    console.error("Error fetching text:", error);
  }
}, 1000);

// Helper function to extract a random subsection of given length
function getRandomSubsection(text, length) {
  if (text.length <= length) return text;

  const startIndex = Math.floor(Math.random() * (text.length - length));
  return text.substring(startIndex, startIndex + length);
}
