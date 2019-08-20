import { Types } from '../types/Types';
import { Value } from './Value';
import { IArg } from './IArg';
import { Operation } from './Operation';
import { IOperation } from './IOperation';
import { ILiteral } from './ILiteral';
import { Literal } from './Literal';
import { VariableAccess } from './VariableAccess';
import { IVariableAccess } from './IVariableAccess';
import { TypeConverter } from '../types/TypeConverter';
import { IType } from '../types/IType';
import { ArrayAccess } from './ArrayAccess';
import { IArrayAccess } from './IArrayAccess';
import { IValue } from './IValue';
import { TraverseHandler } from './Expression';

export class Arg {
    public value: Value = null;
    public error: string = null;
    public name: string;
    public type: IType;

    constructor(
        serialization: IArg
    ) {
        Object.assign(this, serialization);
        if (serialization.value) {
            this.deserializeValue(serialization.value);
        }
    }

    serialize(): IArg {
        // Object.assign doesnt work here, because TSC is overly agressive
        return {
            name: this.name,
            type: this.type,
            error: this.error,
            value: this.value ? this.value.serialize() : null
        };
    }

    toString(): string {
        if (this.value) {
            return this.value.toString();
        } else {
            return '';
        }
    }

    validate(converter: TypeConverter): Arg[] {
        this.error = null;
        let result: Arg[] = [];
        if (this.value) {
            const valueType = this.value.getType();
            if (valueType && !converter.allows(valueType, this.type)) {
                this.setTypeMismatchError(valueType);
            }

            if (this.value instanceof Operation) {
                result = this.value.validateArgs(converter);
            } else if (this.value instanceof Literal) {
                const parseError = this.value.getParseError();
                if (parseError) {
                    this.error = parseError;
                }
            }
        } else {
            this.error = this.name + ' (' + this.type + ') ' + 'value missing.';
        }
        if (this.error) {
            result.push(this);
        }
        return result;
    }

    setTypeMismatchError(type: IType): void {
        this.error = 'expected ' + Types.toString(this.type) + ' but got ' + Types.toString(type) + '.';
    }

    traverse(callback: TraverseHandler, skipNulls: boolean): void {
        const value = this.value;
        const shouldSkip = skipNulls && value == null;
        if (!shouldSkip) {
            callback(value);
        }
        
        if (value && value instanceof Operation) {
            value.args.forEach(arg2 => {
                arg2.traverse(callback, skipNulls);
            });
        }
    }

    private deserializeValue(serializedValue: IValue): void {
        let value: any;
        switch (serializedValue.what) {
            case 'operation': value = new Operation(serializedValue as IOperation); break;
            case 'literal': value = new Literal(serializedValue as ILiteral); break;
            case 'variableAccess': value = new VariableAccess(serializedValue as IVariableAccess); break;
            case 'arrayAccess': value = new ArrayAccess(serializedValue as IArrayAccess); break;
            default: throw new Error('unknown kind of value');
        }
        this.value = value;
    }
}