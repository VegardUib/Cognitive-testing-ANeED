<script>
    import { onMount, onDestroy, afterUpdate } from 'svelte';
    import Chart from 'chart.js/auto';

    export let chartData;
    export let chartLabels;
    export let chartTitle;

    let chartInstance;
    let canvas;

    onMount(() => {
        const ctx = canvas.getContext('2d');
        chartInstance = createChart(ctx);
    });

    onDestroy(() => {
        chartInstance?.destroy();
    });

    afterUpdate(() => {
        updateChart(); // Update the chart after any update in the component
    });

    function createChart(ctx) {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: chartTitle,
                    data: chartData,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function updateChart() {
        if (!chartInstance) return;
        chartInstance.data.labels = chartLabels;
        chartInstance.data.datasets[0].data = chartData;
        chartInstance.update();
    }
</script>

<canvas bind:this={canvas}></canvas>
