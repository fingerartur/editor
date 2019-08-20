import { IValue } from './IValue';
import { IArg } from './IArg';

export interface IOperation extends IValue {
    name: string;
    sign: string;
    args: IArg[];
}