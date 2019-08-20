import { Assign } from './Assign';
import { SubRule } from '../SubRule';
import { ErrorCodes } from '../validator/ErrorCodes';

describe('Assign', () => {
    let elem1: Assign;
    let elem2: Assign;
    let elem3: Assign;
    beforeEach(() => {
        elem1 = new Assign(null);
        elem2 = new Assign(null);
        elem1.next = elem2;
        elem2.prev = elem1;
        elem3 = new Assign(null);
        elem1.insertAfter(elem3);
        /*
            1 <> 3 <> 2
         */
    });

    it('constructors', () => {
        //
    });

    it('is collapsed by default', () => {
        expect(elem1.graphicalMetadata.isCollapsed).toBeFalsy();
    });

    describe('can insert element into the linked-list of elements', () => {
        it('works', () => {
            expect(elem1.prev).toBeNull();
            expect(elem1.next).toBe(elem3);

            expect(elem3.prev).toBe(elem1);
            expect(elem3.next).toBe(elem2);

            expect(elem2.prev).toBe(elem3);
            expect(elem2.next).toBeNull();
        });
        it('throws if next is null', () => {
            expect( () => {
                elem2.insertAfter(new Assign(null));
            }).toThrow('next is null');
        });
    });
    
    describe('remove', () => {
        it('works', () => {
            elem3.remove();
            expect(elem1.next).toEqual(elem2);
            expect(elem2.prev).toEqual(elem1);
        });
        it('end/start : throws', () => {
            expect(() => {
                elem1.remove();
            }).toThrow();
            expect(() => {
                elem2.remove();
            }).toThrow();
        });
    });

    it('can get parent element (the owner of the sub-rule I am currently in)', () => {
        const elem1 = new Assign(null);
        const rule = new SubRule(elem1);
        const elem2 = new Assign(null);
        elem2.parentRule = rule;
        expect(elem2.getParent()).toBe(elem1);
    });

    it('returns sub rules (empty by default)', () => {
        expect(elem3.getSubRules()).toEqual([]);
    });

    it('returns ids of used variables (empty by default)', () => {
        expect(elem3.getIdsOfVariables()).toEqual([]);
    });

    it('serializes', () => {
        elem1.text = "Hello";
        elem1.addError({ code: 1, message: "small error"});
        expect(elem1.serialize()).toMatchObject({
            what: "element",
            elementType: "assign",
            text: "Hello",
            errors: [
                { code: 1, message: "small error" }
            ]
        });
    });

    it('deserializes', () => {
        elem1.text = "Hello";
        elem1.addError({ code: 1, message: "small error"});
        const assign = new Assign(null, elem1.serialize());
        expect(assign.text).toBe("Hello");
        expect(assign.errors.length).toBe(1);
    });

    it('adds errors to itself', () => {
        elem1.addError({ code: ErrorCodes.REDECLARATION_OF_ID, message: "Bad" });
        elem1.addError({ code: ErrorCodes.REDECLARATION_OF_ID, message: "Bad2 " });
        expect(elem1.errors.length).toBe(2);
    });

    it('clears its errors', () => {
        elem1.addError({ code: ErrorCodes.REDECLARATION_OF_ID, message: "Bad" });
        elem1.addError({ code: ErrorCodes.REDECLARATION_OF_ID, message: "Bad2 " });
        elem1.clearErrors();
        expect(elem1.errors.length).toBe(0);
    });

    it('says if its valid (no errors)', () => {
        expect(elem1.isValid()).toBeTruthy();
        elem1.addError({ code: ErrorCodes.REDECLARATION_OF_ID, message: "Bad" });
        expect(elem1.isValid()).toBeFalsy();
    });

    it('says if it should be highlighted in red', () => {
        expect(elem1.isMarked()).toBeFalsy();
        elem1.addError({ code: ErrorCodes.REDECLARATION_OF_ID, message: "Bad" });
        expect(elem1.isMarked()).toBeTruthy();
        elem1.clearErrors();
        elem1.graphicalMetadata.hasInvalidDescendant = true;
        expect(elem1.isMarked()).toBeTruthy();
    });
});