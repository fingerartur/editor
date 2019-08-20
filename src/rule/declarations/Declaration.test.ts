import { Declaration } from './Declaration';
import { IType } from '../types/IType';
import { Types } from '../types/Types';

describe('Declaration', () => {
    let typeString: IType;
    let declaration: Declaration;
    beforeEach(() => {
        typeString = { name: 'string' };
        const serialization = {
            id: 1,
            name: 'x',
            type: typeString
        };
        declaration = new Declaration(serialization);
    });

    it('deserializes', () => {
        expect(declaration.id).toBe(1);
        expect(declaration.name).toBe('x');
        expect(Types.areEqual(declaration.type, typeString)).toBeTruthy();
    });

    it('serializes', () => {
        const result = declaration.serialize();
        expect(result.id).toBe(1);
        expect(result.name).toBe('x');
        expect(result.type.name).toBe('string');
        expect(Types.isArray(result.type)).toBeFalsy();
    });
});