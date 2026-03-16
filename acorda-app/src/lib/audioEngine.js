import * as Tone from 'tone';

let sampler;
let bassSynth; // Nuestro nuevo instrumento para el pulso profundo

export async function initAudio() {
    if (sampler && bassSynth) return;

    await Tone.start();

    // 1. Configuramos el piano (se queda igual)
    sampler = new Tone.Sampler({
        urls: {
            "C3": "C3.mp3",
            "C4": "C4.mp3",
            "C5": "C5.mp3"
        },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    const reverb = new Tone.Reverb({
        decay: 2.5,
        preDelay: 0.1
    }).toDestination();
    
    sampler.connect(reverb);

    // 2. Creamos el sintetizador de bajos
    // Usamos FMSynth porque tiene un sonido rico, casi metálico en graves, ideal para cine
    bassSynth = new Tone.FMSynth({
        harmonicity: 0.5,
        modulationIndex: 1.2,
        oscillator: { type: "sine" },
        modulation: { type: "sawtooth" },
        envelope: {
            attack: 0.1, // Entra suavemente, no como un golpe seco
            decay: 0.5,
            sustain: 0.5,
            release: 2
        }
    }).toDestination();
    
    // Le bajamos un poco el volumen para que no tape al piano
    bassSynth.volume.value = -8; 

    await Tone.loaded();
}

export function playChord(notes) {
    if (sampler) {
        sampler.triggerAttackRelease(notes, "1n");
        
        // Hacemos que el bajo también suene cuando pruebas un acorde suelto
        if (bassSynth && notes.length > 0) {
            // Cogemos la primera nota y le ponemos un 1 o 2 para que sea grave
            const rootNote = notes[0].replace(/[0-9]/, "1"); 
            bassSynth.triggerAttackRelease(rootNote, "1n");
        }
    }
}

export async function playProgression(progression) {
    await Tone.start();
    const now = Tone.now();
    
    const duracionAcorde = Tone.Time("1m").toSeconds(); 
    const velocidadArpegio = 0.3; 

    // Ahora iteramos sobre objetos de acordes, no sobre nombres de texto
    progression.forEach((acordeObj, indiceAcorde) => {
        // Las notas ya vienen listas dentro del objeto
        const notes = acordeObj.notes; 
        const inicioAcorde = now + (indiceAcorde * duracionAcorde);

        const rootNote = notes[0].replace(/[0-9]/, "1");
        bassSynth.triggerAttackRelease(rootNote, "1m", inicioAcorde);

        notes.forEach((nota, indiceNota) => {
            const inicioNota = inicioAcorde + (indiceNota * velocidadArpegio);
            sampler.triggerAttackRelease(nota, "2n", inicioNota);
        });
    });
}