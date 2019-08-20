import { IType } from './IType';
import { Cloner } from '../Cloner';

export class Types {

    static areEqual(type1: IType, type2: IType): boolean {
        Types.normalize(type1);
        Types.normalize(type2);
        return type1.name === type2.name && type1.isMultiValued === type2.isMultiValued;
    }
    
    static isArray(type: IType): boolean {
        Types.normalize(type);
        return type.isMultiValued;
    }

    static clone(type: IType): IType {
        return Cloner.cloneObject(type);
    }

    static normalize(type: IType): void {
        if (!type.isMultiValued) {
            type.isMultiValued = false;
        }
    }

    static toString(type: IType): string {
        let suffix = '';
        if (type.isMultiValued) {
            suffix = '[]';
        }
        return type.name + suffix;
    }
}