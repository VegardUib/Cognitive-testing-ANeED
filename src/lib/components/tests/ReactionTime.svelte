<script>
    import { reactionTimes, currentTest, testInitiated } from '../../stores/stores';
    import { t } from '../localization/i18n'; // Import the translation function
    

    let testStarted = false;
    let showStimulus = false;
    let stimulusStartTime;
    let bestTime = Infinity; // Initialize best time

    function startOrRestartTest() {
        testStarted = true;
        showStimulus = false; // Reset stimulus visibility
        currentTest.set('reaction');
        if (!$testInitiated) {
            testInitiated.set(true); // Mark the test as initiated only the first time
        }

        // Random wait time between 1-3 seconds before showing the stimulus
        setTimeout(() => {
            showStimulus = true;
            stimulusStartTime = new Date().getTime(); // Record the stimulus start time
        }, Math.random() * 2000 + 1000);
    }

    function respond() {
        if (showStimulus) {
            const reactionTime = new Date().getTime() - stimulusStartTime;
            reactionTimes.update(times => [...times, reactionTime]); // Add the new reaction time to the list
            bestTime = Math.min(bestTime, reactionTime); // Update best time if this attempt is better
            testStarted = false; // Reset for the next test
            showStimulus = false; // Hide the stimulus
        }
    }
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-lg text-center">
        {#if testStarted && !showStimulus}
            <p class="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">{$t('waitForSignal')}</p>
        {:else}
            {#if !showStimulus}
            <button class="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300" on:click={startOrRestartTest}>
                {$testInitiated ? $t('restartTest') : $t('startTest')}
            </button>
            {/if}
        {/if}

        {#if showStimulus}
            <button class="w-full px-4 py-2 text-lg font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300" on:click={respond}>
                {$t('respond')}
            </button>
        {/if}

        {#if bestTime !== Infinity}
            <p class="mt-4 text-gray-800 dark:text-gray-200">{$t('bestTime')}: {bestTime} ms</p>
        {/if}
    </div>
</div>
