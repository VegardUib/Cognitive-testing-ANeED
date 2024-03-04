<script>
    // Import necessary stores
    import { tappingFrequencies, reactionTimes, reactionChainScores, sortingScores } from '../../stores/stores';
    import Chart from './Chart.svelte';

    // Declare variables for labels
    let tappingLabels = [];
    let reactionLabels = [];
    let reactionChainLabels = [];
    let sortingLabels = [];

    // Reactive statements to update labels when store values change
    $: tappingLabels = $tappingFrequencies.map((_, index) => `Test ${index + 1}`);
    $: reactionLabels = $reactionTimes.map((_, index) => `Attempt ${index + 1}`);
    $: reactionChainLabels = $reactionChainScores.map((_, index) => `Test ${index + 1}`);
    $: sortingLabels = $sortingScores.map((_, index) => `Sorting Test ${index + 1}`);
</script>

{#if $tappingFrequencies.length > 0}
    <div class="chart-container max-w-4xl mx-auto p-4">
        <h2 class="text-2xl font-bold text-center">Taps per second</h2>
        <Chart 
            chartData={$tappingFrequencies} 
            chartLabels={tappingLabels} 
            chartTitle="Tapping Frequencies Over Time" 
        />
        <ul class="list-disc list-inside mt-4">
            {#each $tappingFrequencies as freq, index}
                <li>Test {index + 1}: {freq.toFixed(2)} taps/second</li>
            {/each}
        </ul>
    </div>
{/if}

{#if $reactionTimes.length > 0}
    <div class="chart-container max-w-4xl mx-auto p-4 mt-8">
        <h2 class="text-2xl font-bold text-center">Reaction times (ms)</h2>
        <Chart 
            chartData={$reactionTimes} 
            chartLabels={reactionLabels} 
            chartTitle="Reaction Times Over Attempts" 
        />
        <ul class="list-disc list-inside mt-4">
            {#each $reactionTimes as time, index}
                <li>Attempt {index + 1}: {time} ms</li>
            {/each}
        </ul>
    </div>
{/if}

{#if $reactionChainScores.length > 0}
    <div class="chart-container max-w-4xl mx-auto p-4 mt-8">
        <h2 class="text-2xl font-bold text-center">Chain Reaction scores</h2>
        <Chart 
            chartData={$reactionChainScores} 
            chartLabels={reactionChainLabels} 
            chartTitle="Reaction Chain Scores Over Tests" 
        />
        <ul class="list-disc list-inside mt-4">
            {#each $reactionChainScores as score, index}
                <li>Test {index + 1}: {score}</li>
            {/each}
        </ul>
    </div>
{/if}

{#if $sortingScores.length > 0}
    <div class="chart-container max-w-4xl mx-auto p-4 mt-8">
        <h2 class="text-2xl font-bold text-center">Sorting Test scores</h2>
        <Chart 
            chartData={$sortingScores} 
            chartLabels={sortingLabels} 
            chartTitle="Sorting Test Scores Over Tests" 
        />
        <ul class="list-disc list-inside mt-4">
            {#each $sortingScores as score, index}
                <li>Test {index + 1}: {(score.toFixed(2))/1000} seconds</li>
            {/each}
        </ul>
    </div>
{/if}

<style>
    .chart-container {
        /* Add any desired styles for the chart containers */
    }
</style>
