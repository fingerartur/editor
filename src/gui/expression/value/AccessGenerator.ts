import { ILoadables } from 'client/ILoadables';
import { IScope } from 'rule/IScope';
import { Declaration } from 'rule/declarations/Declaration';
import { IVariableAccess } from 'rule/expression/IVariableAccess';
import { VariableAccess } from 'rule/expression/VariableAccess';
import { ITypeDefinition } from 'rule/types/ITypeDefinition';
import { IType } from 'rule/types/IType';

export class AccessGenerator {
    constructor(
        private scope: IScope,
        private loadables: ILoadables
    ) {}

    /**
     * @param type can be null, .name can be null, .isMultiValued can be null
     */
    generate(type: IType): IVariableAccess[] {
        if (type) {
            if (type.name !== null && type.isMultiValued !== null) {
                return this.generateAccesssesForType(type);
            } else if (type.isMultiValued !== null) {
                return this.generateAccessesForMultiplicity(type.isMultiValued);
            } else if (type.name !== null) {
                return this.generateAccessesForName(type.name);
            } else {
                throw new Error('bug: .name and .isMultiValued cannot both be null');
            }
        } else {
            return this.generateAllAccesses();
        }
    }

    generateAllAccesses(): IVariableAccess[] {
        let result: IVariableAccess[] = [];
        this.scope.visibleDeclarations.forEach(declaration => {
            result = result.concat(this.generateAccessesForDeclaration(declaration));
        });
        return result;
    }

    generateAccessesForMultiplicity(isMultiValued: boolean): IVariableAccess[] {
        const accesses = this.generateAllAccesses();
        return accesses.filter(access => access.type.isMultiValued === isMultiValued);
    }

    generateAccesssesForType(type: IType): IVariableAccess[] {
        const accesses = this.generateAllAccesses();
        return accesses.filter(access => this.loadables.typeConverter.allows(access.type, type));
    }

    generateAccessesForName(typeName: string): IVariableAccess[] {
        const accesses = this.generateAllAccesses();
        return this.filterAccessesConvertibleTo(accesses, typeName);
    }

    private filterAccessesConvertibleTo(accesses: IVariableAccess[], typeName: string): IVariableAccess[] {
        const singleValuedType: IType = { name: typeName, isMultiValued: false };
        const multiValuedType: IType = { name: typeName, isMultiValued: true };
        return accesses.filter(access => 
            this.loadables.typeConverter.allows(access.type, singleValuedType)
            || this.loadables.typeConverter.allows(access.type, multiValuedType)
        );
    }

    private generateAccessesForDeclaration(declaration: Declaration): IVariableAccess[] {
        let result: IVariableAccess[] = [];
        const codedPath = declaration.id + '';
        result.push(VariableAccess.from(codedPath, this.scope.visibleDeclarations, this.loadables.typeDefinitions));
        const typeDefinition = this.loadables.typeDefinitions.get(declaration.type.name);
        if (!typeDefinition) {
            console.log('Missing type definition for type:', declaration);
            throw 'Missing type definition';
        }
        result = result.concat(this.generateAccessesForAttributes(codedPath, typeDefinition, declaration.type.isMultiValued));
        return result;
    }

    private generateAccessesForAttributes(path: string, typeDefinition: ITypeDefinition, hasMulitvaluedAncestor: boolean): IVariableAccess[] {
        let result: IVariableAccess[] = [];
        if (typeDefinition.attributes) {
            typeDefinition.attributes.forEach(attribute => {
                const attributePath = path + '.' + attribute.name;

                const variableAccess = VariableAccess.from(attributePath, this.scope.visibleDeclarations, this.loadables.typeDefinitions);
                if (hasMulitvaluedAncestor) {
                    this.applyArrayFlattening(variableAccess);
                }
                result.push(variableAccess);
    
                const attributeTypeDefinition = this.loadables.typeDefinitions.get(attribute.type);
                result = result.concat(this.generateAccessesForAttributes(attributePath, attributeTypeDefinition, attribute.isMultiValued));
            });
        }
        return result;
    }

    private applyArrayFlattening(access: IVariableAccess): void {
        access.type.isMultiValued = true;
    }
}