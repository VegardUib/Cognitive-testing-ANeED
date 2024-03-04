<script lang="ts">
    import { currentTest, testInitiated, sortingScores, addSortingScore } from '../../stores/stores';
    import { onMount } from 'svelte';

    // Declare variables
    let boxes = []; // Store for draggable boxes
    let startTime; // Variable to store the start time of the test
    let sorted = false; // Variable to track if boxes are sorted
    let score = null; // Variable to store the final score, initialized as null
    let testStarted = false; // Variable to track if the test has started
    const containerWidth = 80; // Width of the container in percentage
    const containerHeight = 80; // Height of the container in percentage

    // Function to start or restart the alphabet sorting test
    function startOrRestartTest() {
        boxes = generateBoxes(); // Generate draggable boxes with random letters
        sorted = false; // Reset sorted flag
        score = null; // Reset score to null
        startTime = Date.now(); // Set start time when the test starts
        currentTest.set('sorting');
        testStarted = true; // Update testStarted flag
    }

    // Function to generate an array of draggable boxes with random letters
    function generateBoxes() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').sort(() => Math.random() - 0.5);
        const randomLetters = letters.slice(0, 6); // Select random 6 letters
        const boxWidth = containerWidth / 6; // Width of each box
        const boxHeight = 50; // Height of each box
        const initialTop = containerHeight / 2 - boxHeight / 2; // Initial top position
        return randomLetters.map((letter, index) => ({
            id: index, // Add an ID to track box order
            letter,
            position: {
                top: `${initialTop}%`,
                left: `${index * boxWidth}%`
            },
            draggable: true,
            sorted: false // Add a property to track if the box is sorted
        }));
    }

    // Function to handle dragging of boxes
    function handleDragStart(event, box) {
        event.dataTransfer.setData('boxId', box.id.toString());
    }

    // Function to handle dropping of boxes and rearrange them
    function handleDrop(event, targetId) {
        event.preventDefault();
        const draggedId = parseInt(event.dataTransfer.getData('boxId'));
        const draggedBox = boxes.find(box => box.id === draggedId);
        const targetBox = boxes.find(box => box.id === targetId);
        const draggedIndex = boxes.findIndex(box => box.id === draggedId);
        const targetIndex = boxes.findIndex(box => box.id === targetId);

        // Rearrange the boxes array
        boxes[draggedIndex] = targetBox;
        boxes[targetIndex] = draggedBox;

        // Update positions for smooth transition
        const tempLeft = boxes[draggedIndex].position.left;
        boxes[draggedIndex].position.left = boxes[targetIndex].position.left;
        boxes[targetIndex].position.left = tempLeft;

        // Check if the boxes are sorted after drop
        checkSorting();
    }

    // Function to check if the boxes are sorted after drop
    function checkSorting() {
        const sortedLetters = [...boxes.map(box => box.letter)].sort();
        sorted = JSON.stringify(boxes.map(box => box.letter)) === JSON.stringify(sortedLetters);
        if (testStarted && sorted) { // Only update score if the test has started and sorting is completed
            const endTime = Date.now();
            score = (endTime - startTime); // Calculate the time taken to complete the test in milliseconds
            addSortingScore(score); // Add the final score to the store
            
            // Update box properties to indicate sorting and disable further interaction
            boxes.forEach(box => {
                box.sorted = true;
                box.draggable = false;
            });
            
            // Remove the event listener since the test is completed
            document.removeEventListener('mouseup', checkSorting);
        }
    }

    // Initialize event listener for box sorting
    onMount(() => {
        document.addEventListener('mouseup', checkSorting);
        return () => {
            document.removeEventListener('mouseup', checkSorting);
        };
    });
</script>


<div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-lg relative" style="height: 80vh;">
        {#each boxes as box}
            <div 
                class="box" 
                draggable="{box.draggable}" 
                style="top: {box.position.top}; left: {box.position.left}; background-color: {box.sorted ? 'green' : '#ccc'}" 
                on:dragstart={(event) => handleDragStart(event, box)} 
                on:drop={(event) => handleDrop(event, box.id)}
                on:dragover={(event) => event.preventDefault()}
            >
                {box.letter}
            </div>
        {/each}
    </div>

    {#if !sorted && boxes.length > 0}
        <p class="mt-4 text-gray-800 dark:text-gray-200">Drag and drop the boxes to arrange them alphabetically.</p>
    {/if}

    {#if !testStarted || sorted}
        <button class="mt-4 px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300" on:click={startOrRestartTest}>
            {sorted ? 'Restart Test' : 'Start Test'}
        </button>
    {/if}

    {#if sorted}
        <p class="mt-4 text-gray-800 dark:text-gray-200">Test completed! Your score: {score ? (score / 1000).toFixed(2) + ' seconds' : 'N/A'}.</p>
    {/if}
</div>

<style>
    .box {
        width: 50px;
        height: 50px;
        border: 1px solid #aaa;
        border-radius: 4px;
        cursor: pointer;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: left 0.3s ease-in-out; /* Add smooth transition for left property */
    }
</style>
