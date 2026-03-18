<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let progression = [];
    export let maxChords = 4;
    export let isComplete = false;
</script>

<div class="canvas-container">
    <div class="canvas">
        {#each Array(maxChords) as _, i}
            <div class="slot {progression[i] ? 'filled' : 'empty'}">
                {#if progression[i]}
                    <span class="slot-chord">{progression[i].chordName}</span>
                    <span class="slot-degree">{progression[i].numeral}</span>
                {:else}
                    <span class="slot-placeholder">+</span>
                {/if}
            </div>
        {/each}
    </div>

    {#if isComplete}
        <div class="controls">
            <button class="btn-action" on:click={() => dispatch('play')}>▶ Reproducir Bucle</button>
            <button class="btn-action outline" on:click={() => dispatch('reset')}>Limpiar Lienzo</button>
        </div>
    {/if}
</div>

<style>
    .canvas-container { margin: 2rem 0; }
    
    .canvas {
        display: flex;
        gap: 1.5rem;
        flex-wrap: wrap;
    }

    .slot {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 110px;
        height: 130px;
        border-radius: 12px;
        background-color: var(--bg-main);
    }

    .slot.empty {
        border: 2px dashed var(--border-focus);
        background-color: transparent;
    }

    .slot.filled {
        border: 1px solid var(--border-light);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        border-bottom: 4px solid var(--accent-blue); /* Toque de diseño del mock */
    }

    .slot-chord { font-size: 2rem; font-weight: 800; color: var(--text-dark); }
    .slot-degree { font-size: 0.9rem; font-weight: 600; color: var(--text-muted); margin-top: 4px;}
    .slot-placeholder { color: var(--border-focus); font-size: 2rem; }

    .controls {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }

    .btn-action {
        padding: 0.8rem 1.5rem;
        font-weight: 600;
        background-color: var(--text-dark);
        color: var(--bg-main);
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }
    
    .btn-action.outline {
        background-color: transparent;
        color: var(--text-dark);
        border: 1px solid var(--border-focus);
    }
</style>