// Path pour le nom de version
const versionNamePATH = "meta/version";

// focntion affichage version
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

// INITIALISATION DE LA PAGE : ............................................
function windowLoad() {
    // Initialisation de l'affichage
    uploadPage.style.display = 'flex';
    quizPage.style.display = 'none';
    // affichage version
    printVersion();
    // preload base
    preLoadBaseCSV();
}
window.onload = windowLoad;


// VARIABLES : ............................................................
const delimiter = ",";
const filepath = 'meta/kanji.csv';
const structure = ['kanji', 'kana', 'french', 'emoji'];
const questionTYPES = ['KanjiToKana','KanaToKanji','KanjiToFrench','KanjiToEmoji','FrenchToKanji'];
var tableau = [];
var currentQuestion = '';
var correctAnswer = "";
var emoji = "";
var scoreInt = 0;
var positivePOINTS = 10;
var negativePOINTS = -5;

// ELEMENTS HTML : ........................................................
const uploadPage = document.getElementById('UPLOAD');
const quizPage = document.getElementById('QUIZ');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const errorMessage = document.getElementById('error-message');
const output = document.getElementById('output');
const startQuizButton = document.getElementById('startQuizButton');
const answerCHECK = document.getElementById('answerCHECK');
const question = document.getElementById('question');
const symbol = document.getElementById('symbol');
const score = document.getElementById('score');


// PRECHARGEMENT DU FICHIER CSV PAR DEFAUT : ............................
function preLoadBaseCSV() {
    console.log('PRELOAD TEST 3');
    fetch(filepath)  // Assurez-vous que le chemin est correct
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            let filteredBASEDATA = filterDATA(data);
            let parsedBASEDATA = parseCSV(filteredBASEDATA, ',', structure);
            tableau = parsedBASEDATA;
            console.log('PRELOAD SUCCEDED : ', JSON.stringify(tableau, null, 2));
        })
        .catch(error => {
            console.error('Erreur lors de la lecture du fichier CSV prédéfini:', error);
        });
}

// FONCTIONS GLOBALES : ..............................................
function filterDATA(data) {
    return data
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '' && !line.startsWith('#'))
        .join('\n');
}

function parseCSV(data, delimiter, structure) {
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
function loadFile(files) {
    tableau = [];
    if (files.length === 1) {
        const file = files[0];
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    // Filtrage des données du fichier
                    const filteredData = filterDATA(e.target.result);
                    if (filteredData.trim() === '') {
                        throw new Error('Le fichier est vide.');
                    }
                    // Parsing du CSV dans un tableau d'objets
                    tableau = parseCSV(filteredData, delimiter, structure);
                    if (tableau.length <= 0) {
                        throw new Error('Aucune donnée valide trouvée dans le fichier.');
                    }
                    else if (tableau.length <= 3) {
                        throw new Error('Le fichier ne respecte pas le nombre de données minimum de 4 lignes : ' + tableau.length + ' lignes');
                    }
                    // Succès
                    errorMessage.classList.remove('error-message');
                    errorMessage.classList.add('success-message');
                    errorMessage.textContent = "Uploadé avec succès";
                    // Affichage dans l'élément HTML output
                    output.textContent = JSON.stringify(tableau, null, 2);
                    // MASQUAGE ZONE INPUT 
                    dropZone.classList.add('hidden');
                    fileInput.classList.add('hidden');

                    // AFFICHE TABLEAU :
                    console.log('Contenu du fichier:', JSON.stringify(tableau, null, 2));
                    return;
                } catch (error) {
                    // Erreur
                    errorMessage.classList.add('error-message');
                    errorMessage.classList.remove('success-message');
                    errorMessage.textContent = `Erreur: ${error.message}`;
                }
            };
            reader.onerror = () => {
                // Erreur
                errorMessage.classList.add('error-message');
                errorMessage.classList.remove('success-message');
                errorMessage.textContent = 'Erreur lors de la lecture du fichier.';
            };
            reader.readAsText(file);
        } else {
            // Erreur
            errorMessage.classList.add('error-message');
            errorMessage.classList.remove('success-message');
            errorMessage.textContent = 'Format de fichier non compatible. Veuillez importer un fichier CSV.';
        }
    } else {
        // Erreur
        errorMessage.classList.add('error-message');
        errorMessage.classList.remove('success-message');
        errorMessage.textContent = 'Veuillez déposer un seul fichier CSV à la fois.';
    }
    // Réinitialisation de l'affichage 
    output.textContent = "";
}


// Fonctions pour lancer le quiz :

function randomInt(max) {
    return Math.floor(Math.random() * max);
}
function randomQUIZ(){
    return questionTYPES[Math.floor(Math.random() * questionTYPES.length)];
}
function randomQuestion() {
    return tableau[randomInt(tableau.length)]
}
function getKanji(line) {
    return line.kanji;
}
function getKana(line) {
    return line.kana;
}
function getFrench(line) {
    return line.french;
}
function getEmoji(line) {
    return line.emoji;
}

