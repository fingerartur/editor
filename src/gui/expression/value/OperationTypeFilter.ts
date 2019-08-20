import { TypeConverter } from 'rule/types/TypeConverter';
import { IType } from 'rule/types/IType';
import { IOperationGroup } from 'rule/expression/IOperationGroup';

export class OperationTypeFilter {
    constructor(
        private operationGroups: IOperationGroup[],
        private type: IType,
        private typeConverter: TypeConverter
    ) {}

    filter(): IOperationGroup[] {
        const result: IOperationGroup[] = [];
        this.operationGroups.forEach(group => {
            const filteredGroup = this.filterGroup(group);
            if (filteredGroup) {
                result.push(filteredGroup);
            }
        });
        return result;
    }

    private filterGroup(group: IOperationGroup): IOperationGroup {
        const operations = group.operations.filter(operation =>
            this.typeConverter.allows(operation.type, this.type));
        if (operations.length > 0) {
            return {
                name: group.name,
                operations
            };
        } else {
            return null;
        }
    }
}