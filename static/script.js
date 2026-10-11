
const sourceText = document.getElementById("sourceText");
const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");
const translatedText = document.getElementById("translatedText");
const translateBtn = document.getElementById("translateBtn");
const translateBtnText = document.getElementById("translateBtnText");
const translationStatus = document.getElementById("translationStatus");
const errorMessage = document.getElementById("errorMessage");
const historyList = document.getElementById("historyList");

const languageNames = {
  auto: "Auto detect", en: "English", hi: "Hindi", mr: "Marathi",
  es: "Spanish", fr: "French", de: "German", ja: "Japanese",
  zh: "Chinese", ar: "Arabic", pt: "Portuguese", ru: "Russian",
  it: "Italian", ko: "Korean", bn: "Bengali", ta: "Tamil",
  te: "Telugu", gu: "Gujarati"
};

let historyItems = [];

function updateCounter() {
  document.getElementById("charCount").textContent =
    `${sourceText.value.length} / 5000`;
}

function updateTargetTag() {
  document.getElementById("outputTag").textContent =
    (languageNames[targetLang.value] || targetLang.value).toUpperCase();
}

function showError(message) {
  errorMessage.textContent = message;
}

function renderHistory() {
  if (!historyItems.length) {
    historyList.innerHTML = `
      <div class="empty-history">
        <span class="empty-icon">↗</span>
        <p>Your translation history will appear here.</p>
      </div>`;
    return;
  }

  historyList.replaceChildren();

  historyItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "history-item";

    const original = document.createElement("div");
    const languages = document.createElement("span");
    languages.className = "history-languages";
    languages.textContent =
      `${languageNames[item.source] || item.source} → ${languageNames[item.target] || item.target}`;
    const originalText = document.createElement("p");
    originalText.textContent = item.original;
    original.append(languages, originalText);

    const translated = document.createElement("div");
    const translatedTextEl = document.createElement("p");
    translatedTextEl.textContent = item.translated;
    translated.append(translatedTextEl);

    const copyButton = document.createElement("button");
    copyButton.className = "history-copy";
    copyButton.textContent = "Copy";
    copyButton.addEventListener("click", () => copyText(item.translated));

    card.append(original, translated, copyButton);
    historyList.append(card);
  });
}

async function copyText(text) {
  if (!text) {
    showError("There is no translation to copy yet.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    translationStatus.textContent = "Copied to clipboard";
  } catch {
    showError("Clipboard access failed. Please copy the text manually.");
  }
}

function speak(text, language) {
  if (!text) {
    showError("There is no text to read aloud.");
    return;
  }

  if (!("speechSynthesis" in window)) {
    showError("Text-to-speech is not supported by this browser.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "auto" ? "en" : language;
  window.speechSynthesis.speak(utterance);
}

sourceText.addEventListener("input", updateCounter);
targetLang.addEventListener("change", updateTargetTag);

document.getElementById("clearBtn").addEventListener("click", () => {
  sourceText.value = "";
  updateCounter();
  sourceText.focus();
  showError("");
});

document.getElementById("swapBtn").addEventListener("click", () => {
  if (sourceLang.value === "auto") {
    showError("Choose a source language before swapping.");
    return;
  }

  const previousSource = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = previousSource;

  const currentInput = sourceText.value;
  const currentOutput = translatedText.textContent;
  if (currentOutput && currentOutput !== "Your translation will appear here...") {
    sourceText.value = currentOutput;
    translatedText.textContent = currentInput || "Your translation will appear here...";
  }

  updateCounter();
  updateTargetTag();
  showError("");
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const text = translatedText.textContent;
  if (text === "Your translation will appear here...") {
    showError("Translate some text first.");
    return;
  }
  copyText(text);
});

document.getElementById("speakSource").addEventListener("click", () => {
  speak(sourceText.value, sourceLang.value);
});

document.getElementById("speakTarget").addEventListener("click", () => {
  const text = translatedText.textContent;
  if (text === "Your translation will appear here...") {
    showError("Translate some text first.");
    return;
  }
  speak(text, targetLang.value);
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

document.getElementById("clearHistory").addEventListener("click", () => {
  historyItems = [];
  renderHistory();
});

translateBtn.addEventListener("click", async () => {
  const text = sourceText.value.trim();
  showError("");

  if (!text) {
    showError("Please enter some text to translate.");
    sourceText.focus();
    return;
  }

  if (sourceLang.value === targetLang.value) {
    showError("Choose two different languages.");
    return;
  }

  translateBtn.disabled = true;
  translateBtnText.textContent = "Translating...";
  translationStatus.textContent = "Connecting to translation service...";

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        source: sourceLang.value,
        target: targetLang.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Translation failed.");
    }

    translatedText.textContent = data.translatedText;
    translationStatus.textContent = "Translation complete";

    historyItems.unshift({
      original: text,
      translated: data.translatedText,
      source: sourceLang.value,
      target: targetLang.value
    });
    historyItems = historyItems.slice(0, 10);
    renderHistory();
  } catch (error) {
    translationStatus.textContent = "Translation unavailable";
    showError(error.message || "Could not connect to the translation service.");
  } finally {
    translateBtn.disabled = false;
    translateBtnText.textContent = "Translate text";
  }
});

updateCounter();
updateTargetTag();
renderHistory();
