module.exports = function forAGlobArrayExcludeGlobsInPipelines({
	globArrayToExcludeThingsOutOf,
	globsPropertyNameOfAPipelineSettings,
	pipelineSettingsArray,
}) {
	if (! Array.isArray(pipelineSettingsArray) || pipelineSettingsArray.length < 1) {
		return;
	}





	// Let's take a sample setting to check whether the pipelineSettingsArray is valid.
	const [ samplePipelineToCheck ] = pipelineSettingsArray;
	if (! samplePipelineToCheck || typeof samplePipelineToCheck !== 'object') {
		throw TypeError('An invalid pipeline settings encountered.');
	}

	const sampleGlobsToCheck = samplePipelineToCheck[globsPropertyNameOfAPipelineSettings];

	if (
		(! sampleGlobsToCheck) &&
		(typeof sampleGlobsToCheck !== 'string' || ! Array.isArray(sampleGlobsToCheck))
	) {
		throw ReferenceError(`Pipeline settings do not contain a glob-relatived property named "${
			globsPropertyNameOfAPipelineSettings
		}"`);
	}





	// The pipelineSettingsArray seems to be valid.
	pipelineSettingsArray.forEach(pipelineSettings => {
		pipelineSettings[globsPropertyNameOfAPipelineSettings].forEach(
			glob => globArrayToExcludeThingsOutOf.push(`!${glob}`)
		);
	});
};