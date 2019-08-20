interface IAttribute {
    name: string;
    type: string;
    isMultiValued: boolean;
}

export interface ITypeDefinition {
    name: string;
    /**
     * if undefined, the type is simple
     * (scalar or scalar array depending on isMultivalued)
     */
    attributes?: IAttribute[];
}