// Table de correspondance romaji → kana
const kanas = ['あああああ','いいいいい'];
const roma = ['aaaaa','iiiii'];


// Chaîne à deviner (générée aléatoirement)
let kanaToGuess = generateRandomKana();

// Variables pour le suivi du score
let totalCorrect = 0; // Nombre de réponses correctes
let totalPossible = 0; // Nombre total de réponses possibles (toujours un multiple de 5)
const errorMap = new Map(); // Stocker les erreurs par kana

// Fonction pour convertir une chaîne de romaji en kana
function convertToKana(input) {
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

        // Si aucune correspondance n'est trouvée, ajouter le caractère tel quel
        if (!matched) {
            result += input[i];
            i++;
        }
    }

    return result;
}

// Fonction pour vérifier les réponses et colorier les résultats
function checkAnswers(userInput) {
    const feedback = document.getElementById("feedback");

    let coloredText = "";
    let correctCount = 0;

    // Vérifier chaque caractère et colorier en conséquence
    for (let i = 0; i < kanaToGuess.length; i++) {
        const expectedKana = kanaToGuess[i];
        const userKana = convertToKana(userInput)[i] || ''; // Convertir l'entrée et prendre le i-ème caractère

        if (userKana === expectedKana) {
            coloredText += `<span style="color:green">${userKana}</span>`;
            correctCount++;
        } else {
            coloredText += `<span style="color:red">${userKana || "_"}</span>`;

            // Mettre à jour le compteur d'erreurs pour ce kana
            if (errorMap.has(expectedKana)) {
                errorMap.set(expectedKana, errorMap.get(expectedKana) + 1);
            } else {
                errorMap.set(expectedKana, 1);
            }
        }
    }

    feedback.innerHTML = coloredText; // Mettre à jour l'affichage du feedback

    // Mettre à jour les scores
    totalCorrect += correctCount; // Ajouter les bonnes réponses
    totalPossible += kanaToGuess.length; // Toujours +5 car 5 kana
    updateScore();
    updateErrorMapDisplay();
}

// Fonction pour afficher la chaîne à deviner
function displayKana() {
    const questionElement = document.getElementById("question");
    questionElement.textContent = kanaToGuess; // Affiche la chaîne à deviner
}

// Fonction pour réinitialiser la question
function resetQuestion() {
    kanaToGuess = generateRandomKana(); // Générer une nouvelle chaîne
    document.getElementById("answer").value = ""; // Effacer l'entrée utilisateur
    document.getElementById("feedback").innerHTML = ""; // Réinitialiser le feedback
    displayKana(); // Affiche la nouvelle chaîne
}

// Fonction pour mettre à jour le score
function updateScore() {
    const scoreElement = document.getElementById("score");
    const percentage = totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : 0;
    scoreElement.textContent = `Score : ${percentage}% (${totalCorrect}/${totalPossible})`;
}

// Fonction pour afficher les erreurs dans la section "resultat"
function updateErrorMapDisplay() {
    const resultatElement = document.getElementById("resultat");
    let errorList = "<h3>Erreurs fréquentes :</h3>";

    // Trier la Map des erreurs par nombre décroissant d'erreurs
    const sortedErrors = Array.from(errorMap.entries()).sort((a, b) => b[1] - a[1]);

    for (const [kana, count] of sortedErrors) {
        errorList += `<p>${kana} : ${count} erreurs</p>`;
    }

    resultatElement.innerHTML = errorList; // Mettre à jour l'affichage
}

// Variable d'état pour suivre l'action actuelle (vérification ou nouvelle question)
let isCheckingAnswer = true;

// Ajouter un écouteur pour détecter l'appui sur Entrée
document.getElementById("answer").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const userInput = document.getElementById("answer").value; // Récupérer la saisie utilisateur

        if (isCheckingAnswer) {
            checkAnswers(userInput); // Vérifier et afficher les résultats
        } else {
            resetQuestion(); // Réinitialiser pour une nouvelle question
        }

        // Basculer l'état pour la prochaine action
        isCheckingAnswer = !isCheckingAnswer;
    }
});

// Initialiser l'affichage de la question
window.onload = () => {
    displayKana(); // Affiche la chaîne à deviner au chargement
    updateScore(); // Initialiser le score
    updateErrorMapDisplay(); // Afficher la Map des erreurs
};


// AFFICHAGE JOLI ERREURS : 

let errors = new Map(); // Map pour stocker les erreurs

// Fonction pour mettre à jour l'affichage des erreurs
function updateErrorDisplay() {
    const resultatsErreursDiv = document.getElementById("resultats-erreurs");
    const erreursContainer = document.querySelector(".erreurs-container");

    erreursContainer.innerHTML = ""; // Réinitialiser le conteneur d'erreurs

    // Ajouter les boîtes d'erreur
    for (const [kana, data] of errors.entries()) {
        const erreurBox = document.createElement("div");
        erreurBox.classList.add("erreur-box");

        // Afficher le kana
        const kanaText = document.createElement("div");
        kanaText.textContent = kana;
        kanaText.classList.add("kana");
        erreurBox.appendChild(kanaText);

        // Afficher le romaji correspondant
        const romajiText = document.createElement("div");
        romajiText.textContent = data.romaji;
        romajiText.classList.add("romaji");
        erreurBox.appendChild(romajiText);

        // Afficher le nombre d'erreurs
        const countText = document.createElement("div");
        countText.textContent = `${data.count} erreur${data.count > 1 ? "s" : ""}`;
        countText.classList.add("error-count");
        erreurBox.appendChild(countText);

        // Ajouter la boîte au conteneur
        erreursContainer.appendChild(erreurBox);
    }

    // Afficher la section des erreurs
    resultatsErreursDiv.style.display = "block";
}

// Fonction pour traiter la saisie de l'utilisateur et vérifier la réponse
function handleUserInput(event) {
    const userInput = event.target.value;
    const questionText = document.getElementById("question").textContent;
    let correctAnswer = true;

    // Compare la réponse de l'utilisateur avec la bonne réponse (la question)
    const kanaArray = questionText.split('');
    const userKanaArray = convertToKana(userInput).split('');

    // Vérifier chaque kana
    kanaArray.forEach((kana, index) => {
        if (userKanaArray[index] !== kana) {
            correctAnswer = false;

            // Mettre à jour les erreurs
            if (errors.has(kana)) {
                errors.get(kana).count++;
            } else {
                errors.set(kana, { romaji: romajiToKana.get(kana), count: 1 });
            }
        }
    });

    // Si la réponse est correcte, on passe à la question suivante
    if (correctAnswer) {
        // Mise à jour du score (optionnel)
        // Affichage du score si nécessaire
        // Générer une nouvelle question après une bonne réponse
    }

    // Afficher les erreurs après une tentative
    updateErrorDisplay();
}

// Ajouter un écouteur d'événements pour la touche "Entrée"
document.getElementById("answer").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleUserInput(event);
    }
});