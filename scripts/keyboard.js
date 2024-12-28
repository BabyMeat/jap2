// DONE.
import { LOAD } from "./load.js";
import { TO_MAP } from "./load.js";

// VARIABLES :
let keyboard = {
    verbes: new Map(),
    kanji: new Map(),
    hiragana: new Map(),
    katakana: new Map()
};

async function LOAD_KEYBOARD(){
    keyboard.hiragana = await TO_MAP(LOAD("vocab/hiragana.csv"));
    keyboard.katakana = await TO_MAP(LOAD("vocab/katakana.csv"));
    keyboard.kanji = await TO_MAP(LOAD("vocab/kanji.csv"));
    keyboard.verbes = await TO_MAP(LOAD("vocab/verbes.csv"));
}

function TRADUIT(input){
    let result = "";
    let i = 0;
    const maps = [keyboard.verbes, keyboard.kanji, keyboard.hiragana, keyboard.katakana];
    while (i < input.length) {
        let matchFound = false;
        for (const map of maps) {
            for (const key of map.keys()) {
                if (input.slice(i, i + key.length) === key) {
                    result += map.get(key);
                    i += key.length;
                    matchFound = true;
                    break;
                }
            }
            if (matchFound) break;
        }
        if (!matchFound) {
            result += input[i];
            i++;
        }
    }
    return result;
}

function updateTranslation() {
    const input = document.getElementById('input').value; // Récupère le texte de l'input
    const translatedText = TRADUIT(input); // Traduction du texte
    document.getElementById('translatedText').textContent = translatedText; // Affiche la traduction
}

window.onload = async function() {
    await LOAD_KEYBOARD(); // Assure que les données sont chargées avant d'ajouter l'écouteur
    document.getElementById('input').addEventListener('input', updateTranslation);
};