import { ArrayAccess } from './ArrayAccess';
import { HardwiredTypes } from '../types/HardwiredTypes';
import { ILiteral } from './ILiteral';
import { IVariableAccess } from './IVariableAccess';
import { IArrayAccess } from './IArrayAccess';
import { IArg } from './IArg';
import { Types } from '../types/Types';
import { VariableAccess } from './VariableAccess';

describe('ArrayAccess', () => {
    const serializedArray: IVariableAccess = {
        what: "variableAccess",
        id: 1,
        type: { name: "Person", isMultiValued: true },
        access: "Doc.People"
    };
    const serializedIndex: IArg = {
        name: "index",
        type: { name: HardwiredTypes.INT },
        value: {
            what: "literal",
            value: "12"
        } as ILiteral
    };

    let access: ArrayAccess;
    beforeEach(() => {
        access = new ArrayAccess({
            what: "arrayAccess",
            array: serializedArray,
            index: serializedIndex
        });
    });

    it('constructs', () => {
        new ArrayAccess();
    });

    it('deserializes', () => {
        expect(access.array.access).toBe("Doc.People");
        expect(access.index.value.toString()).toBe("12");
    });

    it('serializes', () => {
        const serialized = access.serialize() as IArrayAccess;
        expect(serialized.what).toBe("arrayAccess");
        expect(serialized.array).toEqual(serializedArray);
        delete serialized.index.error;
        expect(serialized.index).toEqual(serializedIndex);
    });

    it('has the type of its array', () => {
        const ok = Types.areEqual(access.getType(), { name: "Person", isMultiValued: false });
        expect(ok).toBeTruthy();
    });

    it('returns variable ids', () => {
        expect(access.getVariables()).toEqual([ 1 ]);
        access.index.value = new VariableAccess({
            what: "variableAccess",
            id: 2,
            access: "x",
            type: { name: "int" }
        });
        expect(access.getVariables()).toEqual([ 1, 2 ]);
    });

    it('can replace variable IDs', () => {
        access.index.value = new VariableAccess({
            what: "variableAccess",
            id: 2,
            access: "x",
            type: { name: "int" }
        });
        const map = new Map<number, number>();
        map.set(1, 10);
        map.set(2, 11);
        access.replaceIds(map);
        expect(access.array.id).toBe(10);
        expect((access.index.value as VariableAccess).id).toBe(11);
    });

    it('can check validity of index', () => {
        expect(ArrayAccess.isIndexValid(access.index)).toBeTruthy();
        access.index.type = { name: "string" };
        expect(ArrayAccess.isIndexValid(access.index)).toBeFalsy();
    });
});