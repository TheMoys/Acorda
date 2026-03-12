export const chordDictionary = {
    "Am": { 
        notes: ["A3", "C4", "E4"], 
        next: [
            { label: "Add tension", target: "E7" }, 
            { label: "Give a breather", target: "Fmaj7" }, 
            { label: "Make it darker", target: "Dm" }
        ] 
    },
    "E7": { 
        notes: ["E3", "G#3", "B3", "D4"], 
        next: [
            { label: "Resolve home", target: "Am" }, 
            { label: "Surprise resolution", target: "Fmaj7" }
        ] 
    },
    "Fmaj7": { 
        notes: ["F3", "A3", "C4", "E4"], 
        next: [
            { label: "Create tension to return", target: "E7" }, 
            { label: "Fall into darkness", target: "Dm" }
        ] 
    },
    "Dm": { 
        notes: ["D3", "F3", "A3"], 
        next: [
            { label: "Return to base", target: "Am" }, 
            { label: "Prepare the end", target: "E7" }
        ] 
    }
};