// src/lib/harmony.js

export const CHROMATIC_SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const SCALE_FORMULAS = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10]
};

// Fíjate que ya no tienen la nota "root" forzada
export const emotionPacks = {
    melancholy: { id: "melancholy", name: "Melancolía", type: "minor" },
    epic:       { id: "epic", name: "Épico", type: "minor" },
    joyful:     { id: "joyful", name: "Alegría", type: "major" }
};

function getNoteIndex(noteName) {
    return CHROMATIC_SCALE.indexOf(noteName);
}

function calculateScale(rootNote, scaleType) {
    const rootIndex = getNoteIndex(rootNote);
    return SCALE_FORMULAS[scaleType].map(interval => {
        const noteIndex = (rootIndex + interval) % 12;
        return CHROMATIC_SCALE[noteIndex];
    });
}

function buildTriad(scaleNotes, degree, octave = 3) {
    const root = scaleNotes[(degree - 1) % 7];
    const third = scaleNotes[(degree + 1) % 7];
    const fifth = scaleNotes[(degree + 3) % 7];
    return [`${root}${octave}`, `${third}${octave}`, `${fifth}${octave+1}`];
}

// Ahora la función requiere saber la nota base (rootNote)
export function getDynamicOptions(emotionId, currentProgressionLength, rootNote) {
    const emotion = emotionPacks[emotionId];
    // Calculamos la escala dinámicamente desde la nota que elija el usuario
    const scaleNotes = calculateScale(rootNote, emotion.type);
    
    let options = [];

    if (emotion.type === "minor") {
        options = [
            { label: "Establecer base", functionName: "Tónica", numeral: "i", chordName: scaleNotes[0] + "m", notes: buildTriad(scaleNotes, 1) },
            { label: "Dar un respiro", functionName: "Subdominante", numeral: "iv", chordName: scaleNotes[3] + "m", notes: buildTriad(scaleNotes, 4) },
            { label: "Añadir tensión", functionName: "Dominante", numeral: "V", chordName: scaleNotes[4], notes: buildTriad(scaleNotes, 5) }, 
            { label: "Ir a la luz", functionName: "Relativo Mayor", numeral: "III", chordName: scaleNotes[2], notes: buildTriad(scaleNotes, 3) }
        ];
    } else if (emotion.type === "major") {
        options = [
            { label: "Establecer base", functionName: "Tónica", numeral: "I", chordName: scaleNotes[0], notes: buildTriad(scaleNotes, 1) },
            { label: "Abrir el sonido", functionName: "Subdominante", numeral: "IV", chordName: scaleNotes[3], notes: buildTriad(scaleNotes, 4) },
            { label: "Añadir energía", functionName: "Dominante", numeral: "V", chordName: scaleNotes[4], notes: buildTriad(scaleNotes, 5) },
            { label: "Toque nostalgia", functionName: "Relativo Menor", numeral: "vi", chordName: scaleNotes[5] + "m", notes: buildTriad(scaleNotes, 6) }
        ];
    }

    if (currentProgressionLength === 3) {
        if (emotion.type === "minor") {
            options = [
                { label: "Resolución Definitiva", functionName: "Tónica", numeral: "i", chordName: scaleNotes[0] + "m", notes: buildTriad(scaleNotes, 1) },
                { label: "Final Sorpresa", functionName: "Subdominante", numeral: "VI", chordName: scaleNotes[5], notes: buildTriad(scaleNotes, 6) },
                { label: "Preparar el Bucle", functionName: "Dominante", numeral: "V", chordName: scaleNotes[4], notes: buildTriad(scaleNotes, 5) }
            ];
        } else {
            options = [
                { label: "Resolución Definitiva", functionName: "Tónica", numeral: "I", chordName: scaleNotes[0], notes: buildTriad(scaleNotes, 1) },
                { label: "Final Melancólico", functionName: "Relativo Menor", numeral: "vi", chordName: scaleNotes[5] + "m", notes: buildTriad(scaleNotes, 6) },
                { label: "Preparar el Bucle", functionName: "Dominante", numeral: "V", chordName: scaleNotes[4], notes: buildTriad(scaleNotes, 5) }
            ];
        }
    }

    return options;
}