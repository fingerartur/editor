import { Value } from './Value';
import { ILiteral } from './ILiteral';
import { HardwiredTypes } from '../types/HardwiredTypes';
import { Types } from '../types/Types';
import { IType } from '../types/IType';

export class Literal extends Value {
    public value: string;
    
    constructor(serialization: ILiteral) {
        super();
        this.deserialize(serialization);
    }

    guessTypes(): string[] {
        const result = [];
        if (this.isBool()) {
            result.push(HardwiredTypes.BOOL);
        }
        if (this.isInteger()) {
            result.push(HardwiredTypes.INT);
        }
        if (this.isFloat()) {
            result.push(HardwiredTypes.FLOAT);
        }
        result.push(HardwiredTypes.STRING);
        return result;
    }

    guessType(): IType {
        return { name: this.guessTypes()[0] };
    }

    isInteger(): boolean {
        const parsedInt = Number.parseInt(this.value, 10);
        return !Number.isNaN(parsedInt) && this.value.match(/^[0-9]+$/) !== null;
    }

    isFloat(): boolean {
        const parsedFloat = Number.parseFloat(this.value);
        return !Number.isNaN(parsedFloat);
    }

    isBool(): boolean {
        return this.value === '1' || this.value === '0';
    }

    serialize(): ILiteral {
        return super.serialize() as ILiteral;
    }

    toString(): string {
        return this.value;
    }

    getParseError(): string {
        const types = this.guessTypes();
        const isWrongType = types.indexOf(this.type.name) === -1;
        if (isWrongType) {
            switch (this.type.name) {
                case HardwiredTypes.INT: return 'Integer (' + this.value + ') cannot be parsed, try 14.';
                case HardwiredTypes.FLOAT: return 'Float (' + this.value + ') cannot be parsed, try 123.123.';
                case HardwiredTypes.BOOL: return 'Boolean (' + this.value + ') cannot be parsed, try 1 or 0.';
                default: return null;
            }
        } else {
            return null;
        }
    }

    getVariables(): number[] {
        return [];
    }

    replaceIds(map: Map<number, number>): void {
        return;
    }

    private deserialize(serialization: ILiteral): void {
        Object.assign(this, serialization);
        this.what = 'literal';
        if (this.type && Types.isArray(this.type)) {
            throw new Error('multivalued literals are not supported');
        }
    }
}