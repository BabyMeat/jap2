// DONE.
import { LOAD } from "./LOAD";
import { TO_MAP } from "./LOAD";

// VARIABLES :
let keyboard = {
    verbes: new Map(),
    kanji: new Map(),
    hiragana: new Map(),
    katakana: new Map()
};

async function LOAD_KEYBOARD(){
    const chemins = ["chemin1","chemin2","chemin3","chemin4"];
    keyboard.hiragana = await TO_MAP(LOAD(chemins[0]));
    keyboard.katakana = await TO_MAP(LOAD(chemins[1]));
    keyboard.kanji = await TO_MAP(LOAD(chemins[2]));
    keyboard.verbes = await TO_MAP(LOAD(chemins[3]));
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