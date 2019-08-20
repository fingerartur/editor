import { IElement } from './IElement';
import { IExpression } from '../expression/IExpression';
import { ISubRule } from '../ISubRule';

export interface IIf extends IElement {
    condition: IExpression;
    branchTrue: ISubRule;
    branchFalse: ISubRule;
}