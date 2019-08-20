import { IValue } from './IValue';
import { IType } from '../types/IType';

export interface IVariable extends IValue {
    id: number;
    name: string;
    type: IType;
    isDeclaration?: boolean;
}