<script lang="ts">
    import type { LigatureIcon } from '$lib/icons';
    export let icon: LigatureIcon;
    export let label: string | undefined = undefined;
</script>

<span title={icon} class="lsf-icon"> {label} </span>
