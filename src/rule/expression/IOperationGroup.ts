import { IOperation } from 'rule/expression/IOperation';

export interface IOperationGroup {
    name: string;
    operations: IOperation[];
}