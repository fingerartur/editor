import { IValue } from './IValue';
import { IType } from '../types/IType';

export interface IVariableAccess extends IValue {
    id: number;
    access: string;
    type: IType;
}