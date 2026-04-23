export const scrollbarCss = `
@supports (scrollbar-width: auto) {
	*{
		scrollbar-width: thin;
		scrollbar-color: var(--nt-theme-color) transparent;
	}

	ytd-app {
		scrollbar-width: none;
	}

	body::-webkit-scrollbar-track
	{
		scrollbar-color: var(--nt-theme-color) var(--nt-scrollbar-track-color) !important;
	}
}

@supports selector(::-webkit-scrollbar) {
	*::-webkit-scrollbar
	{
		width: var(--nt-scrollbar-width) !important;
		height: var(--nt-scrollbar-width) !important;

		background-color: transparent !important;
		color: var(--nt-theme-color) !important;
	}
	
	*::-webkit-scrollbar-thumb
	{
		border-radius:10px;
		background-color: var(--nt-theme-color) !important;
	}

	*:not(body)::-webkit-scrollbar-track{
		background: transparent !important;
	}

	ytd-app::-webkit-scrollbar {
		width: 0px  !important;
	}

	body::-webkit-scrollbar-track
	{
		background: var(--nt-scrollbar-track-color) !important;
	}
}
`;
