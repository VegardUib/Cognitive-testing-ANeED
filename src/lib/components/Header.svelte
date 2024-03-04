<script lang="ts">
	import { language } from '@inlang/sdk-js';

	import LocaleSwitcher from '$components/LocaleSwitcher.svelte';
	import ThemeSwitcher from '$components/ThemeSwitcher.svelte';
</script>

<header>
	<div class="flex flex-col">
		<nav class="p-4 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
			<a href="/{language}" class="text-xl font-bold">Home</a>
			<div class="flex items-center space-x-4">
				<LocaleSwitcher />
				<ThemeSwitcher />
			</div>
		</nav>
</header>
