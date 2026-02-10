export type Category = {
	category: string;
	rainbow?: boolean;
	selector?: string;

	editable?: boolean;
	settings: Setting[];
	highlightColor?: string;
};

export type Option = {
	enableCss?: string;

	enableFunction?: string | Function;
	disableFunction?: string | Function;
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

			align?: "left" | "center" | "right";
			fontSize?: number;

			editable?: boolean;
	  }
	| {
			type: "subText";
			id?: string;

			text: string;

			align?: "left" | "center" | "right";
			color?: string;
			fontSize?: number;

			editable?: boolean;
	  }
	| {
			type: "button";
			id?: string;
			name: string;
			description?: string;

			icon?: string;
			align?: "left" | "center" | "right";
			color?: string;
			fontSize?: number;

			clickFunction?: string | Function;

			editable?: boolean;
	  }
	| {
			type: "checkbox";
			id: string;
			name: string;
			description?: string;

			value: boolean;

			constantCss?: string;

			setupFunction?: string | Function;
			updateFunction?: string | Function;

			enableCss?: string;
			enableFunction?: string | Function;

			disableCss?: string;
			disableFunction?: string | Function;

			editable?: boolean;
	  }
	| {
			type: "numberSlide";
			id: string;
			name: string;
			description?: string;

			min?: number;
			max?: number;
			step?: number;
			value: number;
			unit?: string;

			//--------------

			varCss?: string;

			constantCss?: string | Function;

			setupFunction?: string | Function;

			updateFunction?: string | Function;

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

			constantCss?: string;

			setupFunction?: string | Function;

			updateFunction?: string | Function;

			options: { [key: string]: Option };

			//--------------

			editable?: boolean;
	  }
	| {
			type: "color";
			id: string;
			name: string;
			description?: string;
			showAlphaSlider?: boolean;

			value: string;

			//--------------

			varCss?: string;

			constantCss?: string | Function;

			setupFunction?: string | Function;

			updateFunction?: string | Function;

			//--------------

			editable?: boolean;
	  }
	| {
			type: "textInput";
			id: string;
			name: string;
			description?: string;

			value: string;

			updateFunction?: string | ((value: string) => void);

			//--------------
			editable?: boolean;
	  }
	| {
			type: "imageInput";
			id: string;
			name: string;
			description?: string;

			value: string;
			maxFileSize: number;

			//--------------
			editable?: boolean;
	  }
	| {
			type: "previewImage";
			id: string;

			//--------------
			editable?: boolean;
	  }
	| {
			type: "custom";
			id: string;

			//--------------

			constantCss?: string | ((value: any) => string);
			setupFunction?: string | Function;
			setup_?: string | Function;
			uiFunction?: string | Function;

			//--------------

			editable?: boolean;
	  }
	| {
			type: "combineSettings";
			id?: string;
			name?: string;
			description?: string;
			syncId: string[];
			updateFunction?: string;
			editable?: boolean;
	  };
