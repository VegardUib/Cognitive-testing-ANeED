<script>
    import { get, writable } from 'svelte/store';
    import { reactionChainScores, currentTest, testInitiated } from '../../stores/stores';

    const score = writable(0);
    const misses = writable(0);
    let circleStyle = '';
    let isVisible = writable(false);
    let gameActive = writable(false);

    function startGame() {
        currentTest.set('chain');
        testInitiated.set(true);
        score.set(0);
        misses.set(0);
        gameActive.set(true);
        nextCircle();
    }

    function endGame() {
        gameActive.set(false);
        isVisible.set(false);
        const finalScore = get(score);
        reactionChainScores.update(scores => [...scores, finalScore]);
        alert(`Game over. Your score: ${finalScore}`);
    }

    function generateCircle() {
        const size = Math.random() * (80 - 30) + 30;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        const top = `${Math.random() * 80}%`;
        const left = `${Math.random() * 80}%`;
        circleStyle = `width: ${size}px; height: ${size}px; background-color: ${color}; top: ${top}; left: ${left}; position: absolute; border-radius: 50%; cursor: pointer;`;
        isVisible.set(true);
        setTimeout(() => isVisible.set(false), 2000);
    }

    function nextCircle() {
        if (get(misses) < 3) {
            const delay = Math.random() * (2500 - 500) + 500;
            setTimeout(() => generateCircle(), delay);
        } else {
            endGame();
        }
    }

    function handleCircleClick() {
        if (get(isVisible)) {
            score.update(n => n + 1);
            isVisible.set(false);
            nextCircle();
        }
    }

    function handleMiss() {
        if (!get(isVisible)) {
            misses.update(n => n + 1);
            if (get(misses) < 3) nextCircle();
            else endGame();
        }
    }
</script>

{#if get(gameActive)}
    <div on:click={handleMiss} style="width: 100%; height: 100vh; position: relative;">
        {#if get(isVisible)}
            <div on:click|stopPropagation={handleCircleClick} style={circleStyle}></div>
        {/if}
    </div>
    <p>Score: {$score}</p>
    <p>Misses: {$misses} / 3</p>
{:else}
    <button on:click={startGame}>Start Test</button>
{/if}
