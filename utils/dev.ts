import { spawn } from "child_process";
import path from "path";

const args = process.argv.slice(2);
const target = args.includes("--firefox") ? "firefox" : "chromium";

const commands = [
	{
		name: "js",
		command: "bun run dev:js",
		color: "cyan"
	},
	{
		name: "css",
		command: "bun run dev:css",
		color: "magenta"
	},
	{
		name: "browser",
		command: `bun run test:${target}`,
		color: "green"
	}
];

console.log(`Starting NewTube development environment for ${target}...`);

const names = commands.map(commandItem => commandItem.name).join(",");
const colors = commands.map(commandItem => commandItem.color).join(",");

const child = spawn("bun", [
	"concurrently",
	"--names", names,
	"--prefix-colors", colors,
	"--kill-others",
	"--raw",
	...commands.map(commandItem => commandItem.command)
], {
	stdio: "inherit",
	cwd: path.join(__dirname, "..")
});

child.on("exit", (code) => {
	process.exit(code || 0);
});
