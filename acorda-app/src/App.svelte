<script>
    import "./app.css";
    import {
        emotionPacks,
        getDynamicOptions,
        CHROMATIC_SCALE,
    } from "./lib/harmony.js";
    import {
        initAudio,
        playChord,
        playProgression,
    } from "./lib/audioEngine.js";

    // Importamos nuestros nuevos componentes visuales
    import ProgressionCanvas from "./lib/ProgressionCanvas.svelte";
    import SmartPalette from "./lib/SmartPalette.svelte";
    import Piano from "./lib/Piano.svelte";

    // ESTADO DE LA APLICACIÓN
    let currentProgression = [];
    const MAX_CHORDS = 4;
    let hasStarted = false;
    let isLoading = false;
    let activeNotes = [];
    let chordComplexity = "triad";

    let selectedVibeId = "melancholy";
    let selectedRoot = "C";

    $: isComplete = currentProgression.length === MAX_CHORDS;
    $: currentOptions =
        hasStarted && !isComplete
            ? getDynamicOptions(
                  selectedVibeId,
                  currentProgression.length,
                  selectedRoot,
                  chordComplexity,
              )
            : [];

    // LÓGICA MUSICAL
    async function handleStart() {
        isLoading = true;
        await initAudio();
        isLoading = false;
        hasStarted = true;
        const opcionesIniciales = getDynamicOptions(
            selectedVibeId,
            0,
            selectedRoot,
        );
        handleAddChord({ detail: opcionesIniciales[0] }); // Simulamos el evento
    }

    function handleAddChord(event) {
        const option = event.detail; // Svelte pasa los datos en event.detail
        if (isComplete) return;
        currentProgression = [...currentProgression, option];
        activeNotes = option.notes;
        playChord(option.notes);
    }

    function handleUndo() {
        if (currentProgression.length === 0) return;
        currentProgression = currentProgression.slice(0, -1);
        if (currentProgression.length > 0) {
            const lastChord = currentProgression[currentProgression.length - 1];
            activeNotes = lastChord.notes;
            playChord(lastChord.notes);
        } else {
            activeNotes = [];
        }
    }

    async function handlePlayFull() {
        await playProgression(currentProgression, (notasDelAcordeActual) => {
            activeNotes = notasDelAcordeActual;
        });
    }

    function handleReset() {
        currentProgression = [];
        activeNotes = [];
        hasStarted = false;
    }
</script>

<main class="studio-layout">
    <div class="left-panel">
        <header>
            <h2>Acorda</h2>
            <p>Construye tu secuencia armónica</p>
        </header>

        <ProgressionCanvas
            progression={currentProgression}
            maxChords={MAX_CHORDS}
            {isComplete}
            on:play={handlePlayFull}
            on:reset={handleReset}
        />

        {#if hasStarted}
            <div class="piano-section">
                <h4 class="section-title">VOICING</h4>
                <Piano {activeNotes} />
            </div>
        {/if}
    </div>

    <div class="right-panel">
        <SmartPalette
            {hasStarted}
            {isLoading}
            {isComplete}
            {emotionPacks}
            chromaticScale={CHROMATIC_SCALE}
            {currentOptions}
            progressionLength={currentProgression.length}
            bind:selectedVibeId
            bind:selectedRoot
            bind:chordComplexity
            on:start={handleStart}
            on:selectChord={handleAddChord}
            on:undo={handleUndo}
        />
    </div>
</main>

<style>
    /* El CSS que define la estructura dividida estilo Studio */
    .studio-layout {
        display: grid;
        grid-template-columns: 1.2fr 1fr; /* Izquierda más grande que la derecha */
        gap: 3rem;
        max-width: 1100px;
        margin: 3rem auto;
        padding: 0 2rem;
        align-items: start; /* Para que los paneles no se estiren innecesariamente */
    }

    /* Panel Izquierdo */
    .left-panel header h2 {
        font-size: 2.5rem;
        font-weight: 800;
        margin: 0 0 0.5rem 0;
        letter-spacing: -1px;
    }
    .left-panel header p {
        color: var(--text-muted);
        font-size: 1.1rem;
    }

    .piano-section {
        margin-top: 3rem;
    }
    .section-title {
        font-size: 0.9rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-muted);
        margin-bottom: 1rem;
    }

    /* Responsividad: En pantallas pequeñas, se apilan verticalmente */
    @media (max-width: 850px) {
        .studio-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
    }
</style>
