import {loadKANA} from './init_kana.js';

// Variables : 
const rep = 5;
var check_reponse = "";
var reponses_correctes = 0;
var reponses_totales = 0;
//var mauvaises_reponses = [];

// QUIZZZZ :
async function quiz(){
    console.log("window loading ...");
    await loadKANA();
    tableau_roma_kana = QuizApp.tableau_roma_kana;
    assoc_roma_kana = QuizApp.assoc_roma_kana;
    ready();
    
}
window.onload = quiz;

function ready(){
    
}









// ROMAJI TO KANA CONVERTER : TODO ???
function convertToKana(input, association) {
    let result = "";
    let i = 0;

    while (i < input.length) {
        let matched = false;

        // Tester d'abord les sous-chaînes de longueur décroissante
        for (let len = 4; len > 0; len--) {
            const substring = input.substring(i, i + len);
            if (romajiToKana.has(substring)) {
                result += romajiToKana.get(substring); // Ajouter le kana
                i += len; // Avancer dans la chaîne
                matched = true;
                break;
            }
        }
        // Si aucune correspondance n'est trouvée
        if (!matched) {
            result += input[i]; // Ajouter le caractère tel quel
            i++;
        }
    }
    return result;
}