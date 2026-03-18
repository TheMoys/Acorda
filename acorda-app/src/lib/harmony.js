export const CHROMATIC_SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const SCALE_FORMULAS = {
    major: [0, 2, 4, 5, 7, 9, 11], // Jónico (Alegre estándar)
    minor: [0, 2, 3, 5, 7, 8, 10], // Eólico (Melancólico estándar)
    lydian: [0, 2, 4, 6, 7, 9, 11], // Lidio: Como el mayor, pero con la 4ta aumentada (Mágico/Flotante)
    dorian: [0, 2, 3, 5, 7, 9, 10], // Dórico: Como el menor, pero con la 6ta mayor (Agridulce/Nostálgico)
    phrygian: [0, 1, 3, 5, 7, 8, 10]  // Frigio: Como el menor, pero con la 2da bemol (Oscuro/Tenso)
};

export const emotionPacks = {
    joyful: { id: "joyful", name: "Alegría Pop", type: "major" },
    melancholy: { id: "melancholy", name: "Melancolía", type: "minor" },
    epic: { id: "epic", name: "Épico", type: "minor" },
    dreamy: { id: "dreamy", name: "Fantasía Ghibli", type: "lydian" },
    nostalgic: { id: "nostalgic", name: "Noche de Lluvia", type: "dorian" },
    dark: { id: "dark", name: "Tensión Cinematográfica", type: "phrygian" }
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

export function buildChord(scaleNotes, degree, complexity = "triad", octave = 3) {
    const root = scaleNotes[(degree - 1) % 7];
    const third = scaleNotes[(degree + 1) % 7];
    const fifth = scaleNotes[(degree + 3) % 7];

    // Por defecto, construimos la tríada estándar
    let notes = [`${root}${octave}`, `${third}${octave}`, `${fifth}${octave + 1}`];

    // Si pedimos añadir color, calculamos la séptima nota de la escala
    if (complexity === "seventh") {
        const seventh = scaleNotes[(degree + 5) % 7];
        notes.push(`${seventh}${octave + 1}`);
    }
    // Si pedimos suspender, cambiamos la 3ra por la 2da
    else if (complexity === "sus2") {
        const second = scaleNotes[(degree) % 7];
        notes[1] = `${second}${octave}`;
    }

    return notes;
}

export function getDynamicOptions(emotionId, currentProgressionLength, rootNote) {
    const emotion = emotionPacks[emotionId];
    // Calculamos la escala dinámicamente desde la nota que elija el usuario
    const scaleNotes = calculateScale(rootNote, emotion.type);

    let options = [];

    if (emotion.type === "major" || emotion.type === "lydian") {
        options = [
            { label: "Establecer base", functionName: "Tónica", numeral: "I", chordName: scaleNotes[0], notes: buildChord(scaleNotes, 1) },
            { label: "Abrir el sonido", functionName: "Subdominante", numeral: "IV", chordName: scaleNotes[3], notes: buildChord(scaleNotes, 4) },
            { label: "Añadir energía", functionName: "Dominante", numeral: "V", chordName: scaleNotes[4], notes: buildChord(scaleNotes, 5) },
            { label: "Toque nostalgia", functionName: "Relativo Menor", numeral: "vi", chordName: scaleNotes[5] + "m", notes: buildChord(scaleNotes, 6) }
        ];
    }
    // Agrupamos todos los Menores y sus variantes
    else if (emotion.type === "minor" || emotion.type === "dorian" || emotion.type === "phrygian") {
        options = [
            { label: "Establecer base", functionName: "Tónica", numeral: "i", chordName: scaleNotes[0] + "m", notes: buildChord(scaleNotes, 1) },
            { label: "Dar un respiro", functionName: "Subdominante", numeral: "iv", chordName: scaleNotes[3] + "m", notes: buildChord(scaleNotes, 4) },
            { label: "Añadir tensión", functionName: "Dominante", numeral: "V", chordName: scaleNotes[4], notes: buildChord(scaleNotes, 5) },
            { label: "Ir a la luz", functionName: "Relativo Mayor", numeral: "III", chordName: scaleNotes[2], notes: buildChord(scaleNotes, 3) }
        ];
    }

    if (currentProgressionLength === 3) {
        if (emotion.type === "minor") {
            options = [
                { label: "Resolución Definitiva", functionName: "Tónica", numeral: "i", chordName: scaleNotes[0] + "m", notes: buildChord(scaleNotes, 1) },
                { label: "Final Sorpresa", functionName: "Subdominante", numeral: "VI", chordName: scaleNotes[5], notes: buildChord(scaleNotes, 6) },
                { label: "Preparar el Bucle", functionName: "Dominante", numeral: "V", chordName: scaleNotes[4], notes: buildChord(scaleNotes, 5) }
            ];
        } else {
            options = [
                { label: "Resolución Definitiva", functionName: "Tónica", numeral: "I", chordName: scaleNotes[0], notes: buildChord(scaleNotes, 1) },
                { label: "Final Melancólico", functionName: "Relativo Menor", numeral: "vi", chordName: scaleNotes[5] + "m", notes: buildChord(scaleNotes, 6) },
                { label: "Preparar el Bucle", functionName: "Dominante", numeral: "V", chordName: scaleNotes[4], notes: buildChord(scaleNotes, 5) }
            ];
        }
    }

    return options;
}