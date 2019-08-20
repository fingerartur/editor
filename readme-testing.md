# Debugging
1. ```npm run start```
2. (set break points)
3. vscode: bug icon > Start debugging > chrome

# Debugging of tests
- use vscode-jest plugin. A *Debug* link appears on failing tests, just click it

# Unit Testing with Jest
- ```npm run test```
- ```npm run test -- --coverage``` to run test coverage
- /src/setupTests.ts gets executed before each test suite, any initializations should go there
```js
    describe(), it()    // test suite, test case
    xdescribe(), xit()  // paused suite, case

    .toEqual()	// deep equality (arrays, objects)
    .toBe()		// identity (object references)

    // testing of async code
    (done) => { 
        consumerOfCallback(() => {
            expect()
            done() // call done() after all async stuff has finished
        });
    }

    // spy on a class instance
    const car = new Car();
    const spy = spyOn(car, 'getName'); // returns the original return value by default
    spy.mockReturnValue('Honda')       // overrides return value('Honda');       // changes the return value
    expect(car.getName()).toBe('Honda');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValue(3);
    // return different values on each call

    // mock callback
    const mockCallback = jest.fn();
    mock(12);
    mock(1);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback.mock.calls[0][0]).toBe(12); // the first argument passet to the first call is 12
    expect(mockCallback.mock.calls[1][0]).toBe(1);
```
- [cheatsheet](https://github.com/sapegin/jest-cheat-sheet/blob/master/Readme.md)
- [full API](https://jestjs.io/docs/en/mock-functions)
- Jest tips
    1. you can use ```console.log()``` in tests
    2. if you rename files while Jest is in watch mode, it is necessary to restart Jest

# UI Component Testing with Jest and Enzyme

## Enzyme
- Enzyme works with wrappers (similar concept to jQuery wrappers). A wrapper represents a set of React elements (including simple elements, such as ```<div>, <h1>``` , etc). shallow() returns a ShallowWrapper, mount() returns a ReactWrapper, both have almost identical API.
- *Enzyme is better than React TestUtils.*

```js
    shallow()   // instantiats and only one level of its sub-components (i.e. without sub-components of sub-components). For unit tests
    mount()     // instantiates a component including its sub-components. For integration tests

    // Both approaches are useful. Some components just wrap another components, in that case
    // unit does not add any value.

    .find( "input" | GuiLiteral | '[title="hello"]' | { foo: 3 } )
    //    tag name | component class | CSS attr     | React prop
    .findWhere()
    .simulate( "click" | 'keyDown', {keyCode: 40} )
    // Even though the name would imply this simulates an actual event, .simulate() will in fact target
    // the component's prop based on the event you give it. For example, .simulate('click') will actually
    // get the onClick prop and call it.
    
    .exists()
    .contains()

    .children()
    .at()
    .parent()
    .parents()  // ancestors
    
    .text()
    .prop()
    .type()     // e.g. "button" | GuiLiteral

    .setProps({}) // updates the props, all find() class have to be repeated tho
        expect(component.find(AntdButton).prop("size")).toBe("default");
        component.setProps({ size: "small" });
        expect(component.find(AntdButton).prop("size")).toBe("small");
    
    .setState({}) // (should be avoided. State is a private detail of a component)
    .setContext({})

    .update()
```
- [full API](https://airbnb.io/enzyme/docs/api/)
- further reading: [context injection](https://stackoverflow.com/questions/36143925/react-js-how-to-mock-context-when-testing-component), [pass context to children too. kind of stupid that this isnt automatic! why is that?](https://github.com/airbnb/enzyme/issues/682), [official i18next testing doc is BAD, it lacks testing of "Trans" maybe issue](https://react.i18next.com/misc/testing)
## Caveats of Testing Components That Use Antd
```js
    // click button
    shallow(<Button/>).simulate("click") // works as expected, because Button has an onClick handler
    
    // change value of input
    shallow(<Input/>).simulate("change", { target: { value: "New" }});
```

## Caveats of Testing Components That Use i18n-next
```js
    // Components that use i18n-next are HOCs
    export default translate()(Modal) // HOC

    // In order to test them, it is necessary to also export the non-HOC
    export class Modal ...

    // Now it is possible to test the component, provided that the props supplied by the HOC are mocked. This is
    // done by using the mocked i18nProps.
    import { i18nProps } from 'testUtils';
    import { Modal } from './Modal';
    shallow(<Modal {...i18nProps}/>
```

## Caveats of Testing HOCs
- HOCs wrap other React components in an additional element and they add functionality to them or pass props. The additional element however messes
with shallow rendering. This can be solved either by calling shallow() twice or using mount().
```js
    // HOC example:
    export default translate()(Modal) // HOC

    mount(...)
    shallow(<HOC/>).first().shallow();
```

## Simulating Custom React Events (i.e. triggering callbacks)
```js
    component.find(AntdModal).simulate("ok");

    // another possible way:
    // component.find(AntdModal).props("onOk")();
```

## Jest Snapshot Testing
Jest snapshot testing is a feature that prevents accidental changes in the rendered output of UI components (e.g. a developer deletes a few tags by accident or accidentally types some text in a template). Snapshotting works by saving the rendered output in a file (should be commited with git) and then asserting against that.

However, it turns out that a snapshot of even a relatively simple component takes 1MB. In my opinion that is way too much, therefore do not use.

PS: snapshot testing can be used for any serializable objects, so it might be useful for a different scenario - e.g. when a test depends on a large data object and has large output, but then the data object changes. Without snapshotting this would require rewriting all of the many assertions. With snapshotting it is just one
line of code. Essentially snapshotting is equivalent to pre-generated assertions.

Best practice: each time you generate a snapshot, go through it as if you were writing it by hand and really check if it is correct. Only then you can commit it.

# E2E Testing with Cypress
- ```npm run start``` and ```npm run e2e``` in a different terminal
- has a nice graphic runner
- better suited for SPAs than selenium (e.g. can wait automatically)
- good error messages support for debugging, etc.
- allows to use F12 during debugging
- possible for TDD
- has a great inspector tool that helps write tests
- open source and forever free

## Best practices
- try to avoid tests that know too many implementation details (e.g. simplify CSS selectors, try to use them from the perspective of a user - e.g. pages contains text, the first input from top is for descriptions, ... etc.)
- sometimes selectors are needed, then use ```class="e2e-[something]"```

# How to write testable code in general
- avoid non-deterministic code 	
- SRP (single responsibility principle) applies to methods and classes
- avoid side effects in methods
- IoC/DI or any other decoupling design patterns
- avoid global and static variables and singletons (if you need singletons, use DI with single instances)	
- when testing feature toggles or customizations, test only the feature combinations that are actually used.
- [sources](https://www.toptal.com/qa/how-to-write-testable-code-and-why-it-matters)