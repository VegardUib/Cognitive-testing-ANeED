import { writable } from 'svelte/store';

export const currentTest = writable(null);
export const taps = writable(0);
export const frequency = writable(0);
export const fastestTwoTaps = writable(Infinity);
export const testActive = writable(false);
export const testInitiated = writable(false);
export const tappingFrequencies = writable([]);
export const reactionTimes = writable([]);
export const reactionChainScores = writable([]);
export const sortingScores = writable([]); // New store for sorting scores

// Function to add a new frequency to tappingFrequencies
export function addTappingFrequency(newFrequency) {
    tappingFrequencies.update(frequencies => [...frequencies, newFrequency]);
}

// Function to add a new reaction time to reactionTimes
export function addReactionTime(newTime) {
    reactionTimes.update(times => [...times, newTime]);
}

// Function to add a new reaction chain score to reactionChainScores
export function addReactionScore(newScore) {
    reactionChainScores.update(scores => [...scores, newScore]);
}

// Function to add a new sorting score to sortingScores
export function addSortingScore(newScore) {
    sortingScores.update(scores => [...scores, newScore]);
}
