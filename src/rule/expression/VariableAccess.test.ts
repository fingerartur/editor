import { Types } from '../types/Types';
import { VariableAccess } from './VariableAccess';
import { IVariableAccess } from './IVariableAccess';
import { IType } from '../types/IType';
import { declarations } from '../../_testing/declarations';
import { typeDefinitionMap } from '../../_testing/typeDefinitionMap';

describe('Variable Access', () => {
    let variable: VariableAccess;
    const typeString: IType = { name: 'string' };
    let serialization: IVariableAccess;
    beforeEach(() => {
        serialization = { id: 1, access: 'countCars', type: typeString};
        variable = new VariableAccess(serialization);
    });

    it('deserializes', () => {
        expect(variable.id).toBe(serialization.id);
        expect(variable.access).toBe(serialization.access);
        expect(Types.areEqual(variable.type, serialization.type)).toBeTruthy();
    });

    it('allows dot notation access', () => {
        variable.access = 'Cars.Honda.count';
    });

    it('serializes', () => {
        const result = variable.serialize();
        expect(result.id).toBe(1);
        expect(result.what).toBe('variableAccess');
        expect(result.access).toBe('countCars');
        expect(result.type).toEqual(typeString);
    });

    it('can be created based on a coded value ([id].[attr1].[attr2])', () => {
        const visibleDeclarations = declarations;
        let codedValue = '1.Person.Name';
        let result = VariableAccess.from(codedValue, visibleDeclarations, typeDefinitionMap);
        expect(result.id).toBe(1);
        expect(result.access).toBe('Document.Person.Name');
        expect(Types.areEqual(result.type, { name: 'string' }));

        codedValue = '1.Person';
        result = VariableAccess.from(codedValue, visibleDeclarations, typeDefinitionMap);
        expect(Types.areEqual(result.type, { name: 'Person' }));
    });

    it('works when coded value has no dots', () => {
        const visibleDeclarations = declarations;
        let codedValue = '1';
        let result = VariableAccess.from(codedValue, visibleDeclarations, typeDefinitionMap);
        expect(result.access).toBe('Document');
    });

    it('returns variable IDs', () => {
        expect(variable.getVariables()).toEqual([ 1 ]);
    });

    it('can relace variable ID', () => {
        expect(variable.getVariables()).toEqual([ 1 ]);
        const map = new Map<number, number>();
        map.set(1, 10);
        variable.replaceIds(map);
        expect(variable.getVariables()).toEqual([ 10 ]);
    });
});