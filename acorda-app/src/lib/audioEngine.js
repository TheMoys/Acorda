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
    await Tone.start(); // Aseguramos que el contexto de audio esté activo
    const now = Tone.now();
    const duration = Tone.Time("2n").toSeconds();

    progression.forEach((chordName, index) => {
        const notes = dictionary[chordName].notes;
        synth.triggerAttackRelease(notes, "2n", now + (index * duration));
    });
}