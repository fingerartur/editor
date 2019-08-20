import { IDeclaration } from './IDeclaraition';
import { IType } from '../types/IType';

export class Declaration {
    public id: number;
    public name: string;
    public type: IType;

    constructor(
        serialization: IDeclaration
    ) {
        Object.assign(this, serialization);
    }

    serialize(): IDeclaration {
        return Object.assign({}, this);
    }

    toString(): string {
        return '(' + this.id + ')' + this.name + ' ' + this.type.toString();
    }
}