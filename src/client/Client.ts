import { TypeConverter } from 'rule/types/TypeConverter';
import { ILoadables } from 'client/ILoadables';
import { HardwiredTypes } from 'rule/types/HardwiredTypes';
import { ITypeDefinition } from 'rule/types/ITypeDefinition';
import { IRule } from 'rule/IRule';
import { IRuleInfo } from 'rule/IRuleInfo';
import { ITypeConversion } from 'rule/types/ITypeConversion';
import { Rule } from 'rule/Rule';
import { IOperationGroup } from 'rule/expression/IOperationGroup';

declare type TypeDefinitionMap = Map<string, ITypeDefinition>;

export abstract class Client {
    
    static getTypeDefinitionMap(typeDefinitions: ITypeDefinition[]): TypeDefinitionMap {
        const map = new Map<string, ITypeDefinition>();
        typeDefinitions.forEach(definition => {
            map.set(definition.name, definition);
        });
        return map;
    }

    abstract loadTypeDefinitions(): Promise<ITypeDefinition[]>;
    abstract loadTypeConversions(): Promise<ITypeConversion[]>;
    abstract loadOperations(): Promise<IOperationGroup[]>;
    abstract loadRule(id: number): Promise<IRule>;
    abstract saveRule(rule: Rule): void;
    abstract loadRuleInfos(): Promise<IRuleInfo[]>;

    getLoadables(): Promise<ILoadables> {
        return Promise.all([
            this.loadTypeConversions(),
            this.loadOperations(),
            this.loadTypeDefinitions()
        ]).then(values => {
            const [conversions, operations, definitions] = values;
            this.assertRequiredTypesArePresent(definitions);
            return {
                operations,
                typeDefinitions: Client.getTypeDefinitionMap(definitions),
                typeConverter: new TypeConverter(conversions)
            };
        });
    }

    /**
     * Checks that types defined in rule/vars/HardwiredTypes are present among type definitions.
     * The application depends on the knowledge of these hardwired types.
     */
    private assertRequiredTypesArePresent(definitions: ITypeDefinition[]): void {
        const requiredTypes = [ HardwiredTypes.BOOL, HardwiredTypes.INT, HardwiredTypes.FLOAT, HardwiredTypes.STRING ];
        const types = definitions.map(definition => definition.name);
        requiredTypes.forEach(type => {
            if (types.indexOf(type) === -1) {
                throw new Error('server component bug: not all basic types are present in the downloaded list of types.');
            }
        });
    }
}