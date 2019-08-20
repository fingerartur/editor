# Specification details

## Specification in finer detail
- there is no need to change the type of variable, ever
- type names are unique (the current prototype does not make a distinction between type IDs and type name)
- array of arrays is forbidden
- there is no need for array access inside an array access (e.g. arr1[arr2[0]])
- the assignment element assigns to only one variable
- array literal is not supported
- assignment to array slots is not supported

## Limitations of the current prototype (per specification)
- it is not possible to mix array access with dot notation (e.g. x[2].sth)
- type definitions cannot change. Currently, if they change, variable accesses will not get invalidated (e.g. if type of Doc changes and it no longer has the attribute *Person*, a variable access *Doc.Person.id* will not get invalidated, eventhough it should)

## Array Flattening
- as a requested bonus feature, the VariableAccess also allows array flattening. Therefore, e.g. the value Doc.Persons.name is a string array
value (even though Persons is an array. Persons gets flattened.)

# How to

## How to add a new element type
- implement and element extending from rule/elements/Element (or AssigningElement, or ExpressionAssigningElement)
- implement an enhancer extending from enhancers/Enhancer
- add deserialization in rule/elements/deserializeElements

## How to write popups for elements
- the popup clones its inputs and edits them and validates them, if everything is OK on save, the clone replaces the original metadata of the element
- on cancel, the clones are simply discarded
- *this is a better design than, editing meta-data directly in the rule because it prevents unexpected errors from corrupting the underlying rule. Also cancelling is easy.*

# How to improve

## Speed up rule rendering even more
- it seems possible to speed up SVG rendering up to 10x by swapping out Snap.SVG library and implementing all SVG operations purely using DOM API
- see src/_benchmark/benchmarksSvg.ts

## Improve the UX for popups
- probably the best way would be to re-implement antd components (e.g. Modal)
- some antd components lack focusability (e.g. Autocomplete)
- also it is impossible to focus antd modal buttons
- also, antd Input.autofocus does not seem to wrok
- btw React seems to only support tabIndex={0}, other numbers do not seem to work

## Prepared ways to extend functionality
- expression validation and display of errors is implemented, but it is not used, because the new GUI does not allow the input of erroneous literals/operations/etc anyway
- React should be compatible with customization solution [with Redux too](https://tylergaw.com/articles/dynamic-redux-reducers/)

## About trying to render SVG in a Web Worker
- The problem lies in the fact that Snap.SVG (and likely other SVG libraries as well, if not all of them) use the DOM for rendering SVG and Web Workers do not have access to the DOM.
- The only possible solution I see is to try and find a webworker-compatible SVG library or a library that mocks the DOM sufficiently inside a web worker
- Web Workers only accept and return strings, but this is not a problem, since all the logic of rules is fully serializable and the resulting SVG image can be returned as a data URL
- web workers w webpack need a special [plugin](https://www.npmjs.com/package/worker-loader) in order to be loaded (and allow them to use libraries / imports) and in order to add webpack plugins create-react-app must be ejected ```npm run eject```, which is not recommended

# Documentation

## Algorithms
- prevent variable shadowing: before creating a declaration traverse down, if subtree contains declaration of this variable, do not declare
- autofill visible variables: traverse up, collect variables along the way
- invalid elements are ignored in traversal algorithms by default

## Types and Type definitions
- list of type definitions is loaded into a map, which is then used for intellisense
- two types are equal if they have the same name and multiplicity (names are unique)

## Declarations of variables
- declarations store type of variables, this is the single source of truth
- however, for convenience, variables etc. have a copy of the declared type
- declarations with IDs 0-999 are reserved for global variables
- declarations with IDs 1000+ are reserved for local variables
- declarations never get deleted, this simplifies undo/redo

## Decoupling the logic of rules from their graphical representation

### Enhancers
- they separate the logic of elements
    - GUI popups that allow editing an element ```Enhancer.renderGuiPopup()```
    - SVG representation of an element, including its shape and arraws ```Enhancer.renderSvg()```
### Graphical metadata
- they hold graphical and interactive data of the element. This is irrelevant to the server component of ERAIN
    - interactive: isSelected, error (a rule containing an error will never be sent to the server)
    - graphical: isCollapsed, x, y 


# Technologies
## antd library used for components
- very nice, but it turns out that in order to deliver exceptional user experience, it will be necessary to implement the components without using any library (or consider forking a library component, however that is likely more difficulat that writing my own)
- example of problems:
    - not all components are focusable
    - modal does not close when Enter is pressed
    - not all components offer the desired events (e.g. click, hover, keyDown ...)

(~9K lines of code including tests)