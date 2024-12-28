let keyboard = {
    hiragana: new Map(),
    katakana: new Map(),
    kanji: new Map(),
    verbes: new Map()
};
let quiz = new Map();


export async function LOAD_QUIZ(chemins) {
    try {
        const tmp = await LOAD(chemins);
        quiz.clear();
        const newMap = TO_MAP(tmp);
        for (const [key, value] of newMap) {
            quiz.set(key, value);
        }
    } catch (error) {
        console.error("Erreur lors du chargement des traductions :", error);
    }
}

export async function LOAD_KEYBOARD(){
    const chemins = ["chemin1","chemin2","chemin3","chemin4"];
    keyboard.hiragana = await TO_MAP(LOAD(chemin1));
    keyboard.katakana = await TO_MAP(LOAD(chemin2));
    keyboard.kanji = await TO_MAP(LOAD(chemin3));
    keyboard.Verbes = await TO_MAP(LOAD(chemin4));
    
}

export function TRADUIT(input) {
    let result = "";
    let i = 0;
    const sortedKeys = Array.from(dico.keys()).sort((a, b) => b.length - a.length);
    while (i < input.length) {
        let matchFound = false;
        for (let key of sortedKeys) {
            if (input.slice(i, i + key.length) === key) {
                result += dico.get(key);
                i += key.length;
                matchFound = true;
                break;
            }
        }
        if (!matchFound) {
            result += input[i];
            i++;
        }
    }
    return result;
}