export type Category = {
	category: string | CategoryNameWithIcon;
	rainbow?: boolean;
	layout?: "list" | "grid";
	selector?: string;

	editable?: boolean;
	settings: Setting[];
	highlightColor?: string;
	Highlight_color?: string;
	Selector?: string;
};

export type CategoryNameWithIcon = { icon: string; label: string };
export type SeparateCategory = { isHeader: boolean; label: string };

export type Option = {
	label: string;
	value: string;
	enableCss?: string;

	enableFunction?: string | Function;
	disableFunction?: string | Function;
};

export type Color_obj = {
	hex: string;
	alpha: number;
};

export type BaseSetting = {
	hoverPreview?: false | { selectors: string[] };
	lock?: {
		condition: boolean;
		message?: string;
	};
	require?: Record<string, any>;
	quickCustomize?: any;
};

export type Setting = (
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
			iconSize?: number;
			iconScale?: number;
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

			options: Option[];

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
			title?: string;
			preset?: "default" | "topbar" | "banner" | "card" | "avatar";
			settingIds?: {
				url?: string;
				size?: string;
				positionX?: string;
				positionY?: string;
				cropTop?: string;
				cropBottom?: string;
				cropLeft?: string;
				cropRight?: string;
				flip?: string;
			};
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
			type: "combineSetting";
			id?: string;
			name?: string;
			description?: string;
			settingIds: string[];
			updateFunction?: string;
			editable?: boolean;
	  }
	| {
			type: "conditionSetting";
			id?: string;
			name?: string;
			description?: string;
			condition: { [key: string]: any };
			enableCss?: string;
			disableCss?: string;
			enableFunction?: string | Function;
			disableFunction?: string | Function;
			editable?: boolean;
	  }
	| {
			type: "keyboardShortcuts";
			id?: string;
			name?: string;
			description?: string;
			editable?: boolean;
	  }
	| {
			type: "group";
			id?: string;
			text: string;
			leftSeparator?: boolean;
			editable?: boolean;
	  }
	| {
			type: "selectorInput";
			id: string;
			name: string;
			description?: string;
			value: string;
			updateFunction?: string | ((value: string) => void);
			editable?: boolean;
	  }
) &
	BaseSetting;
