<script lang="ts">
    import '../app.postcss';
    import Header from '$components/Header.svelte';
    import SvelteTheme from '$components/SvelteThemes/SvelteTheme.svelte';
    import TappingTest from '../lib/components/tests/TappingTest.svelte';
    import ChainReaction from '../lib/components/tests/ChainReaction.svelte';
    import SortingTest from '../lib/components/tests/SortingTest.svelte';
    import ReactionTimeTest from '../lib/components/tests/ReactionTime.svelte';
    import { currentTest } from '../lib/stores/stores';
	import DataVisualization from '../lib/components/visualisation/DataVisualization.svelte';

</script>
    <Header />
    
    <!-- Main content container with responsive padding -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-6 ">
            <slot/>
        </div>
    <!-- Test selection buttons with responsive layout -->
    <div class="flex flex-wrap justify-center gap-4 mb-8">
        <button class="btn-primary" on:click={() => currentTest.set('tapping')}>
            Tapping Test
        </button>
        <button class="btn-primary" on:click={() => currentTest.set('reaction')}>
            Reaction Time Test
        </button>
        <button class="btn-primary" on:click={() => currentTest.set('chain')}>
            Chain Reaction Test
        </button>
        <button class="btn-primary" on:click={() => currentTest.set('sorting')}>
            Sorting Test
        </button>
    </div>

    <!-- Test components with conditional rendering -->
    {#if $currentTest === 'tapping'}
        <TappingTest />
    {:else if $currentTest === 'reaction'}
        <ReactionTimeTest />
    {:else if $currentTest === 'chain'}
        <ChainReaction />
    {:else if $currentTest === 'sorting'}
        <SortingTest />
    {/if}
    <!-- Data visualization component -->
    <DataVisualization />

</div>

<SvelteTheme attribute="data-theme" />