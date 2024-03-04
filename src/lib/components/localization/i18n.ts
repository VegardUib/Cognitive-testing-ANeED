import { writable, derived } from 'svelte/store';

// Initial language set to English
const currentLanguage = writable('en');

// Translations for each language
const translations = {
  en: {
    welcome: "Welcome to SvelteKit",
    startTest: "Start Test",
    restartTest: "Restart Test",
    tapHere: "Tap Here",
    testEnded: "Test Ended",
    totalTaps: "Total Taps",
    frequency: "Frequency",
    reactionTime: "Reaction Time",
    tappingFrequencies: "Tapping Frequencies Over Time",
    reactionTimes: "Reaction Times Over Attempts",
    // Add more translations...
  },
  es: {
    welcome: "Bienvenido a SvelteKit",
    startTest: "Iniciar prueba",
    restartTest: "Reiniciar prueba",
    tapHere: "Toca aquí",
    testEnded: "Prueba terminada",
    totalTaps: "Total de toques",
    frequency: "Frecuencia",
    reactionTime: "Tiempo de reacción",
    tappingFrequencies: "Frecuencias de toques a lo largo del tiempo",
    reactionTimes: "Tiempos de reacción por intento",
    // Add more translations...
  },
  no: {
    waitForSignal: "Vent på signalet...",
	restartTest: "Start Testen På Nytt",
	startTest: "Start Testen",
	respond: "Reager!",
	bestTime: "Beste Tid",
	tapHere: "Trykk Her",
	taps: "Trykk",
	keepTapping: "Fortsett å trykke til testen er over!",
	testEnded: "Testen Er Avsluttet",
	totalTaps: "Totalt Antall Trykk",
	frequency: "Frekvens",
	tapsPerSecond: "trykk/sekund",
	restartTappingTest: "Start Tappingtesten På Nytt",
	startTappingTest: "Start Tappingtesten",
	tappingFrequenciesOverTime: "Tappingfrekvenser Over Tid",
	reactionTimesOverAttempts: "Reaksjonstider Over Forsøk"  // Add more translations...
  },
  // Add more languages...
};

// Derived store to get translations based on the current language
const t = derived(currentLanguage, ($currentLanguage) => (key) => {
    return translations[$currentLanguage][key] || key; // Return the key itself if the translation is missing
});

export { t };
