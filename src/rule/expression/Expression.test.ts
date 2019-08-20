import { Operation } from './Operation';
import { ILiteral } from './ILiteral';
import { IVariableAccess } from './IVariableAccess';
import { IExpression } from './IExpression';
import { IOperation } from './IOperation';
import { Expression } from './Expression';
import { Types } from '../types/Types';
import { typeConverter } from '../../_testing/typeConverter';

const serializedComplexExpression: IExpression = {
    what: 'expression',
    root: {
        name: 'let',
        type: null,
        value: {
            what: 'operation',
            name: 'sum',
            sign: '+',
            type: { name: 'int' },
            args: [                
                {
                    name: 'a',
                    type: { name: 'int' },
                    value: {
                        what: 'variableAccess',
                        id: 1010,
                        access: 'z',
                        type: { name: 'int' }
                    } as IVariableAccess
                },
                {
                    name: 'b',
                    type: { name: 'int' },
                    value: {
                        what: 'operation',
                        name: 'minus',
                        sign: '-',
                        type: { name: 'int' },
                        args: [
                            {
                                name: 'left',
                                type: { name: 'int' },
                                value: {
                                    what: 'variableAccess',
                                    id: 1009,
                                    access: 'x',
                                    type: { name: 'int' }
                                } as IVariableAccess
                            },
                            {
                                name: 'right',
                                type: { name: 'int' },
                                value: {
                                    what: 'literal',
                                    type: null,
                                    value: "12"
                                } as ILiteral
                            }
                        ]
                    } as IOperation,
                }
            ]
        } as IOperation
    }
};

describe('Expression', () => {
    let expression: Expression;
    beforeEach(() => {
        expression = new Expression(serializedComplexExpression);
    });

    it('constructs', () => {
        expression = new Expression(null);
        expect(expression.getRoot()).not.toBeNull();
    });

    it('deserializes', () => {
        expect(expression.getRoot().value instanceof Operation).toBeTruthy();
    });

    it('can infer type', () => {
        expect(expression.getType()).toBeNull();
        expression.inferType();
        const ok = Types.areEqual(expression.getType(), { name: "int" });
        expect(ok).toBeTruthy();
    });

    it('serializes', () => {
        expression = new Expression(null);
        const result = expression.serialize();
        expect(result).toEqual({
            what: "expression",
            root: {
                name: "root",
                type: null,
                error: null,
                value: null
            }
        });
    });

    it('checks if it is empty', () => {
        expect(expression.isEmpty()).toBeFalsy();
        expression.getRoot().value = null;
        expect(expression.isEmpty()).toBeTruthy();
    });

    it('checks if it is complete (no null values)', () => {
        expect(expression.isComplete()).toBeTruthy();
        (expression.getRoot().value as Operation).args[0].value = null;
        expect(expression.isComplete()).toBeFalsy();
        expression.getRoot().value = null;
        expect(expression.isComplete()).toBeFalsy();
    });

    it('can return ids of all variables used in the expression', () => {
        const result = expression.getIdsOfVariables().sort();
        expect(result).toEqual([ 1009, 1010 ]);
    });

    it('can replace IDs of used varibles', () => {
        const map = new Map<number, number>();
        map.set(1009, 10);
        map.set(1010, 11);
        expression.replaceIds(map);
        const result = expression.getIdsOfVariables().sort();
        expect(result).toEqual([ 10, 11 ]);
    });

    it('can traverse all values', () => {
        let count = 0;
        expression.traverse(value => {
            count++;
        }, false);
        expect(count).toBe(5);
        // a better test is in Arg.test.ts
    });

    it('can check if root value type is convertible to root type', () => {
        expression.getRoot().type = { name: "Item" };
        expression.hasTypeMismatch(typeConverter);
    });
});