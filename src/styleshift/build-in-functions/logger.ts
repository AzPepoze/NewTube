export interface LogConfig {
	[level: string]: {
		[category: string]: boolean;
	};
}

// Default configuration
const debug_config: LogConfig = {
	info: {
		save: true,
		drag: true,
		ui: true,
	},
	error: {
		all: true,
	},
};

/**
 * Updates the logger configuration.
 * @example
 * set_logger_config({ info: { drag: false } });
 */
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

/**
 * Main logger utility
 */
export const logger = {
	log: (level: string, category: string, ...args: any[]) => {
		if (should_log(level, category)) {
			const prefix = `[${level.toUpperCase()}] [${category.toUpperCase()}]`;
			if (level.toLowerCase() === "error") {
				console.error(prefix, ...args);
			} else if (level.toLowerCase() === "warn") {
				console.warn(prefix, ...args);
			} else {
				console.log(prefix, ...args);
			}
		}
	},

	info: (category: string, ...args: any[]) => logger.log("info", category, ...args),
	error: (category: string, ...args: any[]) => logger.log("error", category, ...args),
	warn: (category: string, ...args: any[]) => logger.log("warn", category, ...args),
};
