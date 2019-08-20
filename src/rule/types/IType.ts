export interface IType {
    name: string;
    /**
     * if undefined, it is considered to be false
     */
    isMultiValued?: boolean;
}