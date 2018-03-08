const gulp = require('gulp');
const renameFile = require('gulp-rename');
const compileStylus = require('gulp-stylus');
const pump = require('pump');

const printInfoAboutTheCompletionOfTask = require('../utils/print-one-task-done');
const printGulpErrorBeautifully = require('@wulechuan/javascript-gulp-plugin-error-printer');

module.exports = function createTaskForCompilingStylusGlobs(entryStylusGlobs, options) {
	const {
		compiledCSSOutputFolder,
		compiledCSSFileBaseName,
		basePathForShorteningPathsInLog,
		shouldNotGenerateMinifiedVersions = false,
	} = options;

	const compilationOptions = {
		prefix: false,
		compress: false,
	};

	return function taskBody(thisTaskDoneCallback) {
		const taskSteps = [];

		taskSteps.push(gulp.src(entryStylusGlobs));
		taskSteps.push(compileStylus(compilationOptions));
		taskSteps.push(gulp.dest(compiledCSSOutputFolder));

		if (! shouldNotGenerateMinifiedVersions) {
			const compilationOptions2 = Object.assign({}, compilationOptions);
			compilationOptions2.compress = true;

			taskSteps.push(gulp.src(entryStylusGlobs));
			taskSteps.push(compileStylus(compilationOptions2));
			taskSteps.push(renameFile({
				base: compiledCSSFileBaseName,
				suffix: '.min',
			}));
			taskSteps.push(gulp.dest(compiledCSSOutputFolder));
		}

		pump(taskSteps, (error) => {
			if (error) {
				printGulpErrorBeautifully(error, basePathForShorteningPathsInLog);
			}

			printInfoAboutTheCompletionOfTask('Compiling Stylus into CSS', !!error);
			thisTaskDoneCallback();
		});
	};
};