import { Iteration } from './Iteration';
import { IIteration } from './IIteration';

describe('Iteration', () => {
    let serialization: IIteration;
    let iteration: Iteration;
    beforeEach(() => {
        serialization = {
            variable: {
                id: 10,
                name: 'car',
                type: { name: 'int', isMultiValued: false }
            },
            value: {
                id: 2,
                access: 'cars',
                type: { name: 'int', isMultiValued: true }
            },
            cycle: {
                what: 'sub-rule',
                elements: [
                    {
                        what: 'element',
                        elementType: 'end',
                        errors: [],
                        text: null
                    },
                    {
                        elementType: 'iterationHelper',
                        what: 'element'
                    },
                    {
                        what: 'element',
                        elementType: 'end',
                        errors: [],
                        text: null
                    }
                ]
            }
        };
        iteration = new Iteration(null, serialization);
    });

    it('constructs', () => {
        const iteration2 = new Iteration(null);
    });

    it('deserializes', () => {
        expect(iteration.cycle).toBeTruthy();
    });

    it('can set iteration variable and value', () => {
        serialization.variable.id = 55;
        iteration.variable = serialization.variable;
        iteration.value = serialization.value;
        expect(iteration.getIdsOfVariablesOnTheLeft()).toEqual([]);
    });

    it('can check that types match (of iteration and iterated variable) and throws if not', () => {
        serialization.variable.type = { name: 'string' };
        expect(() => {
            iteration.variable = serialization.variable;
            iteration.value = serialization.value;
            iteration.check();
        }).toThrow();
    });

    it('returns array with its one subrule', () => {
        const rules = iteration.getSubRules();
        expect(rules.length).toBe(1);
        expect(rules[0]).toBe(iteration.cycle);
    });

    it('can get ids of used variables', () => {
        expect(iteration.getIdsOfVariables()).toEqual([ 2 ]);
    });

    it('serializes', () => {
        const result = iteration.serialize();
        expect(result.what).toBe('element');
        expect(result.elementType).toBe('iteration');
        // expect(result.text).toBe('Iteration');
        expect(result.variable).toEqual(serialization.variable);
        expect(result.value).toEqual(serialization.value);
        expect(result.cycle).toEqual(serialization.cycle);
    });
    
});