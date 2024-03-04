<script>
    import { taps, testActive, frequency, currentTest, testInitiated, fastestTwoTaps, tappingFrequencies } from '../../stores/stores';

    let tapTimes = []; // To store the timestamp of each tap
    const testDuration = 5000; // Test duration in milliseconds (5 seconds)

    // Function to initiate or restart the tapping test
    function initiateOrRestartTest() {
        currentTest.set('tapping');
        taps.set(0); // Reset taps count
        frequency.set(0); // Reset frequency for new test
        fastestTwoTaps.set(Infinity); // Reset fastest two taps interval
        tapTimes = []; // Clear tap timestamps for new test
        testActive.set(true); // Activate the test
        testInitiated.set(true); // Indicate that the test has been initiated at least once

        setTimeout(endTest, testDuration); // Schedule test end
    }

    // Function to handle tap actions
    function tap() {
        if ($testActive) {
            const now = new Date().getTime();
            tapTimes.push(now); // Record tap timestamp
            taps.update(n => n + 1); // Increment tap count

            // Calculate the interval between the last two taps if possible
            if (tapTimes.length > 1) {
                const interval = now - tapTimes[tapTimes.length - 2];
                fastestTwoTaps.update(fastest => Math.min(fastest, interval));
            }
        }
    }

    // Function to conclude the tapping test
    function endTest() {
        testActive.set(false); // Deactivate the test

        // Calculate and update frequency if there are enough taps
        if (tapTimes.length > 1) {
            const totalDuration = (tapTimes[tapTimes.length - 1] - tapTimes[0]) / 1000;
            const currentFrequency = (tapTimes.length - 1) / totalDuration;
            frequency.set(currentFrequency); // Update frequency for this test
            tappingFrequencies.update(f => [...f, currentFrequency]); // Add frequency to longitudinal tracking
        }
    }
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-lg">
        {#if $testActive}
            <button class="btn-primary w-full px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none" on:click={tap}>
                Tap Here
            </button>
            <p class="mt-4 text-center text-lg">Taps: {$taps}</p>
            <p class="text-center">Keep tapping until the test ends!</p>
        {:else if $testInitiated}
            <p class="text-lg font-semibold text-center">Test Ended</p>
            <div class="mt-4 space-y-2">
                <p>Total Taps: {$taps}</p>
                <p>Frequency: {$frequency.toFixed(2)} taps/second</p>
                <p>Fastest Two Taps: {$fastestTwoTaps === Infinity ? 'N/A' : `${$fastestTwoTaps} ms`}</p>
            </div>
            <button class="w-full px-4 py-2 mt-4 text-lg font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none" on:click={initiateOrRestartTest}>
                Restart Tapping Test
            </button>
        {:else}
            <button class="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none" on:click={initiateOrRestartTest}>
                Start Tapping Test
            </button>
        {/if}
    </div>
</div>
