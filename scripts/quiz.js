// DONE : ?
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

export function QUIZ(){

}