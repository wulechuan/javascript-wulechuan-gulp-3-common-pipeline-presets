const globs = require('globs');
const gulp = require('gulp');
const renameFiles = require('gulp-rename');
const pump = require('pump');
const chalk = require('chalk');

module.exports = function createTaskForCopyingFiles(sourceGlobsToCopy, outputFolderPath, options = {}) {
	const {
		logPrefix = 'Unspeficied task',
		descriptionOfAssetsToCopy = '',
		shouldListSourceFiles = true,
		shouldNotLogDetails = false,

		shouldFlattenSubFolders = false,
		outputFileTypeWithDot = null,
		forSingleInputFileChangeOuputFileBaseNameInto = '',
	} = options;


	return function taskBody(thisTaskIsDone) {
		const resolvedFileList = globs.sync(sourceGlobsToCopy);

		if (! shouldNotLogDetails) {
			let descriptionOrDetailedList;

			if (shouldListSourceFiles) {
				const resolvedFileListString = resolvedFileList.length > 0 ?
					JSON.stringify(resolvedFileList, null, 4).slice(2, -2) :
					`    ${chalk.red('<nothing>')}`;

				descriptionOrDetailedList = `copying globs:\n${
					chalk.blue(JSON.stringify(sourceGlobsToCopy, null, 4).slice(2, -2).replace(/\\\\/g, '/'))
				}\nwhich resolved to:\n${
					resolvedFileListString
				}`;

			} else {

				const descriptionOfAssets = descriptionOfAssetsToCopy ?
					` ${chalk.magenta(descriptionOfAssetsToCopy)}` :
					'';
				descriptionOrDetailedList = `copying${descriptionOfAssets}...`;

			}

			console.log(`\n${
				chalk.bgGreen.black(` ${logPrefix} `)
			}\n${
				descriptionOrDetailedList
			}\ninto:\n    ${
				chalk.green(outputFolderPath)
			}`);
		}




		let shouldRenameOutputFiles = false;
		const renamingConfig = {};

		if (forSingleInputFileChangeOuputFileBaseNameInto) {
			if (resolvedFileList.length === 1) {

				shouldRenameOutputFiles = true;
				renamingConfig.basename = forSingleInputFileChangeOuputFileBaseNameInto;

			} else if (resolvedFileList.length > 1) {

				console.log(`\n${
					chalk.bgYellow.black(` ${logPrefix} `)
				}\n\ta file base name for the output file is provided, being "${
					forSingleInputFileChangeOuputFileBaseNameInto
				}", while there are more than 1 input files (${
					resolvedFileList.length
				} in total) to copy.\nSo the output file base name will NOT be used at all.`);
			}
		}

		if (outputFileTypeWithDot) {
			shouldRenameOutputFiles = true;
			renamingConfig.extname = outputFileTypeWithDot;
		}

		if (shouldFlattenSubFolders) {
			shouldRenameOutputFiles = true;
			renamingConfig.dirname = '';
		}




		const stepsToTake = [];

		stepsToTake.push(gulp.src(sourceGlobsToCopy));

		if (shouldRenameOutputFiles) {
			stepsToTake.push(renameFiles(renamingConfig));
		}

		stepsToTake.push(gulp.dest(outputFolderPath));

		return pump(stepsToTake, thisTaskIsDone);
	};
};