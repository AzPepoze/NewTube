import { stringToColor } from "../styleshift/utils/logFormat";

const logColors = {
	main: "color: #bada55",
	info: "color: #00ffff",
	debug: "color: #d1d1ff",
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
const debugConfig: LogConfig = {
	info: {
		all: true,
	},
	debug: {
		all: true,
	},
	warn: {
		all: true,
	},
	error: {
		all: true,
	},
};

export const setLoggerConfig = (config: Partial<LogConfig>) => {
	for (const level in config) {
		if (!debugConfig[level]) debugConfig[level] = {};
		Object.assign(debugConfig[level], config[level]);
	}
};

const shouldLog = (level: string, category: string): boolean => {
	const lvl = level.toLowerCase();
	const cat = category.toLowerCase();
	return !!(debugConfig[lvl]?.all || debugConfig[lvl]?.[cat]);
};

export const logger = {
	log: (level: string, category: string, ...args: any[]) => {
		if (shouldLog(level, category)) {
			const prefix = `%c StyleShift %c [${level.toUpperCase()}] %c [${category.toUpperCase()}]`;
			const styleMain = logColors.main;
			const styleLevel = logColors[level.toLowerCase()] || logColors.info;
			const styleCategory = stringToColor(category);

			switch (level.toLowerCase()) {
				case "error":
					console.error(prefix, styleMain, styleLevel, styleCategory, ...args);
					break;
				case "warn":
					console.warn(prefix, styleMain, styleLevel, styleCategory, ...args);
					break;
				case "info":
					console.info(prefix, styleMain, styleLevel, styleCategory, ...args);
					break;
				case "debug":
					console.debug(prefix, styleMain, styleLevel, styleCategory, ...args);
					break;
				default:
					console.log(prefix, styleMain, styleLevel, styleCategory, ...args);
					break;
			}
		}
	},

	info: (category: string, ...args: any[]) => logger.log("info", category, ...args),
	debug: (category: string, ...args: any[]) => logger.log("debug", category, ...args),
	error: (category: string, ...args: any[]) => logger.log("error", category, ...args),
	warn: (category: string, ...args: any[]) => logger.log("warn", category, ...args),
};

if (typeof window !== "undefined") {
	if (!(window as any).StyleShift) (window as any).StyleShift = {};
	(window as any).StyleShift.logger = logger;

	const originalConsoleError = console.error;
	console.error = (category: string, ...args: any[]) => {
		if (args.length > 0) {
			originalConsoleError(...args);
			logger.log("error", category, ...args);
		} else {
			originalConsoleError(category);
			logger.log("error", "system", category);
		}
	};
}
