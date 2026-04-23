const colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	cyan: "\x1b[36m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
	magenta: "\x1b[35m",
};

export const log = {
	info: (msg: string) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
	success: (msg: string) => console.log(`${colors.green}✔${colors.reset} ${msg}`),
	warn: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
	error: (msg: string, err?: any) => {
		console.error(`${colors.red}✘${colors.reset} ${msg}`);
		if (err) console.error(err);
	},
	step: (msg: string) => console.log(`${colors.bright}${colors.magenta}➜${colors.reset} ${msg}`),
	header: (title: string) => {
		console.log(`\n${colors.bright}-----------------------------------------${colors.reset}`);
		console.log(`${colors.bright}${title}${colors.reset}`);
		console.log(`${colors.bright}-----------------------------------------${colors.reset}`);
	},
};
