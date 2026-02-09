const log_colors = {
	main: "color: #bada55",
	info: "color: #00ffff",
	warn: "color: #ffae00",
	error: "color: #ff0000",
	category: "color: #6a6a6a",
};

export interface LogConfig {
	[level: string]: {
		[category: string]: boolean;
	};
}

// Default configuration
const debug_config: LogConfig = {
	info: {
		save_root_value: true,
		drag: true,
		ui: true,
	},
	error: {
		all: true,
	},
};

export const set_logger_config = (config: Partial<LogConfig>) => {
	for (const level in config) {
		if (!debug_config[level]) debug_config[level] = {};
		Object.assign(debug_config[level], config[level]);
	}
};

const should_log = (level: string, category: string): boolean => {
	const lvl = level.toLowerCase();
	const cat = category.toLowerCase();
	return !!(debug_config[lvl]?.all || debug_config[lvl]?.[cat]);
};

export const logger = {
	log: (level: string, category: string, ...args: any[]) => {
		if (should_log(level, category)) {
			const prefix = `%c StyleShift %c [${level.toUpperCase()}] %c [${category.toUpperCase()}]`;
			const style_main = log_colors.main;
			let style_level = log_colors[level.toLowerCase()] || log_colors.info;
			const style_category = log_colors.category;

			if (level.toLowerCase() === "error") {
				style_level = "color: #ff0000";
				console.error(prefix, style_main, style_level, style_category, ...args);
			} else if (level.toLowerCase() === "warn") {
				style_level = "color: #ffae00";
				console.warn(prefix, style_main, style_level, style_category, ...args);
			} else {
				console.log(prefix, style_main, style_level, style_category, ...args);
			}
		}
	},

	info: (category: string, ...args: any[]) => logger.log("info", category, ...args),
	error: (category: string, ...args: any[]) => logger.log("error", category, ...args),
	warn: (category: string, ...args: any[]) => logger.log("warn", category, ...args),
};

if (typeof window !== "undefined") {
	if (!(window as any).StyleShift) (window as any).StyleShift = {};
	(window as any).StyleShift.logger = logger;
}
