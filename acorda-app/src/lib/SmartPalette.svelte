<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let hasStarted = false;
    export let isLoading = false;
    export let isComplete = false;
    export let emotionPacks = {};
    export let chromaticScale = [];
    export let currentOptions = [];
    export let progressionLength = 0;
    export let chordComplexity = "triad";
    export let globalBpm = 110;

    // Usamos variables vinculadas (bind) para que el padre se entere si cambian
    export let selectedVibeId;
    export let selectedRoot;

    $: activePack = emotionPacks[selectedVibeId];
</script>

<div class="palette-container">
    <div class="palette-header">
        <h3>Smart Palette</h3>
        <p>Sugerencias armónicas basadas en tu emoción</p>
    </div>

    {#if !hasStarted}
        <div class="selectors">
            <div class="field">
                <label for="vibe">Emoción</label>
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
            <div class="field">
                <label for="root">Tono</label>
                <select
                    id="root"
                    bind:value={selectedRoot}
                    disabled={isLoading}
                >
                    {#each chromaticScale as note}
                        <option value={note}>{note}</option>
                    {/each}
                </select>
            </div>
        </div>

        <button
            class="btn-start"
            on:click={() => dispatch("start")}
            disabled={isLoading}
        >
            {isLoading
                ? "Cargando audio..."
                : `Iniciar en ${selectedRoot} ${activePack.name}`}
        </button>
    {/if}

    {#if hasStarted && !isComplete}
        <div class="options-header">
            <h4>Siguientes pasos</h4>
            {#if progressionLength > 0}
                <button class="btn-undo" on:click={() => dispatch("undo")}
                    >⟲ Deshacer</button
                >
            {/if}
        </div>

        <div class="options-grid">
            {#each currentOptions as option}
                <button
                    class="chord-btn"
                    on:click={() => dispatch("selectChord", option)}
                >
                    <span class="btn-intent">{option.label}</span>

                    <span class="btn-title">{option.chordName}</span>
                    <span class="btn-subtitle"
                        >{option.functionName} ({option.numeral})</span
                    >
                </button>
            {/each}
        </div>
        <div class="texture-section">
            <h4>Color / Textura</h4>
            <div class="segmented-control">
                <button
                    class="seg-btn {chordComplexity === 'triad'
                        ? 'active'
                        : ''}"
                    on:click={() => (chordComplexity = "triad")}
                    >Tríada
                </button>
                <button
                    class="seg-btn {chordComplexity === 'seventh'
                        ? 'active'
                        : ''}"
                    on:click={() => (chordComplexity = "seventh")}
                    >7ma (Jazz)
                </button>
                <button
                    class="seg-btn {chordComplexity === 'sus2' ? 'active' : ''}"
                    on:click={() => (chordComplexity = "sus2")}
                    >Sus2 (Abierto)
                </button>
            </div>
        </div>
    {/if}
    {#if isComplete}
        <div class="mastering-section">
            <div class="options-header">
                <h4>Ajustes Finales</h4>
                <button class="btn-undo" on:click={() => dispatch("undo")}
                    >⟲ Deshacer último</button
                >
            </div>

            <div class="mastering-controls">
                <div class="field">
                    <label for="tempo-slider">Tempo (BPM)</label>
                    <input
                        id="tempo-slider"
                        type="range"
                        min="60"
                        max="180"
                        bind:value={globalBpm}
                        class="slider"
                    />
                    <span class="val">{globalBpm} BPM</span>
                </div>

                <div class="field">
                    <label for="playback-style">Estilo de reproducción</label>
                    <select id="playback-style">
                        <option>Arpegio Suave</option>
                        <option>Acordes en Bloque</option>
                    </select>
                </div>
            </div>

            <button class="btn-start" style="margin-top: 1.5rem;">
                ↓ Exportar MIDI (Próximamente)
            </button>
        </div>
    {/if}
</div>

<style>
    .palette-container {
        background-color: var(--bg-secondary);
        border: 1px solid var(--border-light);
        border-radius: 16px;
        padding: 2rem;
        height: 100%;
    }

    .palette-header h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.4rem;
        color: var(--text-dark);
    }
    .palette-header p {
        margin: 0 0 2rem 0;
        font-size: 0.9rem;
        color: var(--text-muted);
    }

    .selectors {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    .field {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
    }
    .field label {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted);
    }

    select {
        padding: 0.8rem;
        border-radius: 8px;
        border: 1px solid var(--border-focus);
        background: var(--bg-main);
        font-family: inherit;
        cursor: pointer;
    }

    .btn-start {
        width: 100%;
        padding: 1rem;
        font-weight: bold;
        font-size: 1rem;
        background-color: var(--accent-blue);
        color: var(--text-dark);
        border: 1px solid var(--border-focus);
        border-radius: 8px;
        cursor: pointer;
    }

    .options-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border-light);
    }

    .options-header h4 {
        margin: 0;
        font-size: 0.9rem;
        text-transform: uppercase;
        color: var(--text-muted);
    }

    .btn-undo {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-weight: 600;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .options-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .chord-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1.2rem;
        background-color: var(--bg-main);
        border: 1px solid var(--border-light);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .chord-btn:hover {
        border-color: var(--border-focus);
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .btn-title {
        font-weight: 800;
        font-size: 1.2rem;
        color: var(--text-dark);
    }
    .btn-subtitle {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-top: 0.3rem;
    }

    .btn-intent {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #ea580c;
        font-weight: 700;
        margin-bottom: 0.4rem;
    }

    .texture-section {
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px dashed var(--border-focus);
    }

    .texture-section h4 {
        margin: 0 0 1rem 0;
        font-size: 0.85rem;
        text-transform: uppercase;
        color: var(--text-muted);
        letter-spacing: 0.05em;
    }

    .segmented-control {
        display: flex;
        background-color: var(--bg-main);
        border: 1px solid var(--border-light);
        border-radius: 8px;
        overflow: hidden;
    }

    .seg-btn {
        flex: 1;
        padding: 0.6rem;
        font-size: 0.85rem;
        font-weight: 600;
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.2s;
        border-right: 1px solid var(--border-light);
    }
    .seg-btn:last-child {
        border-right: none;
    }

    .seg-btn:hover {
        background-color: var(--bg-secondary);
    }
    .seg-btn.active {
        background-color: var(--text-dark);
        color: var(--bg-main);
    }

    .mastering-section {
        margin-top: 1rem;
        animation: fadeIn 0.4s ease;
    }
    .mastering-controls {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        background: var(--bg-main);
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--border-light);
    }
    .slider {
        width: 100%;
        cursor: pointer;
    }
    .val {
        font-size: 0.8rem;
        color: var(--text-muted);
        text-align: right;
        font-weight: bold;
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
