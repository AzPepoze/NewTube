const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const RELEASE_DIR = path.join(__dirname, "../out/release");
if (!fs.existsSync(RELEASE_DIR)) {
	fs.mkdirSync(RELEASE_DIR, { recursive: true });
}

function zip(inputDir, output) {
	const outputStream = fs.createWriteStream(output);

	const archive = archiver("zip", {
		zlib: { level: 9 },
	});

	outputStream.on("close", function () {
		console.log(`Created zip file: ${output} (${archive.pointer()} total bytes)`);
	});

	archive.on("error", function (err) {
		throw err;
	});

	archive.pipe(outputStream);
	archive.directory(inputDir, false);
	archive.finalize();
}

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/extension/manifest.json"), "utf8"));
const version = manifest.version;

fs.readdirSync(path.join(__dirname, "../out/dist")).forEach((file) => {
	zip(path.join(__dirname, "../out/dist", file), path.join(__dirname, "../out/release", `newtube_${file}_${version}.zip`));
});

export { };
