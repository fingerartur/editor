import { IVariable } from '../expression/IVariable';
import { IExpression } from '../expression/IExpression';
import { IElement } from './IElement';

export interface IAssign extends IElement {
    variable: IVariable;
    expression: IExpression;
}