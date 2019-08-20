import { ITypeDefinition } from 'rule/types/ITypeDefinition';
import { TypeConverter } from 'rule/types/TypeConverter';
import { IOperationGroup } from 'rule/expression/IOperationGroup';

export interface ILoadables {
    operations: IOperationGroup[];
    typeDefinitions: Map<string, ITypeDefinition>;
    typeConverter: TypeConverter;
}