import { IExpression } from './IExpression';
import { IType } from '../types/IType';
import { Arg } from './Arg';
import { Value } from './Value';
import { TypeConverter } from '../types/TypeConverter';

export type TraverseHandler = (value: Value) => void;

export class Expression {
    private root: Arg;

    constructor(serialization?: IExpression) {
        if (serialization) {
            this.root = new Arg(serialization.root);
        } else {
            this.root = new Arg({ name: 'root', type: null, value: null });
        }
    }

    inferType(): IType {
        const value = this.root.value;
        if (value) {
            this.root.type = value.getType();
        } else {
            this.root.type = null;
        }
        return this.root.type;
    }

    hasTypeMismatch(typeConverter: TypeConverter): boolean {
        return !typeConverter.allows(this.root.value.getType(), this.root.type);
    }

    getRoot(): Arg {
        return this.root;
    }

    getType(): IType {
        return this.root.type;
    }

    serialize(): IExpression {
        return {
            what: 'expression',
            root: this.root.serialize()
        };
    }

    toString(): string {
        const value = this.root.value;
        if (value) {
            return value.toString();
        } else {
            return '';
        }
    }

    getIdsOfVariables(): number[] {
        const ids = new Set<number>();
        this.traverse(node => {
            node.getVariables().forEach(id => ids.add(id));
        }, true);
        return Array.from(ids);
    }

    isEmpty(): boolean {
        return this.root.value == null;
    }

    isComplete(): boolean {
        let result = true;
        this.traverse(node => {
            if (node == null) {
                result = false;
            }
        });
        return result;
    }

    replaceIds(map: Map<number, number>): void {
        this.traverse(value => {
            value.replaceIds(map);
        }, true);
    }

    /**
     * Traverses all ExpressionNodes, including nulls
     * DFS, preorder
     */
    traverse(callback: TraverseHandler, skipNulls: boolean = false): void {
        this.root.traverse(callback, skipNulls);
    }
}