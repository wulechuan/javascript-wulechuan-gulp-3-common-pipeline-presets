module.exports = {
	forAGivenGlobArray: {
		appendCertainGlobsInSomePipelines: forAGlobArrayAppendCertainGlobsInSomePipelines,
		excludeCertainGlobsInSomePipelines: forAGlobArrayExcludeCertainGlobsInSomePipelines,
	},
};




function toRoughlyValidateAnArrayOfPipelineSettings(validatedPipelines, globsPropertyNameOfAPipeline) {
	if (! Array.isArray(validatedPipelines) || validatedPipelines.length < 1) {
		return;
	}





	// Let's take a sample setting to check whether the pipelineSettingsArray is valid.
	const [ samplePipelineToCheck ] = validatedPipelines;
	if (! samplePipelineToCheck || typeof samplePipelineToCheck !== 'object') {
		throw TypeError('An invalid pipeline settings encountered.');
	}

	const sampleGlobsToCheck = samplePipelineToCheck[globsPropertyNameOfAPipeline];

	if (
		(! sampleGlobsToCheck) &&
		(typeof sampleGlobsToCheck !== 'string' || ! Array.isArray(sampleGlobsToCheck))
	) {
		throw ReferenceError(`Pipeline settings do not contain a glob-relatived property named "${
			globsPropertyNameOfAPipeline
		}"`);
	}



	// The pipelineSettingsArray seems to be valid.
	return validatedPipelines;
}


function forAGlobArrayExcludeCertainGlobsInSomePipelines({
	globArrayToExcludeThingsOutOf,
	globsPropertyNameOfAPipeline,
	pipelines,
}) {
	const validatedPipelines = toRoughlyValidateAnArrayOfPipelineSettings(
		pipelines,
		globsPropertyNameOfAPipeline
	);


	validatedPipelines.forEach(pipelineSettings => {
		const theSaidCertainGlobsOfAPipeline = pipelineSettings[globsPropertyNameOfAPipeline];

		theSaidCertainGlobsOfAPipeline.forEach(
			glob => globArrayToExcludeThingsOutOf.push(`!${glob}`)
		);
	});
}

function forAGlobArrayAppendCertainGlobsInSomePipelines({
	globArrayToAppendThingsTo,
	globsPropertyNameOfAPipeline,
	pipelines,
}) {
	const validatedPipelines = toRoughlyValidateAnArrayOfPipelineSettings(
		pipelines,
		globsPropertyNameOfAPipeline
	);


	validatedPipelines.forEach(pipelineSettings => {
		const theSaidCertainGlobsOfAPipeline = pipelineSettings[globsPropertyNameOfAPipeline];

		theSaidCertainGlobsOfAPipeline.forEach(
			glob => globArrayToAppendThingsTo.push(glob)
		);
	});
}