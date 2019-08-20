import { IOperation } from './IOperation';
import { VariableAccess } from './VariableAccess';
import { IVariableAccess } from './IVariableAccess';
import { Operation } from './Operation';
import { Arg } from './Arg';
import { Literal } from './Literal';
import { Declarations } from '../declarations/Declarations';
import { ILiteral } from './ILiteral';
import { Types } from '../types/Types';
import { typeConverter } from '../../_testing/typeConverter';
import { Value } from './Value';

function validateInvalid(arg: Arg, error: RegExp): void {
    const args = arg.validate(typeConverter);
    expect(args).toContain(arg);
    expect(arg.error).toMatch(error);
}

describe('Arg', () => {
    let originalType = { name: 'int'};
    let arg: Arg;
    beforeEach(() => {
        arg = new Arg({ name: 'a', type: { name: 'int' }});
    });

    it('constructs', () => {
        expect(arg.error).toBeNull();
        expect(Types.areEqual(arg.type, originalType)).toBeTruthy();
    });

    it('deserializes when value is a variable access', () => {
        const declarations = new Declarations();
        const id = declarations.create('soldAmount', { name: 'int'});
        const serializedAccess: IVariableAccess = {
            id,
            what: 'variableAccess',
            type: originalType,
            access: 'A'
        };
        arg = new Arg({ name: 'a', type: originalType, value: serializedAccess });
        expect(arg.value instanceof VariableAccess).toBeTruthy();
    });

    it('deserializes when value is a literal', () => {
        const serializedLiteral: ILiteral = {
            what: 'literal',
            type: originalType,
            value: 'hello friend'
        };
        arg = new Arg({ name: 'a', type: originalType, value: serializedLiteral });
        expect(arg.value instanceof Literal).toBeTruthy();
    });

    it('deserializes when value is an operation', () => {
        const serializedOperation: IOperation = {
            what: 'operation',
            sign: '~',
            name: 'negation',
            type: originalType,
            args: [
                {
                    name: 'a',
                    type: originalType,
                    value: null
                }
            ]
        };
        arg = new Arg({ name: 'a', type: originalType, value: serializedOperation });
        expect(arg.value instanceof Operation).toBeTruthy();
    });

    describe('validation', () => {
        it('returns array with self and sets error if argument type doesnt correspond to value type', () => {
            arg.value = new Literal({ value: 'hello', type: { name: 'string'}});
            validateInvalid(arg, /expected/);
        });

        it('returns array with self and sets parse error if invalid arg is literal', () => {
            arg.value = new Literal({ value: 'hello im not int', type: { name: 'int' }});
            validateInvalid(arg, /parse/);
        });

        it('returns array with self and sets error if value is missing', () => {
            validateInvalid(arg, /missing/);
        });

        it('calls validateArgs on an operation and returns array containing its result', () => {
            const serializedOperation: IOperation = {
                name: 'sum',
                sign: '+',
                type: { name: 'int' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'int' }
                    },
                    {
                        name: 'b',
                        type: { name: 'int' }
                    }
                ]
            };
            arg.value = new Operation(serializedOperation);
            const spy = jest.spyOn(arg.value as Operation, 'validateArgs');
            const invalidArg = new Arg({ name: 'x', type: { name: 'string' }});
            spy.mockReturnValue([ invalidArg ]);
            expect(spy).toHaveBeenCalledTimes(0);
            let erroneousArgs = arg.validate(typeConverter);
            expect(erroneousArgs).toContain(invalidArg);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('returns empty array if everything is valid and sets error to null', () => {
            arg.value = new Literal({ value: '2', type: originalType});
            expect(arg.validate(typeConverter)).toEqual([]);
            expect(arg.error).toBeNull();
        });

        it('uses TypeConverter to check if types of argument and value match', () => {
            arg.type = { name: 'any' };
            arg.value = new Literal({ value: '2', type: { name: 'string' }});
            arg.validate(typeConverter);
            expect(arg.error).toBeNull();
        });
    });

    it('serializes', () => {
        arg.value = new Literal({ value: 'hello', type: { name: 'string' }});
        const spy = jest.spyOn(arg.value as Literal, 'serialize');
        const returnValue = { name: 'hello' };
        spy.mockReturnValue(returnValue);
        const result = arg.serialize();
        expect(result.name).toBe('a');
        expect(Types.areEqual(result.type, originalType));
        expect(result.value).toBe(returnValue);
    });

    describe('can traverse its value and its args etc.', () => {
        const values = new Set<Value>();
        beforeEach(() => {
            values.clear();

            arg = new Arg({ name: 'root', type: null });
            const value1 = new Literal({
                what: 'literal',
                type: null,
                value: '12'
            });
            const value2 = new Operation({
                name: "plus",
                sign: "+",
                args: [
                    {
                        name: "a",
                        type: { name: "number" },
                    },
                    {
                        name: "b",
                        type: { name: "number" },
                        value: null
                    }
                ]
            });
            value2.args[0].value = value1;
            arg.value = value2;

            values.add(value1);
            values.add(value2);
            values.add(null);
        });


        it('including nulls values', () => {
            let count = 0;
            arg.traverse(value => {
                expect(values.has(value)).toBeTruthy();
                count++;
            }, false);
            expect(count).toBe(values.size);
        });

        it('while ignoring null values', () => {
            let count = 0;
            arg.traverse(value => {
                expect(values.has(value)).toBeTruthy();
                count++;
            }, true);
            expect(count).toBe(values.size - 1);
        });
        
    });
});