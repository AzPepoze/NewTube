const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const release_dir = path.join(__dirname, "../out/release");
if (!fs.existsSync(release_dir)) {
    fs.mkdirSync(release_dir, { recursive: true });
}

function zip(input_dir, output) {
	const output_stream = fs.createWriteStream(output);

	const archive = archiver("zip", {
		zlib: { level: 9 },
	});

	output_stream.on("close", function () {
		console.log(`Created zip file: ${output} (${archive.pointer()} total bytes)`);
	});

	archive.on("error", function (err) {
		throw err;
	});

	archive.pipe(output_stream);
	archive.directory(input_dir, false);
	archive.finalize();
}

fs.readdirSync(path.join(__dirname, "../out/dist")).forEach((file) => {
	zip(path.join(__dirname, "../out/dist", file), path.join(__dirname, "../out/release", file + ".zip"));
});

export {};
