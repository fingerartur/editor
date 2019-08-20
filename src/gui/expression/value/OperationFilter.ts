import { IOperationGroup } from 'rule/expression/IOperationGroup';
import { IOperation } from 'rule/expression/IOperation';

export class OperationFilter {
    private all: IOperationGroup[];
    private groups: IOperationGroup[];
    private filter = '';

    constructor(groups: IOperationGroup[]) {
        this.all = groups;
        this.filterBy('');
    }

    getSize(): number {
        return this.groups
            .map(group => group.operations.length)
            .reduce((previous, current) => previous + current, 0);
    }

    isEmpty(): boolean {
        return this.getSize() === 0;
    }

    get(index: number): IOperation {
        let tempIndex = 0;
        let result: IOperation = null;
        this.groups.forEach(group =>
            group.operations.forEach(operation => {
                if (tempIndex === index) {
                    result = operation;
                }
                tempIndex++;
            })
        );
        return result;
    }

    getAll(): IOperationGroup[] {
        return this.groups;
    }

    getByFilter(filter: string): IOperation {
        let result: IOperation = null;
        this.all.forEach(group => {
            group.operations.forEach(operation => {
                if (operation.name === filter) {
                    result = operation;
                }
            });
        });
        return result;
    }

    filterBy(filter: string): void {
        this.filter = filter;
        this.groups = [];
        this.all.forEach(group => {
            const operations = group.operations.filter(operation =>
                this.matchesFilter(operation.name)
            );
            if (operations.length > 0) {
                this.groups.push({
                    name: group.name,
                    operations
                });
            }
        });
        this.groups;
    }

    private matchesFilter(text: string): boolean {
        return text.startsWith(this.filter) && text !== this.filter;
    }
}