<link rel="stylesheet" href="../node_modules/@wulechuan/css-stylus-markdown-themes/dist/default.css">


# User Guid

This is the User Guide for npmjs package `@wulechuan/gulp-3-common-pipeline-presets`.
See [Readme.md](../ReadMe.md).

## Concepts of Task and Task Creator

A **task** is represented by nothing else but a function,
calls the **task body**.

A task, aka a task body function, is created by another function,
the **task creator function**.
So, all you are making use of are `Function`s.
You call a creator function, you get a task body function.

A task body, being a function, can be **run**.

A task body, being a function, takes a single `argument`,
which is a **callback function**.
Whenever the task comes to an end, we call the callback function
**inside of** the task body function, thus we tell the outside world
of the task body that the task is now finished.

Note that usually we utilize the creator function
to create the task body function.
This way we have the opportunity to customize the task.
Otherwise we might only be able to create identical task bodies,
which doesn't make sense.

**In summary, there are 3 functions involved**:
1. The function to create the task body;
2. The function being the task body;
3. The function as the argument of the task body, aka the callback function.

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

Below is a similar example as the above one, but in a different naming convention:
```javascript
const taskBodyOfSomething = function createATaskOfSomeType(options) {
	// ...

	return function taskBody(thisTaskIsDonw) {
		// ...
		thisTaskIsDone();
	}
}
```

## Concept of Pipeline

A **pipeline** is basically a set of
tasks that are connected to each other,
and work as one union piece in most cases.
But technically, those tasks **might**
be used individually.

Since tasks are basically `Function`s,
while a pipeline is a bunch of tasks
that are bound together,
a pipeline can be **run**, just like a task.
It runs from a so-called **main task**,
and all other taks will be automatically run
afterwards.


### Common Points across Variant Types of Pipelines

Though pipelines are different from each others,
they do have some common points.

A usable pipeline should:
-   know what's the input,
    so that when the pipeline runs,
    an output or several ouputs
    will be generated throught this pipeline
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
	> all output files of all those pieplines
	> in one go.
	>
	> In fact, my pipelines all provide
	> both the task name and the task body
    > of the cleaning task.
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
	the final outputs of the pipeline,
	so that we might utilize some
	file watching mechanism to watch
	all those covered files, and automatically
	re-run the pipeline whenever
	a change happens to any of those files.

The representation of a pipeline is
nothing more than a regular `Object literal`,
holding some information of the pipeline,
including those common points mentioned above.
So we can also call a pipeline
a **pipeline object**.




### Watching Files for Pipelines

In concept, a usable pipeline usually needs to
providing a functionality on watching
some globs. Thus a running pipeline always
watches involved source files, and automatically
refresh its output if any source file changes.

In face, for any pipeline object,
the watching mechanism it desires is somehow prepared,
but **not** set up.
This means a pipeline object carries
enought information for setting a watcher
later, **manually**.
No watching mechanism will be functional at the birth of a pipeline,

> It's worth to point out that
> the globs for watching is often
> **different** from those as processing entries points.
> For example, when compiling a set of `Stylus` files,
> one might need only one entry `.styl` file,
> but need to watch all `.styl` files,
> so that any change of any file among those are watched,
> a new compilation should trigger.


> By the way,in the example `gulpfile.js`
> within this repository,
> the watching mechanism is provided by another npm package of mine, [@wulechuan/scoped-glob-watchers](https://www.npmjs.com/package/@wulechuan/scoped-glob-watchers).



## Concept of Pipeline Creator

A pipeline, aka a pipeline object, is created
by a `Function` called **pipeline creator**.

The creator takes some options (usually a single option, in fact)
so that we can customize the pipeline object.

The creator creates a pipeline object by `return`ing that object,
instead of constructing the object via the `new` operator.

Since a pipeline object is built upon a set of tasks,
a pipeline creator function utilizes some **task creators**,
to create those needed task bodies for the pipeline object.

The example below might help you understand these concepts.

```javascript
const aPipelineObject = aPipelineGreate(optionsA);
const anotherPipelineObject = aPipelineGreate(optionsB);

gulp.task('some smart task', [
	aPipelineObject      .taskNameOfMainTask,
	anotherPipelineObject.taskNameOfMainTask,
]);

/* Now the 'some smart task' will 
 * run both pipelines in parallel. */
```



# See Also
- [Read Me](../ReadMe.md)
- [API References](./API-References.md)