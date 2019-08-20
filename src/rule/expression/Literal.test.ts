import { Literal } from './Literal';
import { IType } from '../types/IType';
import { Types } from '../types/Types';
import { HardwiredTypes } from '../types/HardwiredTypes';

describe('Literal', () => {
    let originalIType: IType;
    let literal: Literal;
    beforeEach(() => {
        originalIType = { name: 'string' };
        literal = new Literal({ value: 'hello', type: originalIType});
    });

    it('deserializes', () => {
        expect(literal.value).toBe('hello');
        expect(Types.areEqual(literal.getType(), originalIType)).toBeTruthy();
    });

    it('throws if type is multivalued', () => {
        expect(() => {
            new Literal({ value: 'hello', type: { name: 'string', isMultiValued: true}});
        }).toThrow();
    });

    describe('validate', () => {
        it('works for int', () => {
            literal = new Literal({ value: '17', type: { name: 'int' }});
            expect(literal.getParseError()).toBeNull();
            literal = new Literal({ value: 'hello', type: { name: 'int' }});
            expect(literal.getParseError()).toMatch(/int/i);
        });
        it('works for float', () => {
            literal = new Literal({ value: '1.3213', type: { name: 'float' }});
            expect(literal.getParseError()).toBeNull();
            literal = new Literal({ value: 'hello', type: { name: 'float' }});
            expect(literal.getParseError()).toMatch(/float/i);
        });
        it('works for string', () => {
            literal = new Literal({ value: 'hello', type: { name: 'string' }});
            expect(literal.getParseError()).toBeNull();
        });
        it('works for boolean', () => {
            literal = new Literal({ value: '1', type: { name: 'boolean' }});
            expect(literal.getParseError()).toBeNull();
            literal = new Literal({ value: '0', type: { name: 'boolean' }});
            expect(literal.getParseError()).toBeNull();
            literal = new Literal({ value: 'hello', type: { name: 'boolean' }});
            expect(literal.getParseError()).toMatch(/bool/i);
        });
    });

    describe('can guess type', () => {
        it('bool', () => {
            literal = new Literal({ value: '1' });
            const types = literal.guessTypes();
            expect(types[0]).toBe(HardwiredTypes.BOOL);
        });

        it('int', () => {
            literal = new Literal({ value: '17' });
            const types = literal.guessTypes();
            expect(types[0]).toBe(HardwiredTypes.INT);    
        });
        
        it('float', () => {
            literal = new Literal({ value: '17.312' });
            const types = literal.guessTypes();
            expect(types[0]).toBe(HardwiredTypes.FLOAT);    
        });

        it('string', () => {
            literal = new Literal({ value: 'hi' });
            const types = literal.guessTypes();
            expect(types[0]).toBe(HardwiredTypes.STRING);    
        });
    });

    it('serializes', () => {
        const result = literal.serialize();
        expect(result.what).toBe('literal');
        expect(result.value).toBe(literal.value);
        expect(Types.areEqual(result.type, literal.getType())).toBeTruthy();
    });
});