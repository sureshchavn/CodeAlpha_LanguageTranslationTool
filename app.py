
from flask import Flask, render_template, request, jsonify # type: ignore
from langdetect import detect, LangDetectException # pyright: ignore[reportMissingImports]
import requests # pyright: ignore[reportMissingModuleSource]
import re

app = Flask(__name__)

TRANSLATION_URL = "https://api.mymemory.translated.net/get"
LANGUAGE_CODES = {
    "en": "en",
    "hi": "hi",
    "mr": "mr",
    "es": "es",
    "fr": "fr",
    "de": "de",
    "ja": "ja",
    "zh": "zh-CN",
    "ar": "ar",
    "pt": "pt",
    "ru": "ru",
    "it": "it",
    "ko": "ko",
    "bn": "bn",
    "ta": "ta",
    "te": "te",
    "gu": "gu",
}


@app.route("/")
def home():
    return render_template("index.html")


def split_text(text, max_bytes=450):
    """Split text into chunks that fit the API's 500-byte limit."""
    words = text.split()
    chunks = []
    current = ""

    for word in words:
        candidate = f"{current} {word}".strip()

        if len(candidate.encode("utf-8")) <= max_bytes:
            current = candidate
        else:
            if current:
                chunks.append(current)

            if len(word.encode("utf-8")) > max_bytes:
                raise ValueError(
                    "A single word is too long to translate."
                )

            current = word

    if current:
        chunks.append(current)

    return chunks


def detect_language(text):
    try:
        detected = detect(text)
        if detected in LANGUAGE_CODES:
            return detected
        if detected == "zh-cn":
            return "zh"
        raise ValueError(
            "Detected language is not supported. Please select it manually."
        )
    except LangDetectException:
        raise ValueError(
            "Could not detect the language. Please select it manually."
        )


def translate_chunk(text, source, target):
    params = {
        "q": text,
        "langpair": f"{LANGUAGE_CODES[source]}|{LANGUAGE_CODES[target]}",
        "mt": "1",
    }

    try:
        response = requests.get(
            TRANSLATION_URL,
            params=params,
            timeout=20,
        )
        response.raise_for_status()
        data = response.json()
    except requests.RequestException:
        raise RuntimeError(
            "Could not connect to the translation service. Please try again."
        )
    except ValueError:
        raise RuntimeError(
            "The translation service returned an invalid response."
        )

    if data.get("responseStatus") != 200:
        raise RuntimeError(
            data.get("responseDetails") or "Translation request failed."
        )

    result = data.get("responseData", {}).get("translatedText", "")
    if not result:
        raise RuntimeError("No translation was returned.")

    return result


@app.route("/api/translate", methods=["POST"])
def translate():
    data = request.get_json(silent=True) or {}

    text = data.get("text", "").strip()
    source = data.get("source", "auto")
    target = data.get("target", "en")

    if not text:
        return jsonify({"error": "Please enter text to translate."}), 400

    if len(text) > 5000:
        return jsonify({"error": "Maximum text length is 5000 characters."}), 400

    if target not in LANGUAGE_CODES:
        return jsonify({"error": "Unsupported target language."}), 400

    if source != "auto" and source not in LANGUAGE_CODES:
        return jsonify({"error": "Unsupported source language."}), 400

    try:
        if source == "auto":
            source = detect_language(text)

        if source == target:
            return jsonify({
                "error": "Source and target languages are the same."
            }), 400

        chunks = split_text(text)
        translations = [
            translate_chunk(chunk, source, target)
            for chunk in chunks
        ]

        return jsonify({
            "translatedText": " ".join(translations),
            "source": source,
            "target": target,
            "detectedLanguage": source,
        })

    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except RuntimeError as error:
        return jsonify({"error": str(error)}), 502


if __name__ == "__main__":
    app.run(debug=True)
