import * as Tone from 'tone';

let synth;

export async function initAudio() {
    if (!synth) {
        await Tone.start();
        synth = new Tone.PolySynth(Tone.Synth).toDestination();
    }
}

export function playChord(notes) {
    if (synth) {
        synth.triggerAttackRelease(notes, "2n");
    }
}

export async function playProgression(progression, dictionary) {
    await Tone.start();
    const now = Tone.now();
    
    // Configuramos un tempo virtual (cuánto dura cada acorde entero)
    const duracionAcorde = Tone.Time("1m").toSeconds(); // 1 compás entero (más lento y relajado)
    
    // Calculamos el espacio entre cada nota del arpegio
    // Si el acorde tiene 3 notas, las dividimos equitativamente en ese compás
    const velocidadArpegio = 0.3; // Segundos de diferencia entre nota y nota

    progression.forEach((chordName, indiceAcorde) => {
        const notes = dictionary[chordName].notes;
        
        // Calculamos cuándo empieza este acorde en la línea de tiempo
        const inicioAcorde = now + (indiceAcorde * duracionAcorde);

        // En lugar de tocar el bloque, iteramos sobre cada nota individualmente
        notes.forEach((nota, indiceNota) => {
            // Cada nota suena un poco más tarde que la anterior
            const inicioNota = inicioAcorde + (indiceNota * velocidadArpegio);
            
            // Hacemos que la nota sea corta y saltarina ("8n" = corchea)
            synth.triggerAttackRelease(nota, "8n", inicioNota);
        });
    });
}