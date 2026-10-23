// Increment after saving so views recompute values from raw setting objects.
let revision = $state(0);

export function getEditRevision(): number {
	return revision;
}

export function bumpEditRevision(): void {
	revision++;
}
