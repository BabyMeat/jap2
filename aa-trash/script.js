// Variables Score :
let reponses_correctes = 0;
let reponses_totales = 0;
const mauvaises_reponses = [];
const tableau = [
    { kana: "あ", romaji: "a" },
    { kana: "い", romaji: "i" },
    { kana: "う", romaji: "u" },
    { kana: "え", romaji: "e" },
    { kana: "お", romaji: "o" },
    { kana: "か", romaji: "ka" },
    { kana: "き", romaji: "ki" },
    { kana: "く", romaji: "ku" },
    { kana: "け", romaji: "ke" },
    { kana: "こ", romaji: "ko" }]; 

// Variables Quiz :
const reps = 5;
var question = [];
var reponse = "";

// Fonction pour générer une nouvelle question
function genererQuestion() {
    questionKana = "";
    reponseRomaji = "";

    for (let i = 0; i < reps; i++) {
        const randomIndex = Math.floor(Math.random() * tableau.length);
        questionKana += tableau[randomIndex].kana; // Concaténer les kana
        reponseRomaji += tableau[randomIndex].romaji; // Concaténer les romaji
    }

    // Afficher la question
    document.getElementById("question").textContent = questionKana;
}

// Fonction pour vérifier la réponse de l'utilisateur
function verifierReponse() {
    const userAnswer = document.getElementById("answer").value.trim();

    reponses_totales++;
    if (userAnswer === reponseRomaji) {
        reponses_correctes++;
        alert("Bonne réponse !");
    } else {
        alert(`Mauvaise réponse. La bonne réponse était : ${reponseRomaji}`);
        mauvaises_reponses.push({ question: questionKana, reponseAttendue: reponseRomaji, reponseDonnee: userAnswer });
    }

    // Mettre à jour le score
    document.getElementById("score").textContent = `Score : ${reponses_correctes}/${reponses_totales}`;

    // Générer une nouvelle question
    genererQuestion();
    document.getElementById("answer").value = ""; // Réinitialiser l'input
}

// Lancer le quiz au chargement de la page
window.onload = function () {
    genererQuestion();

    // Ajouter un gestionnaire d'événement pour l'entrée utilisateur
    const input = document.getElementById("answer");
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            verifierReponse();
        }
    });
};