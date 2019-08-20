import { ILiteral } from './../expression/ILiteral';
import { IType } from '../types/IType';
import { IAssign } from './IAssign';
import { Assign } from './Assign';
import { VariableAccess } from '../expression/VariableAccess';
import { ErrorCodes } from '../validator/ErrorCodes';

describe('Assign', () => {
    const typeInt: IType = { name: 'int' };
    const serialization: IAssign = {
        text: 'set vehicle counts',
        variable: {
            id: 1,
            name: 'countCars',
            type: typeInt
        },
        expression: {
            what: 'expression',
            root: {
                name: 'root',
                type: null,
                value: {
                    what: 'literal',
                    type: null,
                    value: "12"
                } as ILiteral
            }
        }
    };

    let assign: Assign;
    beforeEach(() => {
        assign = new Assign(null, serialization);
    });

    it('constructs', () => {
        assign = new Assign(null);
        expect(assign.expression.isEmpty()).toBeTruthy();
        expect(assign.variable).toBeNull();
    });

    it('deserializes', () => {
        assign = new Assign(null, serialization);
        expect(assign.text).toBe('set vehicle counts');
        expect(assign.variable.name).toBe('countCars');
        expect(assign.expression.isEmpty()).toBeFalsy();
    });

    it('says if its a declaration', () => {
        expect(assign.isDeclaration()).toBeFalsy();
        assign.variable.isDeclaration = true;
        expect(assign.isDeclaration()).toBeTruthy();
        assign.variable = null;
        expect(assign.isDeclaration()).toBeFalsy();
    });

    it('returns variable IDs on the left', () => {        
        expect(assign.getIdsOfVariablesOnTheLeft()).toEqual([ 1 ]);
        assign.variable = null;
        expect(assign.getIdsOfVariablesOnTheLeft()).toEqual([]);
    });

    it('returns variable IDs on the right', () => {        
        expect(assign.getIdsOfVariablesOnTheRight()).toEqual([]);
        assign.expression.getRoot().value = new VariableAccess({ id: 11, access: 'x', type: { name: "Item" }});
        expect(assign.getIdsOfVariablesOnTheRight()).toEqual([ 11 ]);
    });

    it('serializes', () => {
        expect(assign.serialize()).toMatchObject(serialization);
    });

    it('has element-type "assign"', () => {
        expect(assign.getType()).toEqual("assign");
    });

    it('returns an enhancer', () => {
        expect(assign.enhance()).not.toBeNull();
    });

    it('clones', () => {
        const clone = assign.clone();
        expect(clone).not.toBe(assign);
        expect(clone.serialize()).toEqual(assign.serialize());
    });

    it('merges', () => {
        const assign2 = new Assign(null);
        assign2.text = 'Hello';
        assign.merge(assign2);
        expect(assign.text).toBe('Hello');
        expect(assign.variable).toBeNull();
        expect(assign.expression.getRoot().value).toBeNull();
    });

    it('replaces IDs of all variables used in any way', () => {
        const spy = jest.spyOn(assign.expression, 'replaceIds');
        const map = new Map<number, number>();
        map.set(1, 11);
        assign.replaceIds(map);
        expect(assign.variable.id).toBe(11);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(map);
    });

    it('says if it has "redeclaration of name" error', () => {
        expect(assign.hasErrorRedeclaration()).toBeFalsy();
        assign.addError({ code: ErrorCodes.REDECLARATION_OF_NAME, message: "redeclaratoin of name"});
        expect(assign.hasErrorRedeclaration()).toBeTruthy();
    });
});
