const initialData = [
    { kana: 'あ', romaji: 'a', errorCount: 2 },
    { kana: 'い', romaji: 'i', errorCount: 1 }
];

const data2 = [
    { kana: 'あ', romaji: 'a', errorCount: 2 }
];


function windowLoad(){
    store();
    store2();
    show();
}
window.onload = windowLoad;

function store(){
    localStorage.setItem('kanaData', JSON.stringify(initialData));
    // affiche dans le log :
    console.log('Données initiales stockées dans localStorage.');
}

function store2(){
    localStorage.setItem('kanaData', JSON.stringify(data2));
    // affiche dans le log :
    console.log('Données initiales stockées dans localStorage.');
}

function modify(){
    // example modification nombre erreurs premiers elements.
    let storedData = JSON.parse(localStorage.getItem('kanaData'));
    if (storedData && storedData.length > 0) {
        storedData[0].errorCount = 5;
        console.log('Données après modification :', storedData);
    }
    localStorage.setItem('kanaData', JSON.stringify(storedData));
}

function clearDATA(){
    console.log('data cleared');
    localStorage.removeItem('kanaData');
}

function show() {
    console.log('show data');
    const erreursContainer = document.querySelector('.erreurs-container');
    erreursContainer.innerHTML = '';
    let storedData = JSON.parse(localStorage.getItem('kanaData'));
    if (storedData && storedData.length > 0) {
        storedData.forEach(item => {
            const errorBox = document.createElement('div');
            errorBox.classList.add('error-box'); 
            errorBox.innerHTML = `
                <h4>${item.kana} (${item.romaji})</h4>
                <p>Erreurs : ${item.errorCount}</p>
            `;
            erreursContainer.appendChild(errorBox);
        });
    } else {
        console.log('Aucune donnée trouvée dans localStorage.');
    }
}