# explicit-ts-exports README

VS Code extension for generating index files for a folder of typescript files.

## Usage

In any file, simply invoke the command "Create Index File" to generate an index file for the current folder.

    To display the command palette, use the following keyboard shortcut, based on your installed operating system:

        MacOS: Command+Shift+P
        Windows: Ctrl+Shift+P


The index file will use explicit exports (no `export *`, no `default` without a name) and surface exports from index files of subfolders (direct children only).

Example: if the folder has two files containing the following:

`test-file.ts`:
```js
export type MyVar = number;

export type MySecondVarType = {
  a: string;
};

export const myVar: MyVar = 2;

const myDefaultVar: MyVar = 3;

export default myDefaultVar;

```

`test-file-2.ts`:
```js
export const myOtherVar = "This is a variable";

export function myFunction() {
  console.log("I'm a function!");
}

const yetAnotherFunction = () => myOtherVar;

export default yetAnotherFunction;

```

The index file will look as follows:

`index.ts`:
```js
export {
  myOtherVar,
  myFunction,
  default as yetAnotherFunction
 } from './test-file-2';
export {
  type MyVar,
  myVar,
  type MySecondVarType,
  default as myDefaultVar
 } from './test-file';
```