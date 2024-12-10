// Chemin Version :
const versionNamePATH = "meta/version";

// Initialisation Affichage :
/* ça crée une erreur !!!!!!
const resultat = document.getElementById('resultat');
resultat.classList.add('hidden');
*/
const structure = ['romaji','kana'];
const kana = 'vocab/kana/kana.csv';

// Variables Score :
var reponses_correctes = 0;
var reponses_totales = 0;
var mauvaises_reponses = [];

// Variables Quiz : 
const rep = 5;
var tableau_roma_kana = [];
var assoc_roma_kana = new Map();
var check_reponse = "";

// Initialisation Page :
function windowLoad() {
    async function printVersion() {
        try {
            const response = await fetch(versionNamePATH);
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut : ${response.status}`);
            }
            const text = await response.text();
            console.log(text);
        } catch (error) {
            console.error('Erreur lors de la récupération du fichier texte:', error);
        }
    }
    printVersion();
    init_variables();
    QUIZ();
}
window.onload = windowLoad;

// FONCTIONS D'INITIALISATIONS :

function init_variables(){
    function filterDATA(data) {
        return data
            .split('\n')
            .map(line => line.trim())
            .filter(line => line !== '' && !line.startsWith('#'))
            .join('\n');
    }
    function chemin_to_data(chemin) {
        console.log('PRELOADING');
        fetch(chemin)  // Assurez-vous que le chemin est correct
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    console.log('PRELOAD SUCCEDED : ', JSON.stringify(tableau, null, 2));
                    return data;
                })
                .catch(error => {
                    console.error('Erreur lors de la lecture du fichier CSV prédéfini:', error);
                });
    }
    function tableau(data, delimiter, structure) {
        const filteredLines = data.split('\n');
        const result = filteredLines.reduce((acc, line, lineIndex) => {
            const values = line.split(delimiter).map(value => value.trim());
            if (values.length === structure.length) {
                const entry = structure.reduce((obj, header, index) => {
                    obj[header] = values[index];
                    return obj;
                }, {});
                acc.push(entry);
            } else {
                const errorMessage = `Mauvaise formatation à la ligne ${lineIndex + 1}: ${line}`;
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
            return acc;
        }, []);
        return result;
    }
    function associations(data, delimiter, keyIndex, valueIndex) {
        const filteredLines = data.split('\n');
        const result = new Map();
        filteredLines.forEach((line, lineIndex) => {
            const values = line.split(delimiter).map(value => value.trim());
            if (values.length > Math.max(keyIndex, valueIndex)) {
                const key = values[valueIndex];
                const value = values[keyIndex];
                if (result.has(key)) {
                    console.warn(`Clé en double trouvée : "${key}" à la ligne ${lineIndex + 1}`);
                }
                result.set(key, value);
            } else {
                const errorMessage = `Mauvaise formatation à la ligne ${lineIndex + 1}: ${line}`;
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
        });
        return result;
    }
    // RECUPERATION DATA :
    let data_kana = filterDATA(chemin_to_data(kana));
    // INITIALISATION VARIABLES :
    tableau_roma_kana = tableau(data_kana, ',', structure);
    assoc_roma_kana = associations(data_hira, ',', structure);
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

// LOGIQUE DU QUIZ : 

function QUIZ(){
    console.log("début du quiz");
    //...
}