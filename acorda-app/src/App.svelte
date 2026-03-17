<script>
    import "./app.css"; // Mantenemos tu CSS global intacto
    import Piano from "./lib/Piano.svelte";

    // Asegúrate de importar CHROMATIC_SCALE
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

    let currentProgression = [];
    const MAX_CHORDS = 4;
    let hasStarted = false;
    let isLoading = false;
    let activeNotes = [];

    let selectedVibeId = "melancholy";
    let selectedRoot = "C"; // <-- La nueva variable para la nota base

    $: activePack = emotionPacks[selectedVibeId];
    $: isComplete = currentProgression.length === MAX_CHORDS;

    // El motor dinámico ahora recibe selectedRoot
    $: currentOptions =
        hasStarted && !isComplete
            ? getDynamicOptions(
                  selectedVibeId,
                  currentProgression.length,
                  selectedRoot,
              )
            : [];

    async function handleStart() {
        isLoading = true;
        await initAudio();
        isLoading = false;
        hasStarted = true;

        // Iniciamos pasando la nota base
        const opcionesIniciales = getDynamicOptions(
            selectedVibeId,
            0,
            selectedRoot,
        );
        addChord(opcionesIniciales[0]);
    }

    function addChord(option) {
        if (isComplete) return;
        currentProgression = [...currentProgression, option];
        activeNotes = option.notes; // <--- Le decimos a Svelte qué notas iluminar
        playChord(option.notes);
    }

    function undoLastChord() {
        // Si no hay acordes, no hacemos nada
        if (currentProgression.length === 0) return;

        // Cortamos el último elemento del arreglo
        currentProgression = currentProgression.slice(0, -1);

        // Si aún quedan acordes después de borrar, actualizamos el piano y el sonido
        if (currentProgression.length > 0) {
            const lastChord = currentProgression[currentProgression.length - 1];
            activeNotes = lastChord.notes;
            playChord(lastChord.notes); // Tocamos el acorde en el que nos hemos quedado
        } else {
            // Si hemos borrado el único que había, apagamos el piano
            activeNotes = [];
        }
    }

    async function handlePlayFull() {
        // Le pasamos la progresión y una función que actualiza las teclas
        await playProgression(currentProgression, (notasDelAcordeActual) => {
            activeNotes = notasDelAcordeActual;
        });
    }

    function handleReset() {
        currentProgression = [];
        activeNotes = []; // Apagamos el piano
        hasStarted = false;
    }
</script>

<main>
    <h2>acorda</h2>
    <p>Select a vibe and build your dynamic progression.</p>

    {#if !hasStarted}
        <div class="selectors-container">
            <div class="selector-group">
                <label for="vibe">Emotion:</label>
                <select
                    id="vibe"
                    bind:value={selectedVibeId}
                    disabled={isLoading}
                >
                    {#each Object.entries(emotionPacks) as [id, pack]}
                        <option value={id}>{pack.name}</option>
                    {/each}
                </select>
            </div>

            <div class="selector-group">
                <label for="root">Key:</label>
                <select
                    id="root"
                    bind:value={selectedRoot}
                    disabled={isLoading}
                >
                    {#each CHROMATIC_SCALE as note}
                        <option value={note}>{note}</option>
                    {/each}
                </select>
            </div>
        </div>

        <button class="btn-start" on:click={handleStart} disabled={isLoading}>
            {isLoading
                ? "Cargando audio..."
                : `Start in ${selectedRoot} ${activePack.name}`}
        </button>
    {/if}

    {#if hasStarted && !isComplete}
        <div class="options-header">
            <h3 class="section-title">Suggested Next Steps</h3>

            {#if currentProgression.length > 0}
                <button class="btn-undo" on:click={undoLastChord}>
                    ⟲ Deshacer último
                </button>
            {/if}
        </div>

        <div class="options-grid">
            {#each currentOptions as option}
                <button class="chord-btn" on:click={() => addChord(option)}>
                    <span class="btn-title">{option.label}</span>
                    <span class="btn-subtitle"
                        >{option.chordName} — {option.functionName}</span
                    >
                </button>
            {/each}
        </div>
    {/if}

    <div class="canvas">
        {#each Array(MAX_CHORDS) as _, i}
            <div class="slot {currentProgression[i] ? 'filled' : 'empty'}">
                {#if currentProgression[i]}
                    <span class="slot-chord"
                        >{currentProgression[i].chordName}</span
                    >
                    <span class="slot-degree"
                        >{currentProgression[i].numeral}</span
                    >
                {:else}
                    <span class="slot-placeholder">_</span>
                {/if}
            </div>
        {/each}
    </div>

    {#if hasStarted}
        <section class="visualizer-container">
            <h3 class="visualizer-title">Voicing</h3>
            <Piano {activeNotes} />
        </section>
    {/if}

    {#if isComplete}
        <div class="controls">
            <button class="btn-action" on:click={handlePlayFull}
                >▶ Reproducir</button
            >
            <button class="btn-action outline" on:click={handleReset}
                >Reiniciar</button
            >
        </div>
    {/if}
</main>

<style>
    /* Estilos encapsulados de tu diseño claro y minimalista original */

    main {
        text-align: center;
        width: 100%;
        max-width: 600px;
        margin-top: 4rem;
        padding: 0 1.5rem;
        margin-left: auto;
        margin-right: auto;
    }

    /* Adaptamos el contenedor para que los selectores queden uno al lado del otro */
    .selectors-container {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        background-color: var(--bg-secondary);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--border-light);
        margin-bottom: 1.5rem;
    }

    .selector-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    select {
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid var(--border-focus);
        background: var(--bg-main);
        font-family: inherit;
        cursor: pointer;
    }

    button {
        font-family: inherit;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
        border: none;
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

    .visualizer-container {
        margin: 2rem 0;
        padding-top: 1rem;
        border-top: 1px solid var(--border-light);
    }

    .visualizer-title {
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
        margin-bottom: 1rem;
        font-weight: 600;
    }

    /* Estilos para la cabecera de opciones y botón de deshacer */
    .options-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        padding: 0 0.5rem;
    }

    .section-title {
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
        margin: 0;
        font-weight: 600;
    }

    .btn-undo {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-size: 0.9rem;
        font-weight: 600;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .btn-undo:hover {
        background: var(--bg-secondary);
        color: var(--text-dark);
    }
</style>
