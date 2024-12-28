// DONE : ?
const versionNamePATH = "meta/version";

async function version(){
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

window.onload = version;