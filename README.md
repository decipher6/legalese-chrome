# Legalese interpreter using On-device AI with Gemini Nano

This uses Gemini Nano API available in the context of an origin trial in Chrome with Chrome Extensions to make an extension that interprets legal documents and contracts. It gives you a simple list of red flags before you agree to the terms and conditions.

## Running this extension

1. Clone this repository.
2. Run `npm install` in the project directory.
3. Change the API key in the manifest.json to your own API key, you can use your trial token to get your API key at (https://developer.chrome.com/docs/web-platform/origin-trials#extensions).
4. Run `npm run build` in the project directory to build the extension.
5. Load the newly created `dist` directory in Chrome as an [unpacked extension].
6. Click the extension icon.
7. Interact with the Legalese extension in the sidebar.
