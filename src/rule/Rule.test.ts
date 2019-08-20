import { IVariableAccess } from './expression/IVariableAccess';
import { IExpression } from './expression/IExpression';
import { If } from './elements/If';
import { Assign } from './elements/Assign';
import { ISubRule } from './ISubRule';
import { IIf } from './elements/IIf';
import { IAssign } from './elements/IAssign';
import { IRule } from './IRule';
import { Rule } from './Rule';

const condition: IExpression = {
    what: 'expression',
    root: {
        name: 'root',
        type: { name: 'boolean' },
        value: {
            what: 'variableAccess',
            id: 1,
            access: 'globalVar',
            type: { name: 'boolean' }
        } as IVariableAccess
    }
};

const branchFalse: ISubRule = {
    what: 'sub-rule',
    elements: [
        { what: 'element', elementType: 'end', text: 'start' },
        { what: 'element', elementType: 'assign', text: 'assign to z', variable: { id: 1003, isDeclaration: true, name: 'z', type: { name: 'int'}}, expression: null } as IAssign,
        { what: 'element', elementType: 'end', text: 'end' }
    ]
};
const branchTrue: ISubRule = {
    what: 'sub-rule',
    elements: [
        { what: 'element', elementType: 'end', text: 'start' },
        { what: 'element', elementType: 'assign', text: 'assign to x', variable: { id: 1001, name: 'x', type: { name: 'int'}}, expression: null } as IAssign,
        { what: 'element', elementType: 'end', text: 'end' }
    ]
};
const serialization: IRule = {
    id: 1,
    name: 'Test rule',
    description: 'Used in a unit test',
    declarations: {
        nextId: 1004,
        declarations: [
            { id: 1, name: 'globalVar', type: { name: 'boolean' }},
            { id: 1001, name: 'x', type: { name: 'int' }},
            { id: 1002, name: 'y', type: { name: 'int' }},
            { id: 1003, name: 'z', type: { name: 'int' }},
        ]
    },
    rule: {
        what: 'sub-rule',
        elements: [
            { what: 'element', elementType: 'end', text: 'start' },
            { what: 'element', elementType: 'assign', text: 'assign to x', variable: { id: 1001, isDeclaration: true, name: 'x', type: { name: 'int'}}, expression: null } as IAssign,
            { what: 'element', elementType: 'assign', text: 'assign to y', variable: { id: 1002, isDeclaration: true, name: 'y', type: { name: 'int'}}, expression: null } as IAssign,
            { what: 'element', elementType: 'if', text: 'condition', condition, branchFalse, branchTrue } as IIf,
            { what: 'element', elementType: 'end', text: 'end' }
        ]
    }
};


describe('Rule', () => {

    let rule: Rule;
    beforeEach(() => {
        rule = new Rule(serialization);
    });

    it('constructs', () => {
        rule = new Rule();
        expect(rule.rule.isEmpty()).toBeTruthy();
        expect(rule.declarations.getAll()).toEqual([]);
        expect(rule.rule.getFirst().graphicalMetadata.isVisible).toBeTruthy();
        expect(rule.rule.getLast().graphicalMetadata.isVisible).toBeTruthy();
    });

    it('deserializes', () => {
        expect(rule.rule.isEmpty()).toBeFalsy();
        expect(rule.declarations.getAll().length).toBe(4);
        expect(rule.rule.getFirst().next instanceof Assign).toBeTruthy();
        expect(rule.rule.getFirst().next.next instanceof Assign).toBeTruthy();
        expect(rule.rule.getFirst().next.next.next instanceof If).toBeTruthy();
    });

    it('returns the first element', () => {
        expect(rule.rule.getFirst()).toBe(rule.getRoot());
    });

    it('returns the scope of an element', () => {
        const ifElement = rule.rule.getLast().prev;
        expect(ifElement instanceof If).toBeTruthy();
        const scope = rule.getScopeOf(ifElement);
        expect(Array.from(scope.forbiddenVariableNames)).toEqual([ 'z' ]);
        expect(scope.visibleDeclarations.map(declaration => declaration.name).sort()).toEqual([ 'globalVar', 'x', 'y' ]);
    });

    describe('returns declarations visible in the scope of a concrete element', () => {

        it('always returns globals', () => {
            let declarations = rule.getVisibleDeclarationsFor(rule.getRoot());
            expect(declarations.length).toBe(1);
            expect(declarations[0].name).toBe("globalVar");
        });

        it('does not return anything else', () => {
            const element = (rule.rule.getLast().prev as If).getBranchTrue().getLast();
            let names = rule.getVisibleDeclarationsFor(element).map(declaration => declaration.name).sort();
            expect(names).toEqual(['globalVar', 'x', 'y']);
        });
        
    });

    it('returns IDs of local declarations visible in the scope of a concrete element', () => {
        const element = (rule.rule.getLast().prev as If).getBranchTrue().getLast();
        let ids = rule.getVisibleLocalVarIds(element).sort();
        expect(ids).toEqual([ 1001, 1002 ]);
    });

    it('returns IDs of any variables used in any way in any element after or descending from the given element', () => {
        const ids = rule.getIdsOfVariablesBelow(rule.getRoot()).sort();
        expect(ids).toEqual([ 1, 1001, 1002, 1003 ]);
    });

    it('returns IDs of all declarations in elements after or descending from the given element', () => {
        const ids = rule.getIdsOfDeclarationsBelow(rule.getRoot()).sort();
        expect(ids).toEqual([ 1001, 1002, 1003 ]);
    });

    it('returns names of all declarations in elements after or descending from the given element', () => {
        const names = rule.getNamesOfDeclarationsBelow(rule.getRoot()).sort();
        expect(names).toEqual([ 'x', 'y', 'z' ]);
    });

    it('serializes', () => {
        expect(rule.serialize()).toMatchSnapshot();
        // cannot use .toMatchObject() here easily, because the result contains empty expressions instead of nulls
    });

    it('returns info', () => {
        expect(rule.getInfo()).toEqual({
            id: 1,
            name: 'Test rule',
            description: 'Used in a unit test'
        });        
    });
});