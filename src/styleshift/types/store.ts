export type Category = {
	category: string;
	rainbow?: boolean;
	selector?: string;

	editable?: boolean;
	settings: Setting[];
	highlight_color?: string;
};

export type Option = {
	enable_css?: string;

	enable_function?: string | Function;
	disable_function?: string | Function;
};

export type Color_obj = {
	hex: string;
	alpha: number;
};

export type Setting =
	| {
			type: "text";
			id?: string;

			html: string;

			text_align?: "left" | "center" | "right";
			font_size?: number;

			editable?: boolean;
	  }
	| {
			type: "sub_text";
			id?: string;

			text: string;

			text_align?: "left" | "center" | "right";
			color?: string;
			font_size?: number;

			editable?: boolean;
	  }
	| {
			type: "button";
			id?: string;
			name: string;
			description?: string;

			icon?: string;
			text_align?: "left" | "center" | "right";
			color?: string;
			font_size?: number;

			click_function?: string | Function;

			editable?: boolean;
	  }
	| {
			type: "checkbox";
			id: string;
			name: string;
			description?: string;

			value: boolean;

			constant_css?: string;

			setup_function?: string | Function;
			update_function?: string | Function;

			enable_css?: string;
			enable_function?: string | Function;

			disable_css?: string;
			disable_function?: string | Function;

			editable?: boolean;
	  }
	| {
			type: "number_slide";
			id: string;
			name: string;
			description?: string;

			min?: number;
			max?: number;
			step?: number;
			value: number;
			var_css_unit?: string;

			//--------------

			var_css?: string;

			constant_css?: string | Function;

			setup_function?: string | Function;

			update_function?: string | Function;

			//--------------

			editable?: boolean;
	  }
	| {
			type: "dropdown";
			id: string;
			name: string;
			description?: string;

			value: string;

			//--------------

			constant_css?: string;

			setup_function?: string | Function;

			options: { [key: string]: Option };

			//--------------

			editable?: boolean;
	  }
	| {
			type: "color";
			id: string;
			name: string;
			description?: string;
			show_alpha_slider?: boolean;

			value: string;

			//--------------

			var_css?: string;

			constant_css?: string | Function;

			setup_function?: string | Function;

			update_function?: string | Function;

			//--------------

			editable?: boolean;
	  }
	| {
			type: "text_input";
			id: string;
			name: string;
			description?: string;

			value: string;

			update_function?: string | ((value: string) => void);

			//--------------
			editable?: boolean;
	  }
	| {
			type: "image_input";
			id: string;
			name: string;
			description?: string;

			value: string;
			max_file_size: number;

			//--------------
			editable?: boolean;
	  }
	| {
			type: "preview_image";
			id: string;

			//--------------
			editable?: boolean;
	  }
	| {
			type: "custom";
			id: string;

			//--------------

			constant_css?: string;
			setup_function?: string | Function;
			setup_?: string | Function;
			ui_function?: string | Function;

			//--------------

			editable?: boolean;
	  }
	| {
			type: "combine_settings";
			id?: string;
			name?: string;
			description?: string;
			sync_id: string[];
			update_function?: string;
			editable?: boolean;
	  };
