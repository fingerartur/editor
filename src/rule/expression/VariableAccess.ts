import { Value } from './Value';
import { IVariableAccess } from './IVariableAccess';
import { IType } from '../types/IType';
import { Declaration } from '../declarations/Declaration';
import { TypeDefinitionMap } from '../types/TypeDefinitionMap';

export class VariableAccess extends Value {
    public id: number;
    public access: string;
    public type: IType;
    
    /**
     * @param codedValue e.g. 1.person.name (variable ID=1, attribute .person, attribute .name)
     */
    static from(codedValue: string, visibleDeclarations: Declaration[], typeDefinitions: TypeDefinitionMap): IVariableAccess {
        const parts = codedValue.split('.');
        const id = parseInt(parts[0], 10);
        const declaration = visibleDeclarations.find(decl => decl.id === id);
        let type = { name: declaration.type.name };
        for (let i = 1; i < parts.length; i++) {
            type = VariableAccess.getTypeOfAttribute(type, parts[i], typeDefinitions);
        }
        let access = declaration.name;
        if (codedValue.match(/\./)) {
            access = codedValue.replace(/[^\.]*\./, declaration.name + '.');
        }
        return { id, access, type };
    }

    private static getTypeOfAttribute(parentType: IType, attributeName: string, typeDefinitions: TypeDefinitionMap): IType {
        let typeDefinition = typeDefinitions.get(parentType.name);
        if (!typeDefinition) {
            throw new Error('fatal error; type definitions missing for ' + parentType.name);
        }
        const attribute = typeDefinition.attributes.find(attr => attr.name === attributeName);
        return { name: attribute.type, isMultiValued: attribute.isMultiValued };
    }

    constructor(
        serialization: IVariableAccess
    ) {
        super();
        Object.assign(this, serialization);
        this.what = 'variableAccess';
    }

    serialize(): IVariableAccess {
        return super.serialize() as IVariableAccess;
    }

    toString(): string {
        return this.access;
    }

    getVariables(): number[] {
        return [ this.id ];
    }

    replaceIds(map: Map<number, number>): void {
        const newId = map.get(this.id);
        if (newId) {
            this.id = newId;
        }
    }
}