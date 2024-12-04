const responseElement = document.getElementById("response");
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error");


let session;


// Listen for messages from background.js
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "NEW_TEXT") {
    const text = message.text;
    console.log("Selected text:", text);

    showLoading();

    const params = {
      systemPrompt: "FIND RED FLAGS IN THIS CONTRACT TEXT. JUST LIST THEM AND DO NOT USE LEGAL JARGON. USE a RED flag emoji instead of a bullet point. MAKE IT LESS WORDY.",
      temperature: 1.0,
      topK: 5,
    };

    try {
      const response = await runPrompt(text, params);
      showResponse(response);
    } catch (error) {
      showError(error.message || "An error occurred.");
    }
  }
});

async function runPrompt(prompt, params) {
  try {
    if (!session) {
      session = await chrome.aiOriginTrial.languageModel.create(params);
    }
    return session.prompt(prompt);
  } catch (e) {
    console.error("Prompt failed:", e);
    reset();
    throw e;
  }
}

async function reset() {
  if (session) {
    await session.destroy();
  }
  session = null;
}

function showLoading() {
  responseElement.hidden = true;
  errorElement.hidden = true;
  loadingElement.hidden = false;
}

function showResponse(response) {
  loadingElement.hidden = true;
  errorElement.hidden = true;
  responseElement.hidden = false;

  // Convert Markdown-style headings and other elements
  responseElement.innerHTML = response
    .replace(/^###\s(.*$)/gm, "<h3>$1</h3>") // Convert ### Heading to <h3>
    .replace(/^##\s(.*$)/gm, "<h2>$1</h2>")  // Convert ## Heading to <h2>
    .replace(/^#\s(.*$)/gm, "<h1>$1</h1>")   // Convert # Heading to <h1>
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")  // Convert **bold** to <b>
    .replace(/\n/g, "<br>");                 // Convert line breaks to <br>
}
function showError(error) {
  loadingElement.hidden = true;
  responseElement.hidden = true;
  errorElement.hidden = false;
  errorElement.textContent = error;
}

// Add Dark Mode Toggle Button
const bodyElement = document.body;
const darkModeButton = document.getElementById("button-dark-mode");

darkModeButton.addEventListener("click", () => {
  if (bodyElement.classList.contains("dark-mode")) {
    bodyElement.classList.remove("dark-mode");
    darkModeButton.textContent = "Enable Dark Mode";
  } else {
    bodyElement.classList.add("dark-mode");
    darkModeButton.textContent = "Disable Dark Mode";
  }
});
