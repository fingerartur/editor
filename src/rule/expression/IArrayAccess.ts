import { IValue } from './IValue';
import { IArg } from './IArg';
import { IVariableAccess } from './IVariableAccess';

export interface IArrayAccess extends IValue {
    array: IVariableAccess;
    index: IArg;
}