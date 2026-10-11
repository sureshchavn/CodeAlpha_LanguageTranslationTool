# 🌐 LinguaFlow — Language Translation Tool

A modern, responsive, multilingual translation web application built using **Python Flask, HTML, CSS, and JavaScript**. LinguaFlow helps users translate text between multiple languages through a simple and interactive interface.

## 📌 Project Overview

LinguaFlow is a web-based language translation tool developed as part of the **CodeAlpha Artificial Intelligence Internship**.

The application allows users to enter text, select source and target languages, and receive translations through the MyMemory Translation API. It also supports automatic language detection, text-to-speech, copying translated text, and recent translation history.

## ✨ Features

- 🌍 **Multilingual Translation:** Translate text between supported languages.
- 🔍 **Automatic Language Detection:** Detect the source language automatically.
- 🔄 **Swap Languages:** Quickly switch source and target languages.
- 📋 **Copy Translation:** Copy translated text to the clipboard.
- 🔊 **Text-to-Speech:** Listen to the entered or translated text using browser speech synthesis.
- 🕘 **Recent History:** View recent translations within the interface.
- 🌙 **Dark and Light Themes:** Switch between dark and light appearance.
- 📱 **Responsive Design:** Use the application on desktop, tablet, and mobile devices.
- ⚠️ **Error Handling:** Display helpful messages for empty input, unsupported languages, and translation service failures.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend application logic |
| Flask | Web server and REST API |
| HTML5 | Web page structure |
| CSS3 | Styling, responsive layout, and animations |
| JavaScript | Interactive UI and API requests |
| Requests | Communicate with the translation service |
| langdetect | Automatic source-language detection |
| MyMemory Translation API | Machine translation service |

## 🏗️ Project Architecture

The application follows a simple client-server architecture.

1. The user enters text and selects the source and target languages.
2. JavaScript sends a POST request to the Flask backend.
3. Flask validates the input and detects the source language when automatic detection is selected.
4. The backend sends translation requests to the MyMemory Translation API.
5. The translated result is returned as JSON.
6. JavaScript displays the translation in the interface.

## 📂 Project Structure

```text
CodeAlpha_LanguageTranslationTool/
│
├── app.py
├── requirements.txt
├── .gitignore
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following software:

- Python 3.10 or later
- pip (Python package installer)
- Git (optional, for version control)
- A modern web browser

### Step 1: Clone the Repository

```bash
git clone https://github.com/sureshchavn/CodeAlpha_LanguageTranslationTool.git
cd CodeAlpha_LanguageTranslationTool
```

Alternatively, download the repository as a ZIP file and extract it.

### Step 2: Create a Virtual Environment

**Windows PowerShell:**

```powershell
python -m venv .venv
```

Activate the environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, you can run the following command in the current terminal session:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

### Step 3: Install Dependencies

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

The `requirements.txt` file should contain:

```text
Flask
requests
langdetect
```

### Step 4: Start the Application

```powershell
python app.py
```

When the Flask server starts successfully, open the following URL in your browser:

**http://127.0.0.1:5000**

Keep the terminal open while using the application. Press `Ctrl+C` in the terminal to stop the server.

## 🚀 How to Use LinguaFlow

1. Open the application in your browser.
2. Enter the text you want to translate.
3. Select the source language or choose automatic detection.
4. Select the target language.
5. Click the **Translate** button.
6. Read the translated text in the result panel.
7. Use the copy button to copy the result.
8. Use text-to-speech to listen to the text.
9. Switch themes or review recent translations as needed.

### Example

| Field | Example |
|---|---|
| Source Language | English |
| Target Language | Marathi |
| Input | Hello, how can I help you today? |
| Expected Translation | नमस्कार, आज मी तुम्हाला कशी मदत करू शकतो? |

*Translations may vary depending on the translation service.*

## 🔌 Backend API

### Translate Text

**Endpoint:** `/api/translate`

**Method:** `POST`

**Content-Type:** `application/json`

#### Request Example

```json
{
  "text": "Hello, how are you?",
  "source": "en",
  "target": "mr"
}
```

Use `"auto"` as the source language to enable automatic detection.

#### Successful Response

```json
{
  "translatedText": "नमस्कार, तुम्ही कसे आहात?",
  "source": "en",
  "target": "mr",
  "detectedLanguage": "en"
}
```

The translated sentence above is illustrative; actual API output may differ.

#### Error Handling

The backend can return JSON error messages for invalid input, unsupported languages, language detection problems, and translation service failures.

- `400 Bad Request` — Invalid input or unsupported language.
- `502 Bad Gateway` — Translation service failure.

The application limits input to 5,000 characters and splits longer requests into smaller chunks for translation.

## 🌐 Supported Languages

The application is configured for the following languages:

English, Hindi, Marathi, Spanish, French, German, Japanese, Chinese, Arabic, Portuguese, Russian, Italian, Korean, Bengali, Tamil, Telugu, and Gujarati.

Automatic detection depends on the language detection library and may be inaccurate for very short text.

## 🔐 Security and Limitations

- The application depends on an external translation service and an active internet connection.
- Translation quality can vary depending on language pair, context, and sentence complexity.
- Automatic language detection may be unreliable for short or ambiguous input.
- The public translation service may enforce request or usage limits.
- Flask debug mode is intended for local development only. Disable debug mode before deploying the application publicly.
- Do not submit sensitive or confidential text to an external translation service.
- This project is intended for educational and demonstration purposes.

## 🔮 Future Enhancements

- Add more languages and translation providers.
- Improve translation history persistence.
- Add document translation for supported file formats.
- Implement user accounts and saved translations.
- Add a deployment-ready configuration.
- Improve error messages, accessibility, and automated testing.

## 🎓 Internship Project

**Program:** Artificial Intelligence Internship  
**Organization:** CodeAlpha  
**Project:** Language Translation Tool  
**Category:** Artificial Intelligence / Natural Language Processing

## 👨‍💻 Author

**Suresh Chavan**

GitHub: [@sureshchavn](https://github.com/sureshchavn)

LinkedIn: [Connect on LinkedIn](https://www.linkedin.com/in/suresh-chavan/)

## 📄 License

This project is created for educational and internship purposes. You may add an open-source license if you intend to distribute the project under specific reuse terms.

---

⭐ If you find this project useful, consider giving the repository a star.
