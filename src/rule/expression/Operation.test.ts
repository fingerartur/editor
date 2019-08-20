import { Arg } from './Arg';
import { IOperation } from './IOperation';
import { Operation } from './Operation';
import { IArg } from './IArg';
import { IType } from '../types/IType';
import { Types } from '../types/Types';
import { typeConverter } from '../../_testing/typeConverter';

describe('Operation', () => {
    let serializedOperation: IOperation;
    let operation: Operation;
    let originalType: IType;
    let serializedArgumentA: IArg;
    let serializedArgumentB: IArg;
    let expectedArgs: Arg[];
    beforeEach(() => {
        originalType = { name: 'int' };
        serializedArgumentA = { name: 'a', type: { name: 'int'}};
        serializedArgumentB = { name: 'b', type: { name: 'int'}};
        serializedOperation = {
            name: 'plus',
            sign: '+',
            type: originalType,
            args: [ serializedArgumentA, serializedArgumentB ]
        };
        operation = new Operation(serializedOperation);
        expectedArgs = [
            new Arg(serializedArgumentA),
            new Arg(serializedArgumentB)
        ];
    });

    it('deserializes', () => {
        expect(operation.name).toBe('plus');
        expect(operation.sign).toBe('+');
        expect(Types.areEqual(operation.getType(), originalType)).toBeTruthy();
        expect(operation.args).toEqual(expectedArgs);
    });

    it('validateArgs returns an array of all erroneous args in subexpression', () => {
        const spy1 = jest.spyOn(operation.args[0], 'validate');
        spy1.mockReturnValue([ operation.args[0] ]);
        const spy2 = jest.spyOn(operation.args[1], 'validate');
        spy2.mockReturnValue([ operation.args[1] ]);
        expect(operation.validateArgs(typeConverter)).toEqual(operation.args);
    });

    it('serializes', () => {
        const result = operation.serialize();
        expect(result.what).toBe('operation');
        expect(result.type).toEqual(originalType);
        expect(result.sign).toBe('+');
        expect(result.name).toBe('plus');
        expect(result.args).toEqual(expectedArgs);
    });

    it('returns no variables', () => {
        expect(operation.getVariables()).toEqual([]);
    });
});