import * as Tone from 'tone';

let sampler;

export async function initAudio() {
    // Si ya está cargado, no hacemos nada
    if (sampler) return;

    await Tone.start();

    // Creamos el Sampler apuntando a audios reales
    sampler = new Tone.Sampler({
        urls: {
            "C3": "C3.mp3",
            "C4": "C4.mp3",
            "C5": "C5.mp3"
        },
        // Usamos este repositorio público para el prototipo
        baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    // Añadimos una reverberación sutil para que el piano suene en una "habitación"
    const reverb = new Tone.Reverb({
        decay: 2.5,
        preDelay: 0.1
    }).toDestination();
    
    sampler.connect(reverb);

    // LA REGLA DE ORO: Pausamos la ejecución del código hasta que 
    // todos los mp3 se hayan descargado de internet.
    await Tone.loaded();
}

export function playChord(notes) {
    if (sampler) {
        // En un piano, las notas suenan mejor si las dejamos resonar un poco más ("1n" = redonda)
        sampler.triggerAttackRelease(notes, "1n");
    }
}

export async function playProgression(progression, dictionary) {
    await Tone.start();
    const now = Tone.now();
    
    const duracionAcorde = Tone.Time("1m").toSeconds(); 
    const velocidadArpegio = 0.3; 

    progression.forEach((chordName, indiceAcorde) => {
        const notes = dictionary[chordName].notes;
        const inicioAcorde = now + (indiceAcorde * duracionAcorde);

        notes.forEach((nota, indiceNota) => {
            const inicioNota = inicioAcorde + (indiceNota * velocidadArpegio);
            // Usamos "2n" en el arpegio para simular el pedal de resonancia del piano
            sampler.triggerAttackRelease(nota, "2n", inicioNota);
        });
    });
}