const fs = require('fs');
const path = require('path');

const invalid = [];

const root = (process.argv.length >= 3 && process.argv[2]) || process.cwd();
if (!root || !fs.existsSync(root) || !(fs.lstatSync(root).isDirectory() || root.endsWith('.json'))) {
	console.error(`Invalid root path: ${root}`);
	process.exit(1);
}

console.log(`Finding bad json in ${root}`);

enumerateAllJsonFiles(root);

if (!invalid.length) {
	console.log('No errors detected.');
} else {
	invalid.forEach(x => console.log(`	${JSON.parse(x).replace(root, '')}`));
}

function enumerateAllJsonFiles(directory) {
	if (!directory || !fs.lstatSync(directory).isDirectory())
	{
		if (directory.endsWith('.json')) {
			try {
				require(directory);
			} catch (e) {
				invalid.push(JSON.stringify(e.message, null, ' '));
			}
		}
		return;
	}

	const files = fs.readdirSync(directory);
	files.forEach(x => enumerateAllJsonFiles(path.join(directory, x)));
}
