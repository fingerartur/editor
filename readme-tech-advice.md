# Make your life easier (development experience)
1. vscode plugins:
    - Debugger for Chrome
    - ESLint
    - Jest
    - npm Intellisense
    - React Extension Pack
    - Reactjs code snippets
    - Auto Close Tag
    - TypeScript Hero (Adds auto-importing, *however, it does not seem to be able to import constants*)
    - npm
    - Path Intellisense
    - vscode-jest (integrates Jest into the IDE, runs tests automatically, allows Debugging of tests)
2. chrome plugins:
    - React Developer Tools
3. chrome F12
    - use F12 > Styles color picker for fine tuning colors
2. tslint
3. tsconfig
4. shortcuts
    - Ctrl + . to extract methods / vars
    - Alt + F12 to peek definition
    - Ctrl + Left Mouse to go to definition
    - F2 to refactor name in all files
    - Alt + Double Click to select multiple words and edit them at once
    - Alt + Click to put multiple cursors
    - Ctrl + Alt + O to remomve unused imports (via TypeScript Hero plugin)
    - Tab to use a snippet
5. Snippets [/vscode_backup_settings](vscode_backup_settings)
6. vscode settings
    ```json
        "editor.snippetSuggestions": "top" // makes snippets work. Otherwise snippets sometimes do not work (because they are not on top)
        "javascript.preferences.quoteStyle": "single",
        "typescript.preferences.quoteStyle": "single",   // makes sure all imports use single quotes (tslint wants that)
        "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
        "terminal.integrated.fontSize": 10, // fits more text into terminal (good for TDD)
        "window.zoomLevel": -1,
        "typescript.updateImportsOnFileMove.enabled": "always" // automatically updates imports when moving/renaming files
    ```
7. Solving problems with TS
    ```json
        // tsconfig.json
        "compilerOptions": {
            "baseUrl": "src/",
            // this allows me to use absolute paths for imports (e.g. import import { Element } from 'rule/elements/Element';)
            // However, absolute imports do not work in test files!
            "strictNullChecks": false,
            // solves the following problem:
            //
            // I want to be able to use null values. The correct way to do this in TS is by using a union type
            // (e.g. cosnt literal: Literal | null), however, this results in the loss of intellisense,
            // because vscode does not support good intellisense for union types.
            //
            // Therefore its better to turn off strict types and use null/undefined freely.
            "skipLibCheck": true,
            // To overcome bugged typings files that come with some library.
            // Otherwise, when a library ships with bugged TS files, it prevents the compilation
            // of the whole project.
            // A nicer solution would be to debug the library and submit a PR, but ain't nobody got time for that.
            "noUnusedVars": false
            // Unused vars are nice for temporary situtaions like debugging.
        } 
    ```
8. Improved TSLint
    ```json
        // tslint.json
        "no-empty": false
        // To be able to write empty arrow functions () => {}. This is useful e.g. for empty tests.
    ```
9. Fire up the [debugger](https://medium.com/@auchenberg/live-edit-and-debug-your-react-apps-directly-from-vs-code-without-leaving-the-editor-3da489ed905f)
10. Use absolute paths in non-test files (.env, tsconfig.baseUrl)
11. Solving the conflict of Cypress vs. Jest
    ```json
    // Restrict TSC to src/ folder only. This stops Cypress typings (Chai) from accidentally being intellisensed in Jest unit tests.
    // This way I can have both Cypress with intellisense and Jest with intellisense.

    // tsconfig.json
        "include": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/**/*.jsx",
        "src/**/*.js"
    ],
    ```
    - Plus, add the following to the beginning of every Cypress test file:
    ``` /// <reference types="Cypress" /> ```
12. Leverage the Array.includes method
```json
// tsconfig
    "lib": [ "es7" ] // instead of es6

```

# Understanding Cryptic TS Errors
*Compilation Error: Prototype of object cannot be undefined* is an extremely cryptic error and it means that there is a cyclic dependency between two files

# General best practices for TS
- document thrown exceptions, do not document unrecoverable errors (e.g. bug errors)
- always use null, never use undefined
- do not design code with chainable methods (they are harder to test)
- use relative imports for inside the same folder and sub-folders, otherwise absolute imports
- TDD: write what the class does without knowing its API first, then create the API and implement the tests, then implement the functionality
- each time there is a bug, write a test first, then go debug it
- prefer Sets over Arrays

# Exceptions and unrecoverable Errors
- use JS Errors to throw unrecoverable errors e.g. ```js throw new Error('bug: ...');```. (It is impossible to inherit from Error)
- inherit from /exception/Exception to throw recoverable Exceptions (use instanceof to learn the type of a caught exception)

# Caveats of Using TS with React
1. Recursive components must have the return type of the render method specified, otherwise TSC throws an error
    ```js render(): JSX.Element { ... }```
2. Error class cannot be inherited from
    - there is a transpilation issue [(Babel issue)](https://stackoverflow.com/questions/33870684/why-doesnt-instanceof-work-on-instances-of-error-subclasses-under-babel-node), which results in the fact that it is impossible to inherit from *Error* class
    - this is the reason why exception/Exception does not inherit from Error
3. HOCS are hard to use with intellisense
    - e.g. for i18n - ```js translate()(Component): any```
    - I loose intellisense for props of the HOC
    - it is [possible to have intellisense](https://medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb)
    - right now it seems a good tradeoff to loose intellisense, but keep the code simple
4. Event handlers
    - React has custom generic event handlers ```js React.KeyboardEvent<HTMLDivElement> ```
5. Component context
    - [here](https://medium.com/@mtiller/react-16-3-context-api-intypescript-45c9eeb7a384)