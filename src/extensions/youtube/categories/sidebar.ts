import { type Category } from "@settings/types/styleshiftTypes";

export const sidebarCategory: Category = {
	category: { icon: "view_sidebar", label: "Sidebar" },
	settings: [
		{
			type: "checkbox",
			id: "EnableFloatSidebar",
			name: "Float sidebar",
			description: "Make the sidebar float, container like.",
			value: true,
			enableCss: `
				#guide[position="left"] {
					left: 10px;
					bottom: 10px;
				}
				
				#guide[position="left"] > div {
					height: 100%;
					border-radius: var(--nt-sidebar-roundness);
					overflow: hidden;
				}
			`,
		},
		{
			type: "numberSlide",
			id: "SidebarRound",
			name: "Sidebar Roundness",
			description: "Adjust the roundness of the sidebar corners.",
			min: 0,
			max: 100,
			step: 1,
			value: 10,
			varCss: "--nt-sidebar-roundness",
		},
		{
			type: "checkbox",
			id: "EnableSidebarBlur",
			name: "Sidebar Blur",
			description: "Add a blur effect to the sidebar.",
			value: false,
			enableCss: `
				#guide[position="left"] {
					backdrop-filter: blur(10px);
				}
			`,
		},
	],
};
