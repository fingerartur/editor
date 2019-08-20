import { IIf } from './IIf';
import { Types } from '../types/Types';
import { If } from './If';
import { IExpression } from '../expression/IExpression';
import { ISubRule } from '../ISubRule';
import { IVariableAccess } from '../expression/IVariableAccess';

describe('If', () => {
    const serializedSubRule: ISubRule = {
        what: 'sub-rule',
        elements: [
            {
                what: 'element',
                elementType: 'end',
                text: null,
                errors: []
            },
            {
                what: 'element',
                elementType: 'end',
                text: null,
                errors: []
            }
        ]
    };
    const serializedCondition: IExpression = {
        what: 'expression',
        root: {
            name: 'root',
            type: { name: 'boolean' },
            value: {
                what: 'variableAccess',
                id: 12,
                access: 'Item.isOk',
                type: { name: 'boolean' },
            } as IVariableAccess,
        }
    };
    const serialization: IIf = {
        text: "If",
        condition: serializedCondition,
        branchTrue: serializedSubRule,
        branchFalse: serializedSubRule
    };

    let ifElement: If;
    beforeEach(() => {
        ifElement = new If(null, serialization);
    });

    it('constructors', () => {
        ifElement = new If(null);
        expect(ifElement.getBranchFalse().isEmpty()).toBeTruthy();
        expect(ifElement.getBranchTrue().isEmpty()).toBeTruthy();
        expect(ifElement.getCondition().isEmpty()).toBeTruthy();
        const typeIsBoolean = Types.areEqual(ifElement.getCondition().getType(), { name: 'boolean' });
        expect(typeIsBoolean).toBeTruthy();
    });

    it('deserializes', () => {
        expect(ifElement.getBranchTrue()).toBeTruthy();
        expect(ifElement.getBranchFalse()).toBeTruthy();
        expect(ifElement.getCondition().isComplete()).toBeTruthy();
    });

    it('has element type "if"', () => {
        expect(ifElement.getType()).toBe("if");
    });

    it('has na enhancer', () => {
        expect(ifElement.enhance()).not.toBeNull();
    });

    it('retruns array of subrules', () => {
        const rules = ifElement.getSubRules();
        expect(rules.length).toBe(2);
    });

    xit('clones', () => {
    });

    xit('get ids of variable on the left', () => {
    });

    xit('merges', () => {});

    it('get ids of variable on the right', () => {
        expect(ifElement.getIdsOfVariablesOnTheRight()).toEqual([ 12 ]);
    });

    it('serializes', () => {
        const result = ifElement.serialize();
        expect(result.what).toBe('element');
        expect(result.elementType).toBe('if');
        expect(result.text).toBe('If');
        const typesEqual = Types.areEqual(result.condition.root.type, { name: 'boolean', isMultiValued: false});
        expect(typesEqual).toBeTruthy();
        expect(result.branchTrue).toEqual(serializedSubRule);
        expect(result.branchFalse).toEqual(serializedSubRule);
    });
});