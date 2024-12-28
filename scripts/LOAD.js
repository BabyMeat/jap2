// DONE : !

// CHARGE DATA pour QUIZ & CLAVIER :
// @param chemins : un tableau de strings contenant les chemins des fichiers csv.
// =>return : données fusionnées.
// !disclaimer : none?
export async function LOAD(chemins) {
    const mergedData = [];

    // Charger tous les fichiers en parallèle
    const results = await Promise.all(
        chemins.map(async (chemin) => {
            try {
                return await loading(chemin);
            } catch (error) {
                console.error(`Erreur lors du chargement du fichier : ${chemin}`, error);
                return null; // Retourner null si le chargement échoue
            }
        })
    );

    // Fusionner les résultats (ignorer les fichiers qui ont échoué)
    results.filter((data) => data !== null).forEach((data) => mergedData.push(...data));

    return mergedData;
}

// Tente de charger localement, puis bascule sur un chargement distant
async function loading(chemin) {
    try {
        return await local_load(chemin); // Essayer de charger localement
    } catch (localError) {
        console.warn(`Échec du chargement local pour : ${chemin}. Tentative de chargement distant.`);
        return await server_load(chemin); // En cas d'échec, charger depuis le serveur
    }
}

// Charge un fichier local avec fs
async function local_load(chemin) {
    const fs = await import("fs/promises");
    try {
        const data = await fs.readFile(chemin, "utf-8"); // Lire le fichier local
        return PARSE(data); // Parser les données (assumer que PARSE est une fonction existante)
    } catch (error) {
        throw new Error(`Erreur lors du chargement local : ${error.message}`);
    }
}

// Charge un fichier distant avec fetch
async function server_load(chemin) {
    try {
        const response = await fetch(chemin);
        if (!response.ok) {
            throw new Error(`Erreur réseau : ${response.status} ${response.statusText}`);
        }
        const data = await response.text(); // Lire le fichier distant
        return PARSE(data); // Parser les données (assumer que PARSE est une fonction existante)
    } catch (error) {
        throw new Error(`Erreur lors du chargement distant : ${error.message}`);
    }
}





// DONE.

// PARSE 1 FICHIER CSV QUELQUONQUE :
// @param chemin : string du chemin fichier csv.
// =>return : un TABLEAU d'OBJETS QUELCONQUE*.
// !disclaimer : QUELCONQUE*
//               QUELCONQUE* -> La premiere ligne du CSV défini la structure de l'objet.
export function PARSE(data){
    const filteredData = filter(data);
    const lines = filteredData.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const rows = lines.slice(1); // Exclut la première ligne (en-têtes)
    // Convertit les lignes restantes en objets
    const parsedData = rows.map(line => {
        const values = line.split(',').map(value => value.trim());
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
    return parsedData;
}

// filtre les lignes du csv 
function filter(data) {
    return data
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '' && !line.startsWith('#'))
        .join('\n');
}


// CONVERTIT TABLEAU OBJETS EN TABLEAU
// @param objets : un tableau d'objets de structure {romaji,kana} ou {romaji,kanji,furiagana??,french,picto}.
// =>return : un tableau [romaji,kana] ou [romaji,kanji].
// !disclaimer : objet*
//               objet* doit absolument avoir ROMAJI && (KANA || KANJI).
export function TO_ARRAY(objets) {
    // Vérification que "objets" est bien un tableau
    if (!Array.isArray(objets)) {
        throw new Error("Le paramètre 'objets' doit être un tableau.");
    }

    // Transforme chaque objet en tableau [romaji, ...autre_valeur]
    return objets.map(objet => {
        // Vérifie que "romaji" est présent dans l'objet
        if (!objet.romaji) {
            throw new Error("Chaque objet doit contenir une clé 'romaji'.");
        }

        // Priorité : cherche les clés spécifiques dans un ordre précis
        if (objet.kana) {
            return [objet.romaji, objet.kana];
        } else if (objet.kanji) {
            return [objet.romaji, objet.kanji];
        }

        // Si aucune clé valide n'est trouvée
        throw new Error("Chaque objet doit contenir au moins une clé 'kana' ou 'kanji'.");
    });
}

// CONVERTIT TABLEAU OBJETS EN TABLEAU
// @param objets : un tableau d'objets de structure {romaji,kana} ou {romaji,kanji,furiagana??,french,picto}.
// =>return : un tableau [romaji,kana] ou [romaji,kanji].
// !disclaimer : none ?
export function TO_MAP(objets) {
    // Vérification que "objets" est bien un tableau
    if (!Array.isArray(objets)) {
        throw new Error("Le paramètre 'objets' doit être un tableau.");
    }

    // Transforme chaque objet en tableau [romaji, ...autre_valeur]
    return objets.map(objet => {
        // Vérifie que "romaji" est présent dans l'objet
        if (!objet.romaji) {
            throw new Error("Chaque objet doit contenir une clé 'romaji'.");
        }

        // Priorité : cherche les clés spécifiques dans un ordre précis
        if (objet.kana) {
            return [objet.romaji, objet.kana];
        } else if (objet.kanji) {
            return [objet.romaji, objet.kanji];
        }

        // Si aucune clé valide n'est trouvée
        throw new Error("Chaque objet doit contenir au moins une clé 'kana' ou 'kanji'.");
    });
}