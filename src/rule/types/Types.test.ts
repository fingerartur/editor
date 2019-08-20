import { IType } from "./IType";
import { Types } from "./Types";

describe('Types', () => {
    let type1: IType;
    let type2: IType;
    let type3: IType;
    beforeEach(() => {
        type1 = {
            name: 'Application'
        };
        type2 = {
            name: 'string'
        };
        type3 = {
            name: 'Application',
            isMultiValued: true
        };
    });

    it('tells if types are equal when they have the same name and multiplicity', () => {
        expect(Types.areEqual(type1, type1)).toBeTruthy();
        expect(Types.areEqual(type1, type2)).toBeFalsy();
        expect(Types.areEqual(type1, type3)).toBeFalsy();
    });

    it('equality works even when isMultiValued is undefined', () => {
        expect(Types.areEqual(type1, { name: "Application", isMultiValued: false })).toBeTruthy();
    });

    it('converts to string', () => {
        expect(Types.toString(type1)).toBe('Application');
        expect(Types.toString(type3)).toBe('Application[]');
    });

    it('tells if type is array / multivalued', () => {
        expect(Types.isArray(type1)).toBeFalsy();
        expect(Types.isArray(type3)).toBeTruthy();
    });

    it('clones itself', () => {
        const clone = Types.clone(type1);
        expect(type1).not.toBe(clone);
        expect(type1).toEqual(clone);
    });
});