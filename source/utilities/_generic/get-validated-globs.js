module.exports = function getValidatedGlobsFrom({ rawGlobs, defaultValue }) {
	let arraylizedRawGlobs = rawGlobs;

	if (! arraylizedRawGlobs) {
		arraylizedRawGlobs = defaultValue;
	}

	if (! Array.isArray(arraylizedRawGlobs)) {
		arraylizedRawGlobs = [arraylizedRawGlobs];
	}

	const validatedGlobs = arraylizedRawGlobs.reduce((accum, glob) => {
		if (typeof glob === 'string') {
			accum.push(glob);
		}

		return accum;
	}, []);

	return validatedGlobs;
};