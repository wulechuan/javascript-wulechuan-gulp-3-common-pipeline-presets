module.exports = function forAGlobArrayExcludeGlobsInPipelines({
	globArrayToExcludeThingsOutOf,
	globsPropertyNameOfAPipelineSettings,
	pipelineSettingsArray,
}) {
	if (! Array.isArray(pipelineSettingsArray) || pipelineSettingsArray.length < 1) {
		return;
	}

	const [ samplePipelineToCheck ] = pipelineSettingsArray;
	if (! samplePipelineToCheck || typeof samplePipelineToCheck !== 'object') {
		throw TypeError('A invalid pipeline settings encountered.');
	}

	const sampleGlobsToCheck = samplePipelineToCheck[globsPropertyNameOfAPipelineSettings];

	if (
		! sampleGlobsToCheck

		&&

		(
			typeof sampleGlobsToCheck !== 'string' || ! Array.isArray(sampleGlobsToCheck)
		)
	) {
		throw ReferenceError(`Pipeline settings do not contain a glob-relatived property named "${
			globsPropertyNameOfAPipelineSettings
		}"`);
	}

	pipelineSettingsArray.forEach(pipelineSettings => {
		pipelineSettings[globsPropertyNameOfAPipelineSettings].forEach(
			glob => globArrayToExcludeThingsOutOf.push(`!${glob}`)
		);
	});
};