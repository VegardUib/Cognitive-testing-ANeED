<script lang="ts">
    import { currentTest, testInitiated, addReactionScore } from '../../stores/stores';
    import { onMount } from 'svelte';

    // Declare variables
    let circles = []; // Store for circles
    let score = 0;
    let misses = 0;
    let testStarted = false;
    let reactionTimes = []; // Store for reaction times
    const maxMisses = 5; // Maximum number of misses allowed
    const testDuration = 10000; // Test duration in milliseconds (10 seconds)
    const containerWidth = 80; // Width of the container in percentage
    const containerHeight = 80; // Height of the container in percentage
    let testTimeout; // Timeout for ending the test

    // Function to start or restart the reaction chain test
    function startOrRestartTest() {
        score = 0; // Reset score
        misses = 0; // Reset misses
        reactionTimes = []; // Reset reaction times
        testStarted = true; // Set testStarted to true
        circles = []; // Reset circles
        currentTest.set('chain');

        // Set timeout to end the game after testDuration
        testTimeout = setTimeout(() => {
            endGame();
        }, testDuration);

        showNextCircle(); // Start showing circles
    }

    // Function to show the next circle
    function showNextCircle() {
        if (!testStarted) return; // Stop generating circles if the test has ended

        if (misses >= maxMisses) {
            endGame(); // End game if misses reach the maximum allowed
            return;
        }

        const circle = generateCircle();
        circles.push(circle);

        setTimeout(() => {
            if (testStarted && !circle.clicked) {
                handleMiss(); // Handle miss if the circle is not clicked within time
                removeCircle(circle); // Remove the circle from the array
                console.log("Missed circle:", circle);
            }
            if (testStarted) {
                showNextCircle(); // Show next circle
            }
        }, circle.duration); // Show circle for its duration
    }

    // Function to handle circle click
    function handleCircleClick(circle) {
        console.log("Clicked circle:", circle);
        if (!testStarted) {
            console.log("Test has ended. Ignoring click.");
            return; // Ignore clicks if the test has ended
        }

        if (!circle.clicked) {
            const reactionTime = Date.now() - circle.startTime; // Calculate reaction time
            reactionTimes.push(reactionTime); // Store reaction time
            score++; // Increment score
            circle.clicked = true;
            removeCircle(circle); // Remove the clicked circle
            console.log("Circle clicked. Reaction time:", reactionTime, "ms");
        } else {
            console.log("Circle already clicked. Ignoring click.");
        }
    }

    // Function to handle misses
    function handleMiss() {
        if (testStarted) {
            misses++; // Increment misses
        }
    }

    // Function to end the game
    function endGame() {
        addReactionScore(score); // Add the final score to the store
        testStarted = false; // Update testStarted flag
        clearTimeout(testTimeout); // Clear the test timeout
    }

    // Function to generate a new circle with random properties
    function generateCircle() {
        const size = Math.random() * (50 - 30) + 30;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        const position = {
            top: `${Math.random() * (containerHeight - size)}%`, // Adjusted to ensure circles stay within the container
            left: `${Math.random() * (containerWidth - size)}%` // Adjusted to ensure circles stay within the container
        };
        const duration = Math.random() * (2000 - 1000) + 1000; // Random duration between 1-2 seconds
        return {
            size,
            color,
            position,
            duration,
            clicked: false,
            startTime: Date.now() // Record the start time of the circle
        };
    }

    // Function to remove a circle from the array
    function removeCircle(circle) {
        circles = circles.filter(c => c !== circle); // Remove the circle from the array
    }

    // Function to handle clicks outside circles
    function handleOutsideClick(event) {
        if (!testStarted) return; // Ignore clicks if the test has not started

        const clickedX = event.clientX;
        const clickedY = event.clientY;
        let insideAnyCircle = false;

        // Check if the click is inside any of the active circles
        circles.forEach(circle => {
            const circleX = parseFloat(circle.position.left) + circle.size / 2;
            const circleY = parseFloat(circle.position.top) + circle.size / 2;
            const distance = Math.sqrt((clickedX - circleX) ** 2 + (clickedY - circleY) ** 2);

            if (distance <= circle.size / 2) {
                insideAnyCircle = true;
            }
        });

        // Register a miss if the click is outside all active circles
        if (!insideAnyCircle) {
            handleMiss();
            console.log("Clicked outside the circle.");
        }
    }

    // Initialize event listener for clicks outside circles
    onMount(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    });

    // Function to calculate the mean reaction time
    function calculateMeanReactionTime() {
        if (score === 0) {
            return 0; // Return 0 if there are no hits
        }
        const sum = reactionTimes.reduce((acc, curr) => acc + curr, 0);
        return sum / score; // Calculate the mean reaction time from hits only
    }
</script>
<div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-lg relative" style="height: 80vh;"> <!-- Adjusted to ensure the container's height -->
        {#if testStarted}
            {#each circles as circle}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="circle" style={`top: ${circle.position.top}; left: ${circle.position.left}; width: ${circle.size}px; height: ${circle.size}px; background-color: ${circle.color}`} on:click={() => handleCircleClick(circle)}></div>
            {/each}
        {/if}

        {#if !testStarted && score > 0}
            <p class="mt-4 text-gray-800 dark:text-gray-200">Final Score: {score}</p>
            <p class="mt-4 text-gray-800 dark:text-gray-200">Mean Reaction Time: {calculateMeanReactionTime().toFixed(2)} ms</p>
            <button class="mt-4 px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300" on:click={startOrRestartTest}>
                Restart Test
            </button>
        {/if}

        {#if testStarted && misses < maxMisses}
            <p class="mt-4 text-gray-800 dark:text-gray-200">Score: {score}</p>
            <p class="mt-4 text-gray-800 dark:text-gray-200">Misses: {misses}</p>
        {/if}

        {#if !testStarted && score === 0}
            <button class="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300" on:click={startOrRestartTest}>
                {$testInitiated ? 'Restart Test' : 'Start Test'}
            </button>
        {/if}
    </div>
</div>

<style>
    .circle {
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
    }
</style>