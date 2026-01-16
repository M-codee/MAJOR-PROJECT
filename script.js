const input = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");
const resultBox = document.getElementById("result");
const warning = document.getElementById("warning");

const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en/";

function fetchMeaning() {
  const word = input.value.trim();

  warning.textContent = "";
  resultBox.innerHTML = "";

  if (!word) {
    warning.textContent = "Please enter a word before searching.";
    return;
  }

  fetch(API_BASE + word)
    .then(res => res.json())
    .then(data => {
      if (data.title === "No Definitions Found") {
        resultBox.innerHTML = `<p><strong>Word not found. Please try another word.</strong></p>`;
        return;
      }

      const entry = data[0];
      const meaning = entry.meanings[0];
      const definition = meaning.definitions[0];

      const partOfSpeech = meaning.partOfSpeech || "";
      const example = definition.example || "Example not available";
      const phonetic = entry.phonetic || (entry.phonetics[0]?.text || "N/A");
      const audioSrc = entry.phonetics.find(p => p.audio)?.audio || "";

      resultBox.innerHTML = `
        <h2>${entry.word}</h2>
        <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
        <p><strong>Meaning:</strong> ${definition.definition}</p>
        <p><strong>Example:</strong> ${example}</p>
        <p><strong>Phonetic:</strong> ${phonetic}</p>
      `;

      if (audioSrc) {
        const btn = document.createElement("button");
        btn.textContent = "Play Audio";
        btn.className = "audio-btn";

        const audio = new Audio(audioSrc);
        btn.onclick = () => audio.play();

        resultBox.appendChild(btn);
      }
    })
    .catch(() => {
      resultBox.innerHTML = `<p><strong>Word not found. Please try another word.</strong></p>`;
    });
}

searchBtn.addEventListener("click", fetchMeaning);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchMeaning();
});
