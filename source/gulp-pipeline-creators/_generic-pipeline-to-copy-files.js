module.exports = buildAPipelineForCopyingSomeFiles;

/*
*
*
*
*
*
*
* ****************************************
*           任务集工厂函数；工具
* ****************************************
*/

const pathTool = require('path');
const deleteFiles = require('del');

const chalk = require('chalk'); // eslint-disable-line no-unused-vars

const gulp = require('gulp');

const { join: joinPath } = pathTool;
const { sync: deleteFilesSync } = deleteFiles;

const printInfoAboutTheCompletionOfTask = require('../utils/print-one-task-done'); // eslint-disable-line no-unused-vars
const createTaskForCopyingFiles         = require('../gulp-task-creators/_generic-copy-files');


function buildAPipelineForCopyingSomeFiles({ // eslint-disable-line max-statements
	// logging
	pipelineCategory, // e.g. 'Javascript' or '爪哇脚本'
	taskNameKeyPart, // e.g. 'Page: User Dashboard' or maybe just 'App'

	// source
	sourceBasePath, // e.g. 'front-end/source/js'
	globsRelativeToSoureBasePath, // e.g. [ '**/*.js' ]
	excludedSourcGlobs, // e.g. [ 'd:/projects/something/**.* ']

	// copying
	copyingFilesOutputBasePath, // e.g. 'build/tryout-website/assets'
	copyingFilesTaskOption, // will be passed to **createTaskForCopyingFiles**
}) {
	let _excludedGlobsArray = excludedSourcGlobs;

	if (! _excludedGlobsArray) {
		_excludedGlobsArray = [];
	} else if (! Array.isArray(_excludedGlobsArray)) {
		_excludedGlobsArray = [_excludedGlobsArray];
	}


	const _validExcludedGlobs = _excludedGlobsArray.reduce((accum, glob) => {
		if (typeof glob === 'string' && !! glob) {
			const globRelativeToSourceBasePath = pathTool.relative(sourceBasePath, glob);
			if (! globRelativeToSourceBasePath.match(/^\.\.\//)) {
				accum.push(globRelativeToSourceBasePath);
			}
		}

		return accum;
	}, []);


	let _sourceGlobs = globsRelativeToSoureBasePath;

	if (! _sourceGlobs) {
		_sourceGlobs = [ '**/*' ];
	} else if (! Array.isArray(_sourceGlobs)) {
		_sourceGlobs = [_sourceGlobs];
	}

	const _validSourceGlobs = _sourceGlobs.reduce((accum, glob) => {
		if (typeof glob === 'string' && !! glob) {
			accum.push(glob);
		}

		return accum;
	}, []);


	const globsToCopy = _validSourceGlobs.map(
		glob => joinPath(sourceBasePath, glob)
	);

	const globsToDeleteBeforeCopyingAgain = _validSourceGlobs.map(
		glob => joinPath(copyingFilesOutputBasePath, glob)
	);

	_validExcludedGlobs.forEach(glob => {
		globsToCopy.push(`!${joinPath(sourceBasePath, glob)}`);
	});

	_validExcludedGlobs.forEach(glob => {
		globsToDeleteBeforeCopyingAgain.push(`!${joinPath(copyingFilesOutputBasePath, glob)}`);
	});



	const taskNameOfDeletingFiles = `Delete old files: ${pipelineCategory}: Those of ${taskNameKeyPart}`;
	const taskNameOfCopyingFiles = `Copy: ${pipelineCategory}: ${taskNameKeyPart}`;


	const taskBodyOfDeletingFiles = (thisTaskIsDone) => {
		deleteFilesSync(globsToDeleteBeforeCopyingAgain, {
			force: true, // force 为 true，是为了删除位于 npm 项目文件夹之外的文件。
		});
		// printInfoAboutTheCompletionOfTask(taskNameForDeletingFiles, false);
		thisTaskIsDone();
	};


	const usedCopyingFilesTaskOption = {
		...{
			shouldFlattenSubFolders: false,
			logPrefix: taskNameOfCopyingFiles,
			descriptionOfAssetsToCopy: `Compiled ${pipelineCategory} Files`,
			shouldNotLogDetails: true,
			shouldListSourceFiles: false,
		},

		...copyingFilesTaskOption,
	};

	const taskBodyOfCopyingFiles = createTaskForCopyingFiles(
		globsToCopy,
		copyingFilesOutputBasePath,
		usedCopyingFilesTaskOption
	);




	gulp.task(taskNameOfDeletingFiles, taskBodyOfDeletingFiles);
	gulp.task(taskNameOfCopyingFiles, [ taskNameOfDeletingFiles ], taskBodyOfCopyingFiles);



	const pipelineSettings = {
		pipelineFullName: `${pipelineCategory}: ${taskNameKeyPart}`,

		globsToCopy,
		watchingBasePath: sourceBasePath,
		globsToWatch: globsToCopy,
		globsToDeleteBeforeCopyingAgain,

		taskNameOfDeletingFiles,
		taskNameOfCopyingFiles,

		toClean:                        taskBodyOfDeletingFiles,
		toCopy:                         taskBodyOfCopyingFiles,
		actionToTakeOnSourceFileEvents: taskBodyOfCopyingFiles,
	};



	return pipelineSettings;
}
