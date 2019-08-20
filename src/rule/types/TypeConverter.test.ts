import { TypeConverter } from './TypeConverter';
import { IType } from './IType';

export const serializedTypeConversions = [
    { from: 'int', to: 'float' },
    { from: 'float', to: 'number' }
];

describe('TypeConverter', () => {
    let typeInt: IType;
    let typeFloat: IType;
    let typeNumber: IType;
    let converter: TypeConverter;
    beforeEach(() => {
        converter = new TypeConverter(serializedTypeConversions);
        typeInt = { name: 'int' };
        typeFloat = { name: 'float' };
        typeNumber = { name: 'number' };
    });

    it('deserializes', () => {
        //
    });

    it('allows same types', () => {
        const ok = converter.allows(typeInt, typeInt);
        expect(ok).toBeTruthy();
    });

    it('works even if isMultiValued is undefined', () => {
        const ok = converter.allows({ name: 'int' }, { name: 'int', isMultiValued: false });
        expect(ok).toBeTruthy();
    });

    it('allows only single-to-single or multi-to-multi', () => {
        let ok = converter.allows(typeInt, { name: 'int', isMultiValued: true });
        expect(ok).toBeFalsy();

        ok = converter.allows({ name: 'int', isMultiValued: true }, typeInt);
        expect(ok).toBeFalsy();
    });

    it('allows conversions based on its config', () => {
        const ok = converter.allows(typeInt, typeFloat);
        expect(ok).toBeTruthy();
    });

    it('allows conversions based on its config transitively', () => {
        const ok = converter.allows(typeInt, typeNumber);
        expect(ok).toBeTruthy();
    });

    it('allows conversions that are transitively circular', () => {
        converter = new TypeConverter([
            { from: 'int', to: 'integer' },
            { from: 'integer', to: 'int' }
        ]);
        const ok = converter.allows(typeInt, { name: 'integer'});
        expect(ok).toBeTruthy();
    });

    it('allows anything to convert to null', () => {
        const ok = converter.allows(typeInt, null);
        expect(ok).toBeTruthy();
    });

    it('throws when "from" is null', () => {
        expect(() => {
            converter.allows(null, null);
        }).toThrow();
    });

    it('does not allow anything else', () => {
        const ok = converter.allows(typeFloat, typeInt);
        expect(ok).toBeFalsy();
    });
});