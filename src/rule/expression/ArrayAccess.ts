import { Arg } from './Arg';
import { IArrayAccess } from './IArrayAccess';
import { Value } from './Value';
import { IType } from '../types/IType';
import { Types } from '../types/Types';
import { HardwiredTypes } from '../types/HardwiredTypes';
import { IVariableAccess } from './IVariableAccess';
import { VariableAccess } from './VariableAccess';

export class ArrayAccess extends Value {
    public array: IVariableAccess;
    public index: Arg;

    static isIndexValid(index: Arg): boolean {
        return Types.areEqual(index.type, { name: HardwiredTypes.INT, isMultiValued: false });
    }

    constructor(serialization?: IArrayAccess) {
        super();
        if (serialization) {
            this.deserialize(serialization);
        }
        this.what = 'arrayAccess';
    }

    replaceIds(map: Map<number, number>): void {
        if (this.array) {
            const newId = map.get(this.array.id);
            if (newId) {
                this.array.id = newId;
            }
        }

        if (this.index) {
            this.index.traverse(value => {
                value.replaceIds(map);
            }, true);
        }
    }

    toString(): string {
        return this.array.access + '[' + this.index.toString() + ']';
    }

    getType(): IType {
        return { name: this.array.type.name, isMultiValued: false };
    }

    getVariables(): number[] {
        const result = [ this.array.id ];
        if (this.index.value instanceof VariableAccess) {
            result.push(this.index.value.id);
        }
        return result;
    }

    private deserialize(serialization: IArrayAccess): void {
        this.array = serialization.array;
        this.index = new Arg(serialization.index);
    }
}