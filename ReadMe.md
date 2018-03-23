<link rel="stylesheet" href="./node_modules/@wulechuan/css-stylus-markdown-themes/dist/default.css">

# NPM Package

<dl>
<dt>Package Name</dt>
<dd>

[@wulechuan/gulp-3-common-pipeline-presets](https://www.npmjs.com/package/@wulechuan/gulp-3-common-pipeline-presets)

</dd>
<dt>Author</dt>
<dd><p>南昌吴乐川</p></dd>
</dl>


# Introduction

This is a collection of pipeline presets for [gulp](https://gulpjs.com/).


# Usage

An npm script entry of this repository has been setup
to run a tryout project as a demostration.
So people can try these presets right here inside this repository
before they decide to use them elsewhere.

See below [Try It Out, See It in Action](#try-it-out-see-it-in-action).



## Example Codes

See the `gulpfile.js` included by this repository as an example.

Below are some snippets of the said `gulpfile.js`.

### To create a pipeline for copying some files
```javascript
const gulp3CommonPipelines = require('@wulechuan/gulp-3-common-pipeline-presets');
const buildAPipelineForCopyingSomeFiles = gulp3CommonPipelines.genericPipelines.copyFiles;

const frontEndTestSitePipelineForCopyingJavaTemplates = buildAPipelineForCopyingSomeFiles({
	taskNameKeyPart: 'Java Templates (*.vm)',
	sourceBasePath: javaOrDjangoPageTemplatesPath,
	globsToCopyRelativeToSoureBasePath: [ '**/*.vm' ],
	// globsToExclude: [],
	outputBasePathOfCopying: frontEndTestSiteHTMLPath,
});
```



### To create multiple pipelines for concatenation of some javascript source files

```javascript
const gulp3CommonPipelines = require('@wulechuan/gulp-3-common-pipeline-presets');

const buildAJavascriptBuildingPipelineForOneAppOrOnePage = gulp3CommonPipelines.specificPipelines.js.concat;



const commonSettingsAcrossMultipleJavascriptPipelines = {
	sourceBasePath: 'source/javascript',
	outputBasePathOfBuilding: '../static/js',
	shouldCopyBuiltFileToElsewhere: true,
	outputBasePathOfCopying: 'build/test-site/',
};

const buildingCommonEntryGlobsRelativeToSourceBasePath = [
	joinPath('common', '/**/*.js'),
];

const allJavascriptBuildingPipelines = [
	buildAJavascriptBuildingPipelineForOneAppOrOnePage({
		...commonSettingsAcrossMultipleJavascriptPipelines,

		taskNameKeyPart:         'For a Fake Java Tempalte',
		builtSingleFileBaseName: 'page-a-java-served-web-page',
		buildingEntryGlobsRelativeToSourceBasePath: [
			...buildingCommonEntryGlobsRelativeToSourceBasePath,
			joinPath('page-a-java-page', '/**/*.js'),
		],
	}),
	buildAJavascriptBuildingPipelineForOneAppOrOnePage({
		...commonSettingsAcrossMultipleJavascriptPipelines,

		taskNameKeyPart:         'For a Fake Django Tempalte',
		builtSingleFileBaseName: 'page-a-django-page',
		buildingEntryGlobsRelativeToSourceBasePath: [
			...buildingCommonEntryGlobsRelativeToSourceBasePath,
			joinPath('page-a-django-page', '/**/*.js'),
		],
	}),
];
```



## Try It Out, See It in Action

There is a dummy project included within this repository,
so that people can try this watchers controller without difficulty.

The said dummy project locates here:
```sh
<this repository root folder>/try-it-out/a-dummy-django-or-java-project
```


#### Before You Try

Before you can start trying,
you first need to install all dependencies for this npm project.

> This is a one time action, you don't need to do it
> every time before you run the tryout script.

Open a console/terminal and run:
```sh
npm install
```
or even simpler:
```sh
npm i
```

#### Run the Tryout Script

Open a console/terminal and run:
```sh
npm start
```
That's it.



### A Snapshos of Mine

Here is a snapshots of my console,
hosted within Microsoft
[Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/about),
running an Ubuntu instance.

![Just started](./docs/illustrates/console-snapshot-001.png "After some random changes")



# API

## Task Concept

A **task** is created by a **task creator function**.
So, all you can making use of are `Function`s.

You call a creator function, you get a task,
More specifically, you get another function, which is the task body.

### Task Body

A task body is a function, taking a single argument as a callback function.

A task body function is usually created by another function, aka the creator.
Thus we have the opportunity to customize the task.
Otherwise we might only be able to create identical task bodies,
which doesn't make sense.

So there are 3 functions involved:
1. The function to create the task body;
2. The function being the task body;
3. The function as the argument of the task body.

## Task Creators List

### Copying-files Task Creator

-   arguments[0]: `sourceGlobsToCopy` : `String` or `Array`
	**Required**.

-   arguments[1]: `outputFolderPath` : `String`
	**Required**.

-   arguments[2]: `options` : `object` or `null`
    **Optional**.

	```javascript
	let options = {
		/* Just for logging */
		logPrefix = 'Unspeficied task',

		/* `true` to log more details. */
		shouldNotLogDetails = false,

		/* If detail logging is allowed,
		 * and this one being `true`,
		 * then every single involved file will be logged. */
		shouldListSourceFiles = true,

		/* If detail logging is allowed
		 * While listing source files is **not** allowed,
		 * then this string will be logged, just for human
		 * to easier undertand what's going on. */
		descriptionOfAssetsToCopy = '',

		shouldFlattenSubFolders = false,

		/* For example: '.html' */
		outputFileTypeWithDot = null,

		/* For example: 'default' */
		forSingleInputFileChangeOuputFileBaseNameInto = '',
	};
	```

### CSS-Stylus-compilation Task Creator

-   arguments[0]: `entryStylusGlobs` : `String` or `Array`
    **Required**.

	All `.styl` files that are treated as compilation entries.

-   arguments[1]: `options` : `Object`
    **Required**.

	```javascript
	let options = {
		taskNameForLogs = '',
		compiledCSSOutputFolder,
		compiledCSSFileBaseName,
		basePathForShorteningPathsInLog,
		shouldNotGenerateMinifiedVersions = false,
	}
	```

	> Note
	> that the **non-minified** css
	> is **always** generated.

### JavaScript-concatenation Task Creator

-   arguments[0]: `sourceGlobsOfJavascript` : `String` or `Array`
    **Required**.

	All `.js` files to concatenate into a single output js file.

-   arguments[0]: `options` : `Object`
    **Required**.

	```javascript
	{
		taskNameForLogs = '',
		compiledJavascriptOutputFolder,
		compiledJavascriptFileBaseName,
		basePathForShorteningPathsInLog,
		shouldNotGenerateMinifiedVersions = false,
	}
	```

	> Note
	> that the **non-minified** js
	> is **always** generated.



## Pipeline Concept

A **pipeline** is basically a set of
tasks that are connected to each other,
and work as one union piece in most cases.

An implementation of a pipeline is
nothing more than a regular object literal,
that holding some information,
and being an interface as a whole.
So obviously we can also call a pipeline
a **pipeline object**.

Though pipelines are different from each others,
they do have some common points.
Any pipeline implementation
always contains these properties:

1.  A descriptive name for logging messages or errors
    in the console.
	This name stores in the `pipelineFullName` property
	of the pipeline object.

1.  A pair of properties together build up
    those globs for watching: the `watchingBasePath`,
	and the `watchingGlobsRelativeToWatchingBasePath`.

	> It's worth to point out that
	> the globs for watching is often
	> **different** from those as processing entries points.
	> For example, when compiling a set of `Stylus` files,
	> one might need only one entry `.styl` file,
	> but need to watch all `.styl` files,
	> so that any change of any file among those are watched,
	> a new compilation should trigger.

1.  A task body function named `actionToTakeOnSourceFilesChange`,
	used as the action to trigger whenever a file covered
	in the globs metioned in (2) changes.

1.  A task for deleting built files metioned in (1).
    The task name stores in the `taskNameofDeletingFiles` property
	of the pipeline object.
	The task body function stores in the `toClean` property
	of the pipeline object.

1.  A task as the so-called main task.
	The task name stores in the `taskNameOfMainTask` property
	of the pipeline object.

	> The task body function also stores in the pipeline object,
	> but in variant property names
	> across different pipeline types.

> Watching machanism is prepared
> but **not** set up for a pipeline.
> This means a pipeline object carries
> enought information for setting a watcher
> later, **manually**.
>
> By the way, the naming convention
> of these information matches another
> npm package of mine, [@wulechuan/scoped-glob-watchers](https://www.npmjs.com/package/@wulechuan/scoped-glob-watchers).
> But theoretically, since the infomation is complete,
> any watching machanism will work,
> as long as an interface mapper is provided.

## Pipeline Creator
Since a pipeline is built upon a set of tasks,
a **pipeline creator** utilizes some **task creators**.

A pipeline creator is a `Function`
for creating a pipeline object.
The creator takes some options(usually a single option)
so that we can customize the pipeline object to create and `return`.




## Availabe Pipeline Creators List

### Copying Files Pipeline Creator

-   arguments[0]: `options` : `Object`
    **Required**.

	```javascript
	let options = {
		/* logging */

		// e.g. 'Javascript' or '爪哇脚本'
		pipelineCategory,

		// e.g. 'Page: User Dashboard' or maybe just 'App'
		taskNameKeyPart,

		// e.g. 'front-end/source/js' or 'front-end/source',
		// basically any path you prefer.
		basePathForShorteningPathsInLog = '',



		/* source */

		// e.g. 'front-end/source/js'
		sourceBasePath = process.pwd(),

		// e.g. [ '**/*.js' ]
		buildingEntryGlobsRelativeToSourceBasePath,

		watchingBasePath,

		// e.g. [ '**/*.js' ]
		watchingGlobsRelativeToWatchingBasePath,



		/* building(concatenation) */

		/* e.g. '../static' or 'dist/assets' */
		outputBasePathOfBuilding,

		// e.g. [ 'app.js' ]
		builtGlobsRelativeToOutputBasePathOfBuilding = [],

		/* A function to create another function,
		 * the created function will be used
		 * as the task body of the building process
		 * upon source globs. */
		toCreateBuildingTaskBody,



		/* copying */

		/* Obviously the switch */
		shouldCopyBuiltFileToElsewhere = false,

		/* e.g. 'build/tryout-website/assets' */
		outputBasePathOfCopying,

		/* This will be directly passed to
		 * the instance of the copying files task. */
		optionsOfCopyingFiles,
	}
	```


### Generic Skeleton For Building Pipelines Creator

-   arguments[0]: `options` : `Object`
    **Required**.
	```javascript
	let options = {
		/* logging */

		/* e.g. 'Javascript' or '爪哇脚本' */
		pipelineCategory,


		/* e.g. 'Page: User Dashboard' or maybe just 'App' */
		taskNameKeyPart,


		/* e.g. 'front-end/source/js', or 'front-end/source'.
		 * Basically any path you prefer. */
		basePathForShorteningPathsInLog = '',



		/* source */

		/* e.g. 'front-end/source/js' */
		sourceBasePath = process.pwd(),


		// e.g. [ '**/*.js' ]
		buildingEntryGlobsRelativeToSourceBasePath,

		watchingBasePath,

		// e.g. [ '**/*.js' ]
		watchingGlobsRelativeToWatchingBasePath,



		/* building */

		/* e.g. '../static' or 'dist/assets' */
		outputBasePathOfBuilding,

		builtGlobsRelativeToOutputBasePathOfBuilding = [],

		/* A function to create another function,
		 * the created function will be used
		 * as the task body of the building process
		 * upon source globs. */
		toCreateBuildingTaskBody,



		/* copying */

		shouldCopyBuiltFileToElsewhere = false,

		/* e.g. 'build/tryout-website/assets' */
		outputBasePathOfCopying,

		/* This will be directly passed to
		 * the instance of the copying files task. */
		optionsOfCopyingFiles,
	}
	```

### CSS Stylus Compilation Pipeline Creator

-   arguments[0]: `options` : `Object`
    **Required**.

	```javascript
	{
		/* logging */

		taskNameKeyPart,
		basePathForShorteningPathsInLog,         /* optional */



		/* sources */

		sourceBasePath,
		buildingEntryGlobsRelativeToSourceBasePath,
		watchingBasePath,
		watchingGlobsRelativeToWatchingBasePath, /* optional */



		/* building */

		outputBasePathOfBuilding,
		builtSingleFileBaseName,
		shouldNotGenerateMinifiedVersions = false,



		/* copying */

		shouldCopyBuiltFileToElsewhere = false,
		outputBasePathOfCopying,                 /* optional */
		optionsOfCopyingFiles,                   /* optional */
	}
	```


### Javascript Concatenation Pipeline Creator

-   arguments[0]: `options` : `Object`
    **Required**

	```javascript
	{
		/* logging */

		taskNameKeyPart,
		basePathForShorteningPathsInLog,            /* optional */



		/* sources */

		sourceBasePath,
		buildingEntryGlobsRelativeToSourceBasePath, /* optional */
		watchingBasePath,                           /* optional */
		watchingGlobsRelativeToWatchingBasePath,    /* optional */



		/* building */

		outputBasePathOfBuilding,
		builtSingleFileBaseName,
		shouldNotGenerateMinifiedVersions = false,



		/* copying */

		shouldCopyBuiltFileToElsewhere = false,
		outputBasePathOfCopying,                    /* optional */
		optionsOfCopyingFiles,                      /* optional */
	}
	```

	> Note
	> that the **non-minified** js
	> is **always** generated.




## Some Pipeline Objects

### The Copying Files Pipeline Object

```javascript
const pipeline = {
	/* logging */
	pipelineFullName,


	/* globs of pipeline */
	resolvedPathsOfGlobsToCopy,
	resolvedPathsOfGlobsToDeleteBeforeCopyingAgain,


	/* globs for watching */
	watchingBasePath,
	watchingGlobsRelativeToWatchingBasePath,


	/* task names */
	taskNameOfMainTask,
	taskNameOfDeletingFiles,
	taskNameOfCopyingFiles,


	/* task bodies */
	toClean,
	toCopy,


	/* Obviously this is the action
	 * to trigger on watched changes. */
	actionToTakeOnSourceFilesChange,
};
```


### The CSS Stylus Compilation Pipeline Object and The Javascript Concatenation Pipeline Object

```javascript
const pipeline = {
	/* logging */
	pipelineFullName,


	/* globs of pipeline */
	resolvedPathsOfEntryGlobsForBuilding,
	resolvedPathsOfBuiltGlobs,
	resolvedPathsOfGlobsToDeleteBeforeEachBuild,


	/* globs for watching */
	watchingBasePath,
	watchingGlobsRelativeToWatchingBasePath,


	/* task names */
	taskNameOfMainTask,
	taskNameOfDeletingFiles,
	taskNameOfBuilding: taskNameOfDeletingOldOutputFilesAndThenBuilding,


	/* task bodies */
	toClean: taskBodyOfDeletingFiles,
	toBuild: taskBodyOfDeletingOldOutputFilesAndThenBuilding,


	/* Obviously this is the action
	 * to trigger on watched changes. */
	actionToTakeOnSourceFilesChange,


	/* These properties are available
	 * if and only if copying file task is allowed. */
	resolvedPathsOfGlobsToCopyAfterEachBuild,
	resolvedPathsOfCopiesOfBuiltGlobs,
	taskNameOfBuildingAndThenCopying,
};
```