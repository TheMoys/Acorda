export const emotionPacks = {
    melancholy: {
        id: "melancholy",
        name: "Melancholy (A minor)",
        startChord: "Am",
        dictionary: {
            "Am": { notes: ["A3", "C4", "E4"], next: [{ label: "Add tension", target: "E7" }, { label: "Give a breather", target: "Fmaj7" }, { label: "Make it darker", target: "Dm" }] },
            "E7": { notes: ["E3", "G#3", "B3", "D4"], next: [{ label: "Resolve home", target: "Am" }, { label: "Surprise resolution", target: "Fmaj7" }] },
            "Fmaj7": { notes: ["F3", "A3", "C4", "E4"], next: [{ label: "Create tension to return", target: "E7" }, { label: "Fall into darkness", target: "Dm" }] },
            "Dm": { notes: ["D3", "F3", "A3"], next: [{ label: "Return to base", target: "Am" }, { label: "Prepare the end", target: "E7" }] }
        }
    },
    epic: {
        id: "epic",
        name: "Epic Soundtrack (E minor)",
        startChord: "Em",
        dictionary: {
            "Em": { notes: ["E3", "G3", "B3"], next: [{ label: "Heroic lift", target: "C" }, { label: "Action movement", target: "D" }] },
            "C": { notes: ["C3", "E3", "G3"], next: [{ label: "Climb higher", target: "D" }, { label: "Gather strength", target: "Am" }] },
            "D": { notes: ["D3", "F#3", "A3"], next: [{ label: "Triumphant return", target: "Em" }, { label: "Dark turn", target: "Bm" }] },
            "Am": { notes: ["A2", "C3", "E3"], next: [{ label: "Back to action", target: "Em" }, { label: "Push forward", target: "D" }] },
            "Bm": { notes: ["B2", "D3", "F#3"], next: [{ label: "Heroic lift", target: "C" }, { label: "Resolve to base", target: "Em" }] }
        }
    },
    joyful: {
        id: "joyful",
        name: "Joyful Pop (C major)",
        startChord: "C",
        dictionary: {
            "C": { notes: ["C3", "E3", "G3"], next: [{ label: "Add energy", target: "G" }, { label: "Open up", target: "F" }, { label: "Touch of nostalgia", target: "Am" }] },
            "F": { notes: ["F2", "A2", "C3"], next: [{ label: "Return home", target: "C" }, { label: "Build up", target: "G" }] },
            "G": { notes: ["G2", "B2", "D3"], next: [{ label: "Happy resolution", target: "C" }, { label: "Deceptive turn", target: "Am" }] },
            "Am": { notes: ["A2", "C3", "E3"], next: [{ label: "Lift the mood", target: "F" }, { label: "Calm down", target: "C" }] }
        }
    }
};