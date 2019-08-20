import { ITypeDefinition } from 'rule/types/ITypeDefinition';

export const typeDefinitions: ITypeDefinition[] = [    
    { name: 'boolean' },
    { name: 'int' },
    { name: 'float' },
    { name: 'number' },
    { name: 'string' },
    { name: 'any' },
    {
        name: 'Doc',
        attributes: [
            {
                name: 'Person',
                type: 'Person',
                isMultiValued: false
            },
            {
                name: 'inspectionTime',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'Goods Item',
                type: 'Goods Item',
                isMultiValued: true
            },
            {
                name: 'Technical Information',
                type: 'Technical Information',
                isMultiValued: false
            },
            {
                name: 'cargoWeight',
                type: 'float',
                isMultiValued: false
            },
            {
                name: 'IdCard',
                type: 'IdCard',
                isMultiValued: false
            },
            {
                name: 'signatures',
                type: 'string',
                isMultiValued: true
            },
            {
                name: 'cargoWeigths',
                type: 'int',
                isMultiValued: true
            }
        ]
    },
    {
        name: 'Person',
        attributes: [
            {
                name: 'Name',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'Age',
                type: 'int',
                isMultiValued: false
            },
            {
                name: 'isSuspicious',
                type: 'boolean',
                isMultiValued: false
            }
        ]
    },
    {
        name: 'IdCard',
        attributes: [
            {
                name: 'documentNo',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'givenName',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'surname',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'birthDate',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'birthPlace',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'nationality',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'sex',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'dateOfIssue',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'dateOfExpiry',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'maritalStatus',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'personalNo',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'permanentStay',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'authority',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'hash',
                type: 'string',
                isMultiValued: false
            },
        ]
    },
    {
        name: 'Goods Item',
        attributes: [
            {
                name: 'Item number',
                type: 'int',
                isMultiValued: false
            },
            {
                name: 'Country of dispatch',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'Region of dispatch',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'Rail code',
                type: 'int',
                isMultiValued: false
            },
            {
                name: 'Taxes',
                type: 'Taxes',
                isMultiValued: false
            },
        ]
    },
    {
        name: 'Taxes',
        attributes: [
            {
                name: 'Tarif measure units',
                type: 'int',
                isMultiValued: false
            },
            {
                name: 'Units specification',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'Type of tax',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'Code of tax',
                type: 'int',
                isMultiValued: false
            },
            {
                name: 'Tax number within goods item',
                type: 'int',
                isMultiValued: false
            }
        ]
    },
    {
        name: 'Technical Information',
        attributes: [
            {
                name: 'Status of customs clearance',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'Simplified procedure',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'Working hours of CO',
                type: 'int',
                isMultiValued: false
            },
            {
                name: 'Officer',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'Customs place',
                type: 'string',
                isMultiValued: false
            },
            {
                name: 'Request GUID',
                type: 'string',
                isMultiValued: false
            }
        ]
    },
];