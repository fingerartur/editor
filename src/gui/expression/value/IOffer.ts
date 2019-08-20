import { IVariableAccess } from 'rule/expression/IVariableAccess';

export interface IOffer {
    attribute: string;
    prefix: string;
    variableAccess: IVariableAccess;
}