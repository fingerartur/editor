# LIBRARY BUGS
- snap svg
    - g.drag()
        - g.drag(); // snap.svg bug: if handlers are specified, element stops being draggable ... :(
        - g.node.ondragstart also doesnt seem to work
    - polyline fills
        - snap.svg bug: polyline has black fill by default, that is not supposed to be there 
        - check it out whether this is the default befavior of pure SVG or what
    - this.svg.node onkeydown / onkeypress neither is doing anything :(
    - svg <title> element is just missing
- antd
    - possible bug: antd AutoComplete only has onChange, but reacting to it effeclively prevents autocompletion
        - would be nice to have onEnter/onBlur in the API
    - tree select bad typings
        - antd.bug: onSelect arguments are not in typeings correctly
        - antd.bug: callback should have arg "extra" in typings but do not
    - feature request: make modal close on enter!
    - Button has not title!
- jest feature request: set comparison / array comparison w/o order
- tslint
    - no-empty: [true, "allow-empty-functions"] doesn't work
- elkjs had some problems: report it or sth. (viz dig)
- create-react-app
    - after ejection /config is not ignored! this causes fatal errors during ```npm run test```
    - can start w an es6 library, but cannot build w it (throws error, library must be es5)
    - test setup is documented to be src/setupTests.js, but in reality src/setupTests.ts is the only one that works.
    Also, the project does not contain either one, it contains Tests.ts which does not set up any tests either so what
    is it doing there?
- create-react-app
    possible there is both registerServiceWorker.js and ||.ts; that is probably a bug
- create-react-app: setupTests.ts vs. setupTests.js report a bug.
- vscode / file change name is bugged: it marks about 10 files as affected when I make a change that does not affect them
which results in me having to close each file with "Do not save". Annoying.

- vscode bugs:
    - union types get no intellisense (e.g. number | string)
    - if I use absolute paths for imports, intellisense shows 'any' instead of the imported class (possible fix: tsconfig.json > compilerOptions : "module": "es6")
    - automatic import path correction [affects files that have nothing to do with the change][typescript.updateImportsOnFileMove.enabled](https://github.com/Microsoft/TypeScript/issues/24914). *Might be corrected by using a new version of TSC*
    - using a style object imported from another file doesn't work, because TS does not infer enum types. (e.g. TS for {fontFamily: 'italic'} TS infers the type as string and than complains that it is not an enum)
- vscode plugin bugs:
    - TypeScript Hero: it seems to ignore exported constants (only works with classes, functions, etc.)
- React bugs:
    - e.keyCode is [bugged](https://github.com/facebook/react/issues/1898), use e.which instead (*e.key is also possible, it returns a string, e.g. 'Enter'*)
- Webpack bugs:
    - Webpack watch mode sometimes gets stuck on an error even after the error is corrected. It then needs to be restarted
- Jest bugs:
    - Jest skips tests that wont compile why!? (without error?)
    - Jest does not seem to guess the list of changed files correctly (seems similar to the issue of changing imports)
- antd bugs:
    - autocomplete.focus() does not work

# Technical Debt
1. antd throws warning about using the whole package (currently solved by commenting out the console.warn inside antd library code)
2. library paths get autocompleted in a long fashion (probably the sideeffect of some plugin)
3. tests do not get autoimport support from vscode. I need to enable "Auto Import" plugin when writing tests