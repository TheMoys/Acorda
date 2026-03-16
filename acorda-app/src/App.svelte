<script>
    import './app.css'; // Cargamos el reset y las variables globales

    import { emotionPacks, getDynamicOptions } from './lib/harmony.js';
    import { initAudio, playChord, playProgression } from './lib/audioEngine.js';

    let currentProgression = []; 
    const MAX_CHORDS = 4;
    let hasStarted = false;
    let isLoading = false;
    
    let selectedVibeId = "melancholy"; 

    $: activePack = emotionPacks[selectedVibeId];
    $: isComplete = currentProgression.length === MAX_CHORDS;
    
    $: currentOptions = hasStarted && !isComplete 
        ? getDynamicOptions(selectedVibeId, currentProgression.length) 
        : [];

    async function handleStart() {
        isLoading = true;
        await initAudio();
        isLoading = false;
        hasStarted = true;
        
        const opcionesIniciales = getDynamicOptions(selectedVibeId, 0);
        addChord(opcionesIniciales[0]);
    }

    function addChord(option) {
        if (isComplete) return;
        currentProgression = [...currentProgression, option];
        playChord(option.notes);
    }

    async function handlePlayFull() {
        await playProgression(currentProgression);
    }

    function handleReset() {
        currentProgression = [];
        hasStarted = false;
    }
</script>

<main>
    <h2>acorda</h2>
    <p>Select a vibe and build your dynamic progression.</p>

    {#if !hasStarted}
        <div class="vibe-selector">
            <label for="vibe">Emotion:</label>
            <select id="vibe" bind:value={selectedVibeId} disabled={isLoading}>
                {#each Object.entries(emotionPacks) as [id, pack]}
                    <option value={id}>{pack.name}</option>
                {/each}
            </select>
        </div>

        <button class="btn-start" on:click={handleStart} disabled={isLoading}>
            {isLoading ? "Cargando audio..." : `Start with ${activePack.root}`}
        </button>
    {/if}

    {#if hasStarted && !isComplete}
        <div class="options-grid">
            {#each currentOptions as option}
                <button class="chord-btn" on:click={() => addChord(option)}>
                    <span class="btn-title">{option.label}</span>
                    <span class="btn-subtitle">{option.chordName} — {option.functionName}</span>
                </button>
            {/each}
        </div>
    {/if}

    <div class="canvas">
        {#each Array(MAX_CHORDS) as _, i}
            <div class="slot {currentProgression[i] ? 'filled' : 'empty'}">
                {#if currentProgression[i]}
                    <span class="slot-chord">{currentProgression[i].chordName}</span>
                    <span class="slot-degree">{currentProgression[i].numeral}</span>
                {:else}
                    <span class="slot-placeholder">_</span>
                {/if}
            </div>
        {/each}
    </div>

    {#if isComplete}
        <div class="controls">
            <button class="btn-action" on:click={handlePlayFull}>▶ Reproducir</button>
            <button class="btn-action outline" on:click={handleReset}>Reiniciar</button>
        </div>
    {/if}
</main>

<style>
    /* Estilos ENCAPSULADOS: Solo afectan a este archivo HTML */
    
    main {
        text-align: center;
        width: 100%;
        max-width: 600px;
        margin-top: 4rem;
        padding: 0 1.5rem;
    }

    .vibe-selector {
        background-color: var(--bg-secondary);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--border-light);
        margin-bottom: 1.5rem;
    }

    select {
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid var(--border-focus);
        background: var(--bg-main);
        margin-left: 0.5rem;
        font-family: inherit;
        cursor: pointer;
    }

    /* Sistema de botones */
    button {
        font-family: inherit;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .btn-start {
        width: 100%;
        padding: 1rem;
        font-size: 1.1rem;
        font-weight: 600;
        background-color: var(--accent-blue);
        border: 1px solid var(--border-focus);
        color: var(--text-dark);
    }

    .btn-start:hover:not(:disabled) {
        background-color: var(--accent-blue-hover);
    }

    /* Cuadrícula de opciones dinámicas */
    .options-grid {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 1.5rem;
    }

    .chord-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.25rem;
        background-color: var(--primary-btn);
        border: 1px solid var(--border-light);
    }

    .chord-btn:hover {
        background-color: var(--primary-btn-hover);
        border-color: var(--border-focus);
    }

    .btn-title {
        font-weight: 600;
        font-size: 1.05rem;
        color: var(--text-dark);
    }

    .btn-subtitle {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 0.25rem;
    }

    /* Lienzo de progresión (Los huecos) */
    .canvas {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 3rem 0;
    }

    .slot {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 80px;
        height: 85px;
        border-radius: 12px;
    }

    .slot.empty {
        border: 2px dashed var(--border-focus);
        background-color: var(--bg-secondary);
    }

    .slot.filled {
        background-color: var(--bg-main);
        border: 1px solid var(--border-light);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .slot-chord {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text-dark);
    }

    .slot-degree {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-muted);
    }

    .slot-placeholder {
        color: var(--border-focus);
        font-size: 1.5rem;
    }

    /* Controles finales */
    .controls {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .btn-action {
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        background-color: var(--bg-main);
        border: 1px solid var(--border-focus);
        color: var(--text-dark);
    }

    .btn-action:hover {
        background-color: var(--primary-btn-hover);
    }
</style>