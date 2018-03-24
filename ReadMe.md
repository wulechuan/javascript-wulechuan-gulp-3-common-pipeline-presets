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

See below [Try It out, See It in Action](#try-it-out-see-it-in-action).



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



## Try It out, See It in Action

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

## Concepts of Task and Task Creator

A **task** is represented by nothing else but a function,
calls the **task body**.

A task, aka a task body function, is created by another function,
the **task creator function**.
So, all you are making use of are `Function`s.
You call a creator function, you get a task body function.

A task body, being a function, takes a single `argument`,
holding a **callback function**.
Whenever the task comes to an end, we call the callback function
**inside of** the task body function, thus we tell the outside world
of the task body that the task is now finished.

Note that usually we utilize the creator function
to create the task body function.
This way we have the opportunity to customize the task.
Otherwise we might only be able to create identical task bodies,
which doesn't make sense.

In summary, there are 3 functions involved:
1. The function to create the task body;
2. The function being the task body;
3. The function as the argument of the task body.

The example below might help you understand these concepts.
```javascript
const aTaskBody = function aTaskCreator(customizationsForATask) {
	/* We might make some use of the `customizationsForATask` here. */

	return function theTaskBody(theCallbackFunction) {
		/* Do the job here,
		 * might also make some more use of the `customizationsForATask`. */
		
		/* Tell the outside world that this task is finished. */
		theCallbackFunction();
	};
};
```

## Available Task Creators List

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
But technically, those tasks **might**
be used individually.

Since tasks are basically `Function`s,
while a pipeline is a bunch of tasks
that are bound together,
a pipeline can be **run**, just like a task.

Though pipelines are different from each others,
they do have some common points.

A usable pipeline should:
-   know what's the input,
    so that an ouput will be generated throught this pipeline
	upon the said input.

-   know what files will be generated,
    so that whenever the pipeline runs again,
	it is able to automatically remove
	all output files of last run, if any.

	> It's better for a pipeline to also
	> provide a task body, aka a function,
	> to specifically remove all those output
	> files. Or at least provides the task name.
	>
	> This helps us building a compound
	> task over several pipelines, to remove
	> all output files of all these pieplines
	> in one go.
	>
	> In fact, my pipelines all provide
	> both the clean task name and the task body.
	>
	> I personally insist that a mature
	> building system should be able to
	> clean up things on demand, not just
	> create things out.

-   provide a so-called **main task**,
    so that whenever we need to run a pipeline,
	we start from this main task,
	having the confidence that all
	other tasks buried inside the pipeline
	are for sure to run automatically.

	> Besides, it would be better that all pipelines
	> of different types provide exactly
	> the same main task interface,
    > so that we are able to operate several
	> pipelines in a batch, which hopefully
	> provides an even better automation.
	>
	> For example we can collect all pipelines
	> in an array, and run all their main tasks
	> in one go.

-   provide a globs array, covering
    all files that might affect
	the final output of the pipeline,
	so that we might utilizing some
	file watching machanism to watch
	all these files, and automatically
	re-run the pipeline whenever
	a change happens.

The representation of a pipeline is
nothing more than a regular object literal,
holding some information of the pipeline,
including those common points mentioned above.
Obviously we can also call a pipeline
a **pipeline object**.

Any given pipeline object
always contains these properties:

1.  `pipelineFullName`  
    A descriptive name for logging messages or errors
    in the console.

1.  `watchingBasePath` and `watchingGlobsRelativeToWatchingBasePath`  
    A pair of properties together build up
    those globs for watching.

	> It's worth to point out that
	> the globs for watching is often
	> **different** from those as processing entries points.
	> For example, when compiling a set of `Stylus` files,
	> one might need only one entry `.styl` file,
	> but need to watch all `.styl` files,
	> so that any change of any file among those are watched,
	> a new compilation should trigger.

1.  `actionToTakeOnSourceFilesChange`  
    The name of the action to trigger
	whenever a change or several changes happen
	to those file covered in the globs metioned in (2).

1.  A task for deleting built files metioned in (1).

    -   The task name stores in the `taskNameofDeletingFiles` property
	    of the pipeline object.

	-   The task body function stores in the `toClean` property
	    of the pipeline object.

1.  `taskNameOfMainTask`  
    The name of the so-called main task.

	> The main task's body function
	> is also stores in the pipeline object,
	> but in variant property names
	> across different pipeline types.

For an example pipeline object,
see below [Some Pipeline Objects](#some-pipeline-objects).
## Watching Files for Pipelines

Watching machanism is prepared
but **not** set up for a pipeline.
This means a pipeline object carries
enought information for setting a watcher
later, **manually**.

> By the way, the naming convention
> of these information matches another
> npm package of mine, [@wulechuan/scoped-glob-watchers](https://www.npmjs.com/package/@wulechuan/scoped-glob-watchers).
> But theoretically, since the infomation is complete,
> any watching machanism will work,
> as long as an interface mapper is provided.




## Pipeline Creator Concept

A pipeline, aka a pipeline object, is created
by a `Function` clled **pipeline creator**.

The creator takes some options(usually a single option, in fact)
so that we can customize the pipeline object to create.
It `return`s a pipeline object, instead of constructing
an object via the `new` operator.

Since a pipeline is built upon a set of tasks,
a pipeline creator utilizes some **task creators**.




## Availabe Pipeline Creators List

### Copying Files Pipeline Creator

-   arguments[0]: `options` : `Object`
    **Required**.

	```javascript
	let options = {
		/* logging */

		/* e.g. 'Javascript' or '爪哇脚本' */
		pipelineCategory,

		/* e.g. 'Page: User Dashboard' or maybe just 'App' */
		taskNameKeyPart,

		/* e.g. 'front-end/source/js' or 'front-end/source',
		 * basically any path you prefer. */
		basePathForShorteningPathsInLog = '',



		/* source */

		/* e.g. 'front-end/source/js' */
		sourceBasePath = process.pwd(),

		// e.g. [ '**/*.js' ]
		buildingEntryGlobsRelativeToSourceBasePath,

		watchingBasePath,

		// e.g. [ '**/*.js' ]
		watchingGlobsRelativeToWatchingBasePath,



		/* building(concatenation) */

		/* e.g. '../static' or 'dist/assets' */
		outputBasePathOfBuilding,

		/* e.g. [ 'app.js' ] */
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