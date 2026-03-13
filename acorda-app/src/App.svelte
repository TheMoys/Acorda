<script>
    import { chordDictionary } from "./lib/harmony.js";
    import {
        initAudio,
        playChord,
        playProgression,
    } from "./lib/audioEngine.js";

    let currentProgression = [];
    const MAX_CHORDS = 4;
    let hasStarted = false;
    let isLoading = false;

    // Reactividad mágica de Svelte: Estas variables se recalculan solas
    $: lastChord = currentProgression[currentProgression.length - 1];
    $: currentOptions = lastChord ? chordDictionary[lastChord].next : [];
    $: isComplete = currentProgression.length === MAX_CHORDS;

    async function handleStart() {
        isLoading = true; // Activas el estado de carga
        await initAudio(); // El código se pausa aquí hasta descargar el piano
        isLoading = false; // Desactivas el estado de carga
        hasStarted = true;
        addChord("Am");
    }

    function addChord(chordName) {
        if (isComplete) return;
        currentProgression = [...currentProgression, chordName]; // Actualizamos el array
        playChord(chordDictionary[chordName].notes);
    }

    async function handlePlayFull() {
        await playProgression(currentProgression, chordDictionary);
    }

    function handleReset() {
        currentProgression = [];
        hasStarted = false;
    }
</script>

<main>
    <h2>acorda: melancholy mode</h2>
    <p>Build your 4-chord progression.</p>

    {#if !hasStarted}
        <button class="btn-primary" on:click={handleStart} disabled={isLoading}>
            {isLoading
                ? "Cargando piano de cola..."
                : "Start with A minor (Am)"}
        </button>
    {/if}

    {#if hasStarted && !isComplete}
        <div class="options-container">
            {#each currentOptions as option}
                <button on:click={() => addChord(option.target)}>
                    {option.label} ({option.target})
                </button>
            {/each}
        </div>
    {/if}

    <div class="history">
        {#each Array(MAX_CHORDS) as _, i}
            <span>{currentProgression[i] || "_"}</span>
        {/each}
    </div>

    {#if isComplete}
        <div class="controls">
            <button class="btn-play" on:click={handlePlayFull}
                >▶ Play Song</button
            >
            <button class="btn-reset" on:click={handleReset}>Start Over</button>
        </div>
    {/if}
</main>

<style>
    main {
        font-family: sans-serif;
        text-align: center;
        max-width: 600px;
        margin: 2rem auto;
    }
    .options-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
    }
    .controls {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 30px;
    }

    button {
        padding: 1rem;
        font-size: 1.1rem;
        cursor: pointer;
        border-radius: 8px;
        border: 1px solid #ccc;
        background: white;
        transition: background 0.2s;
    }
    button:hover {
        background: #f0f0f0;
    }

    .btn-primary {
        background: #e0e7ff;
        border-color: #a5b4fc;
        font-weight: bold;
    }
    .btn-play {
        background: #dcfce3;
        border-color: #86efac;
        font-weight: bold;
    }
    .btn-reset {
        background: #fee2e2;
        border-color: #fca5a5;
    }

    .history {
        margin: 2rem 0;
        font-size: 1.5rem;
        color: #333;
        font-weight: bold;
        letter-spacing: 0.5rem;
    }
</style>
