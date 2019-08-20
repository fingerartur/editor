import { IValue } from './IValue';
import { IType } from '../types/IType';

export abstract class Value {
    protected type: IType;
    protected what: string;

    abstract getVariables(): number[];
    abstract toString(): string;
    abstract replaceIds(map: Map<number, number>): void;

    serialize(): IValue {
        return Object.assign({}, this);
    }

    setType(type: IType): void {
        this.type = type;
    }

    getType(): IType {
        return this.type;
    }
}