// Chemin Kana :
const kana = "vocab/kana/kana.csv";

// INITIALISATION VARIABLES : 
export const QuizApp = {
    tableau_roma_kana: [],
    assoc_roma_kana: new Map()
};

// MAIN - LOAD KANA :
async function loadKANA() {
    console.log("Chargement du fichier KANA...");
    let tableau = [
        { romaji: "a", kana: "あ" },
        { romaji: "i", kana: "い" },
        { romaji: "u", kana: "う" },
        { romaji: "e", kana: "え" },
        { romaji: "o", kana: "お" }
    ];
    let associations = new Map([
        ["a", "あ"],
        ["i", "い"],
        ["u", "う"],
        ["e", "え"],
        ["o", "お"]
    ]);
    QuizApp.tableau_roma_kana = tableau;
    QuizApp.assoc_roma_kana = associations;
    /*
    const structure = ["romaji", "kana"];

    // RENVOIE DATA :
    const filterDATA = (data) =>
        data
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line !== "" && !line.startsWith("#"))
            .join("\n");

    // RENVOIE UN TABLEAU :
    const tableau_CSV = (data, delimiter, structure) => {
        const filteredLines = data.split("\n");
        return filteredLines.map((line, lineIndex) => {
            const values = line.split(delimiter).map((value) => value.trim());
            if (values.length !== structure.length) {
                throw new Error(
                    `Mauvaise formatation à la ligne ${lineIndex + 1}: ${line}`
                );
            }
            return structure.reduce((entry, header, index) => {
                entry[header] = values[index];
                return entry;
            }, {});
        });
    };

    // RENVOIE UNE MAP :
    const associations_CSV = (data, delimiter, keyIndex, valueIndex) => {
        const filteredLines = data.split("\n");
        const result = new Map();
        filteredLines.forEach((line, lineIndex) => {
            const values = line.split(delimiter).map((value) => value.trim());
            if (values.length > Math.max(keyIndex, valueIndex)) {
                const key = values[valueIndex];
                const value = values[keyIndex];
                if (result.has(key)) {
                    console.warn(
                        `Clé en double trouvée : "${key}" à la ligne ${lineIndex + 1}`
                    );
                }
                result.set(key, value);
            } else {
                throw new Error(
                    `Mauvaise formatation à la ligne ${lineIndex + 1}: ${line}`
                );
            }
        });
        return result;
    };

    // CHARGEMENT DES DONNÉES :
    try {
        const response = await fetch(kana);
        if (!response.ok) {
            throw new Error("Erreur réseau !");
        }
        const data = await response.text();
        const data_kana = filterDATA(data);
        QuizApp.tableau_roma_kana = tableau_CSV(data_kana, ",", structure);
        QuizApp.assoc_roma_kana = associations_CSV(data_kana, ",", 0, 1);
        console.log("Données KANA chargées avec succès !");
    } catch (error) {
        console.error("Erreur lors du chargement des données KANA :", error);
    }
    */
}

// CHARGEMENT AU DÉMARRAGE :
loadKANA();