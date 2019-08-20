import { Arg } from './Arg';
import { IOperation } from './IOperation';
import { Value } from './Value';
import { TypeConverter } from '../types/TypeConverter';

export class Operation extends Value {
    public name: string;
    public sign: string;
    public args: Arg[];

    constructor(
        serialization: IOperation
    ) {
        super();
        this.deserialize(serialization);
    }

    serialize(): IOperation {
        const result = super.serialize() as IOperation;
        result.args = this.args.map(arg => arg.serialize());
        return result;
    }

    toString(): string {
        let result = this.name + '(';
        result += this.args.map(arg => arg.toString()).join(', ');
        result += ')';
        return result;
    }

    validateArgs(converter: TypeConverter): Arg[] {
        let result: Arg[] = [];
        this.args.forEach(arg => {
            result = result.concat(arg.validate(converter));
        });
        return result;
    }

    getVariables(): number[] {
        return [];
    }

    replaceIds(map: Map<number, number>): void {
        return;
    }

    private deserialize(serialization: IOperation): void {
        Object.assign(this, serialization);
        this.args = [];
        serialization.args.forEach(arg => {
            this.args.push(new Arg(arg));
        });
        this.what = 'operation';
    }
}