<script lang="ts">
	import type { LigatureIcon } from '$lib/icons';
	// mmh how to do this? dont want this to be null, but also dont want to define
	// default icon
	// why does assignment to NULL make it undefined svelte?? (would expect LigatureIcon|null)
	// not LigatureIcon|null|undefined;
	export let icon: LigatureIcon;
	export let label: string | undefined = undefined;
</script>

<span title={icon} class="lsf-icon"> {label} </span>
