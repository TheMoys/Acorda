// 1. Constantes fundamentales de la teoría musical
const CHROMATIC_SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const SCALE_FORMULAS = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10]
};

// 2. Definición de nuestras emociones (Solo metadatos, no hay notas hardcodeadas)
export const emotionPacks = {
    melancholy: { id: "melancholy", name: "Melancholy (Minor)", root: "A", type: "minor" },
    epic:       { id: "epic", name: "Epic (Minor)", root: "E", type: "minor" },
    joyful:     { id: "joyful", name: "Joyful (Major)", root: "C", type: "major" }
};

// 3. Funciones matemáticas del motor
function getNoteIndex(noteName) {
    return CHROMATIC_SCALE.indexOf(noteName);
}

// Calcula las 7 notas de cualquier escala
function calculateScale(rootNote, scaleType) {
    const rootIndex = getNoteIndex(rootNote);
    return SCALE_FORMULAS[scaleType].map(interval => {
        const noteIndex = (rootIndex + interval) % 12;
        return CHROMATIC_SCALE[noteIndex];
    });
}

// Construye un acorde (tríada) a partir de un grado de la escala (1 al 7)
function buildTriad(scaleNotes, degree, octave = 3) {
    // Los grados en música se basan en saltos de tercera (índices 0, 2, 4 en el array)
    const root = scaleNotes[(degree - 1) % 7];
    const third = scaleNotes[(degree + 1) % 7];
    const fifth = scaleNotes[(degree + 3) % 7];
    
    // Simplificación matemática para la octava en el prototipo
    return [`${root}${octave}`, `${third}${octave}`, `${fifth}${octave+1}`];
}

// 4. El Orquestador Dinámico de Opciones
// Esta función decide qué acordes sugerir basándose en el modo (mayor/menor)
export function getDynamicOptions(emotionId, currentProgressionLength) {
    const emotion = emotionPacks[emotionId];
    const scaleNotes = calculateScale(emotion.root, emotion.type);
    
    let options = [];

    if (emotion.type === "minor") {
        options = [
            { label: "Establecer base", functionName: "Tónica", numeral: "i", chordName: scaleNotes[0] + "m", notes: buildTriad(scaleNotes, 1) },
            { label: "Dar un respiro", functionName: "Subdominante", numeral: "iv", chordName: scaleNotes[3] + "m", notes: buildTriad(scaleNotes, 4) },
            // Usamos el grado V mayor en escalas menores porque genera mucha mejor tensión armónica
            { label: "Añadir tensión", functionName: "Dominante", numeral: "V", chordName: scaleNotes[4], notes: buildTriad(scaleNotes, 5) }, 
            { label: "Ir a la luz", functionName: "Relativo Mayor", numeral: "III", chordName: scaleNotes[2], notes: buildTriad(scaleNotes, 3) }
        ];
    } else if (emotion.type === "major") {
        options = [
            { label: "Establecer base", functionName: "Tónica", numeral: "I", chordName: scaleNotes[0], notes: buildTriad(scaleNotes, 1) },
            { label: "Abrir el sonido", functionName: "Subdominante", numeral: "IV", chordName: scaleNotes[3], notes: buildTriad(scaleNotes, 4) },
            { label: "Añadir energía", functionName: "Dominante", numeral: "V", chordName: scaleNotes[4], notes: buildTriad(scaleNotes, 5) },
            { label: "Toque de nostalgia", functionName: "Relativo Menor", numeral: "vi", chordName: scaleNotes[5] + "m", notes: buildTriad(scaleNotes, 6) }
        ];
    }

    if (currentProgressionLength === 3) {
        if (emotion.type === "minor") {
            options = [
                { label: "Resolución Definitiva", functionName: "Tónica", numeral: "i", chordName: scaleNotes[0] + "m", notes: buildTriad(scaleNotes, 1) },
                { label: "Final Sorpresa", functionName: "Subdominante", numeral: "VI", chordName: scaleNotes[5], notes: buildTriad(scaleNotes, 6) },
                // Añadimos la tensión para que el bucle pueda volver a empezar
                { label: "Preparar el Bucle", functionName: "Dominante", numeral: "V", chordName: scaleNotes[4], notes: buildTriad(scaleNotes, 5) }
            ];
        } else {
            options = [
                { label: "Resolución Definitiva", functionName: "Tónica", numeral: "I", chordName: scaleNotes[0], notes: buildTriad(scaleNotes, 1) },
                { label: "Final Melancólico", functionName: "Relativo Menor", numeral: "vi", chordName: scaleNotes[5] + "m", notes: buildTriad(scaleNotes, 6) },
                // Añadimos la tensión para que el bucle pueda volver a empezar
                { label: "Preparar el Bucle", functionName: "Dominante", numeral: "V", chordName: scaleNotes[4], notes: buildTriad(scaleNotes, 5) }
            ];
        }
    }

    return options;
}