import { IValue } from './IValue';
import { IType } from '../types/IType';

export interface IArg {
    name: string;
    type: IType;
    value?: IValue;
    error?: string;
}