// LOGIQUE DU QUIZ : ...............................................
function newQuestion() {
    console.log('GENERATING NEW QUESTION ...');
    question.textContent = "";
    answerCHECK.textContent = "";
    emoji = "";
    const quiz = randomQUIZ();
    const questionRANDOM = randomQuestion();
    if(quiz == 'KanjiToKana'){
        currentQuestion = getKanji(questionRANDOM);
        correctAnswer = getKana(questionRANDOM);
        //console.log('SUCCESS', currentQuestion, correctAnswer);
    }
    else if(quiz == 'KanaToKanji'){
        currentQuestion = getKana(questionRANDOM)
        correctAnswer = getKanji(questionRANDOM);
        //console.log('SUCCESS', currentQuestion, correctAnswer);
    }
    else if(quiz == 'KanjiToFrench'){
        currentQuestion = getKanji(questionRANDOM);
        correctAnswer = getFrench(questionRANDOM);
        //console.log('SUCCESS', currentQuestion, correctAnswer);
    }
    else if(quiz == 'KanjiToEmoji'){
        currentQuestion = getKana(questionRANDOM);
        correctAnswer = getEmoji(questionRANDOM);
        //console.log('SUCCESS', currentQuestion, correctAnswer);
    }
    else if(quiz == 'FrenchToKanji'){
        emoji = getEmoji(questionRANDOM);
        currentQuestion = getFrench(questionRANDOM);
        correctAnswer = getKanji(questionRANDOM);
        //console.log('SUCCESS', currentQuestion, correctAnswer);
    }
    //console.log('LOAD : ', currentQuestion, correctAnswer);
    showQuestion(quiz);
    generateRandomResponses(quiz);
} 

function showQuestion(type) {
    console.log('SHOWING QUESTION ...');
    if(type == 'KanjiToKana'){
        question.textContent = "Comment s'écrtit en Kana le Kanji suivant : ";   
    }
    else if(type == 'KanaToKanji'){
        question.textContent = "Quel est le Kanji pour le Kana suivant : ";
    }
    else if(type == 'KanjiToFrench'){
        question.textContent = "Quelle est la traduction du Kanji suivant : ";
    }
    else if(type == 'KanjiToEmoji'){
        question.textContent = "À quoi correspond le kanji suivant : ";
    }
    else if(type == 'FrenchToKanji'){
        question.textContent = "Quel est le kanji pour : ";
    }
    //console.log('Affichage du symbole : ', currentQuestion);
    symbol.textContent = currentQuestion;
    //console.log('SYMBOL TEXT CONTEN : ', symbol.textContent);
}

function generateRandomResponses(type) {
    console.log('GENERATING RESPONSES ...');
    const choices = new Set();
    choices.add(correctAnswer);
    //console.log('CHOICES LENGTH : ' + choices.size);
    while(choices.size < 4) {
        if(type == 'KanjiToKana'){
            //console.log('EQUALITY CHECK');
            choices.add(getKana(randomQuestion()));
        }
        else if(type == 'KanaToKanji'){
            //console.log('EQUALITY CHECK');
            choices.add(getKanji(randomQuestion()));
        }
        else if(type == 'KanjiToFrench'){
            //console.log('EQUALITY CHECK');
            choices.add(getFrench(randomQuestion()));
        }
        else if(type == 'KanjiToEmoji'){
            //console.log('EQUALITY CHECK');
            choices.add(getEmoji(randomQuestion()));
        }
        else if(type == 'FrenchToKanji'){
            //console.log('EQUALITY CHECK');
            choices.add(getKanji(randomQuestion()));
        }
        else {
            //console.log('Infinite Tsukuyomi');
        }
    }
    // Affiche les réponses aléatoirement
    /*
    for(let i=0;i<choices.length;i++){
        console.log('CHOICES : ' + i + " " + choices.toString());
    }
    */
    const choicesArray = Array.from(choices);
    choicesArray.sort(() => Math.random() - 0.5);
    const choiceButtons = document.querySelectorAll('.choice');
    choiceButtons.forEach((button, index) => {
        button.textContent = choicesArray[index];
    });
}

function showQuiz() {
    console.log('SHOWING QUIZ ...');
    uploadPage.style.display = 'none';
    quizPage.style.display = 'flex';
}

function startQuiz() {
    console.log('QUIZ STARTING ...');
    // Affichage du quiz
    score.textContent = scoreInt.toString();
    showQuiz();
    newQuestion();
}

// CHECK ANWSER CALL
function checkAnswer(button) {
    const selectedAnswer = button.textContent;
    if (selectedAnswer === correctAnswer) {
        answerCHECK.textContent = 'Correct!';
        scoreInt = scoreInt + positivePOINTS;
        score.textContent = scoreInt.toString();
        setTimeout(() => newQuestion(), 500);
    } else {
        answerCHECK.textContent = `Incorrect, essayez encore!`;
        scoreInt = scoreInt + negativePOINTS;
        score.textContent = scoreInt.toString();
        setTimeout(() => newQuestion(), 500);
    }
    // Possibilité de arreter le script
    /*
    if (scoreInt >= 100){
        return;
    }
    */
}

// UPLOAD CUSTOM : ..................................................
document.addEventListener('DOMContentLoaded', () => {
    // Événements pour le chargement du fichier
    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('dragover');
        loadFile(event.dataTransfer.files);
    });
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });
    fileInput.addEventListener('change', (event) => {
        loadFile(event.target.files);
    });
    // Événement pour le bouton de démarrage du quiz
    startQuizButton.addEventListener('click', startQuiz);
});