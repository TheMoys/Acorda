<script>
    // Svelte recibirá este arreglo desde App.svelte (ej: ["A3", "C4", "E4"])
    export let activeNotes = []; 

    // Generamos matemáticamente 2 octavas de teclas (De C3 a B4)
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const octaves = [3, 4];
    
    let keys = [];
    octaves.forEach(octave => {
        noteNames.forEach(note => {
            keys.push({
                id: `${note}${octave}`,
                isBlack: note.includes('#')
            });
        });
    });
</script>

<div class="piano-wrapper">
    <div class="piano-keyboard">
        {#each keys as key}
            <div 
                class="key {key.isBlack ? 'black' : 'white'} {activeNotes.includes(key.id) ? 'active' : ''}"
                data-note={key.id}
            >
                {#if !key.isBlack && activeNotes.includes(key.id)}
                    <span class="note-label">{key.id}</span>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .piano-wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
        overflow-x: auto; /* Por si en móviles no cabe */
        padding: 10px 0;
    }

    .piano-keyboard {
        display: flex;
        position: relative;
        height: 140px;
        background: #292524;
        padding: 4px;
        border-radius: 6px;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
    }

    /* Teclas genéricas */
    .key {
        border-radius: 0 0 4px 4px;
        cursor: default;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 8px;
        transition: background-color 0.1s ease;
    }

    /* Teclas Blancas */
    .key.white {
        width: 38px;
        height: 100%;
        background-color: #fdfbf7;
        border: 1px solid #d6d3d1;
        z-index: 1;
    }

    /* Teclas Negras (Magia de márgenes negativos) */
    .key.black {
        width: 22px;
        height: 65%;
        background-color: #292524;
        z-index: 2;
        margin-left: -11px;
        margin-right: -11px;
        border: 1px solid #1c1917;
        box-shadow: inset 0 -3px 4px rgba(255,255,255,0.2);
    }

    /* ESTADO ACTIVO (Las notas que suenan) */
    .key.white.active {
        background-color: #fde047; /* Amarillo cálido vintage */
        box-shadow: inset 0 0 10px rgba(234, 179, 8, 0.4);
    }

    .key.black.active {
        background-color: #ca8a04;
    }

    .note-label {
        font-size: 0.7rem;
        font-weight: bold;
        color: #713f12;
    }
</style>