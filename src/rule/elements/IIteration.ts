import { IElement } from './IElement';
import { IVariable } from '../expression/IVariable';
import { ISubRule } from '../ISubRule';
import { IVariableAccess } from '../expression/IVariableAccess';

export interface IIteration extends IElement {
    variable?: IVariable;
    value?: IVariableAccess;
    cycle: ISubRule;
}