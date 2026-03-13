<script>
    import { emotionPacks } from './lib/harmony.js';
    import { initAudio, playChord, playProgression } from './lib/audioEngine.js';

    let currentProgression = [];
    const MAX_CHORDS = 4;
    let hasStarted = false;
    let isLoading = false;
    
    // Nueva variable para controlar la emoción seleccionada
    let selectedVibeId = "melancholy"; 

    // Reactividad: Svelte recalcula esto automáticamente si cambia selectedVibeId
    $: activePack = emotionPacks[selectedVibeId];
    $: activeDictionary = activePack.dictionary;
    
    $: lastChord = currentProgression[currentProgression.length - 1];
    $: currentOptions = lastChord ? activeDictionary[lastChord].next : [];
    $: isComplete = currentProgression.length === MAX_CHORDS;

    async function handleStart() {
        isLoading = true;
        await initAudio();
        isLoading = false;
        hasStarted = true;
        // Arrancamos con el acorde base de la emoción elegida
        addChord(activePack.startChord);
    }

    function addChord(chordName) {
        if (isComplete) return;
        currentProgression = [...currentProgression, chordName];
        playChord(activeDictionary[chordName].notes);
    }

    async function handlePlayFull() {
        // Le pasamos el diccionario activo para que el motor sepa qué notas tocar
        await playProgression(currentProgression, activeDictionary);
    }

    function handleReset() {
        currentProgression = [];
        hasStarted = false;
    }
</script>

<main>
    <h2>acorda</h2>
    <p>Select a vibe and build your 4-chord progression.</p>

    {#if !hasStarted}
        <div class="vibe-selector">
            <label for="vibe">Choose Emotion:</label>
            <select id="vibe" bind:value={selectedVibeId} disabled={isLoading}>
                {#each Object.entries(emotionPacks) as [id, pack]}
                    <option value={id}>{pack.name}</option>
                {/each}
            </select>
        </div>

        <button class="btn-primary" on:click={handleStart} disabled={isLoading}>
            {isLoading ? "Loading Grand Piano..." : `Start with ${activePack.startChord}`}
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
            <button class="btn-play" on:click={handlePlayFull}>▶ Play Song</button>
            <button class="btn-reset" on:click={handleReset}>Start Over</button>
        </div>
    {/if}
</main>

<style>
    main { font-family: sans-serif; text-align: center; max-width: 600px; margin: 2rem auto; }
    
    .vibe-selector { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
    select { padding: 8px; font-size: 1rem; border-radius: 4px; border: 1px solid #cbd5e1; margin-left: 10px; cursor: pointer; }
    
    .options-container { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
    .controls { display: flex; justify-content: center; gap: 15px; margin-top: 30px; }
    
    button { padding: 1rem; font-size: 1.1rem; cursor: pointer; border-radius: 8px; border: 1px solid #ccc; background: white; transition: background 0.2s;}
    button:hover:not(:disabled) { background: #f0f0f0; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .btn-primary { background: #e0e7ff; border-color: #a5b4fc; font-weight: bold; width: 100%; }
    .btn-play { background: #dcfce3; border-color: #86efac; font-weight: bold; }
    .btn-reset { background: #fee2e2; border-color: #fca5a5; }
    
    .history { margin: 2rem 0; font-size: 1.5rem; color: #333; font-weight: bold; letter-spacing: 0.5rem; }
</style>