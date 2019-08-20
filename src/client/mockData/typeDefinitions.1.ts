// import { ITypeDefinition } from 'rule/types/ITypeDefinition';

// export const typeDefinitions: ITypeDefinition[] = [    
//     { name: 'boolean' },
//     { name: 'int' },
//     { name: 'float' },
//     { name: 'number' },
//     { name: 'string' },
//     { name: 'any' },
//     {
//         name: 'Doc',
//         attributes: [
//             {
//                 name: 'Person',
//                 type: 'Person',
//                 isMultiValued: false
//             },
//             {
//                 name: 'inspectionTime',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'Items',
//                 type: 'Item',
//                 isMultiValued: true
//             },
//             {
//                 name: 'cargoWeight',
//                 type: 'float',
//                 isMultiValued: false
//             },
//             {
//                 name: 'IdCard',
//                 type: 'IdCard',
//                 isMultiValued: false
//             },
//             {
//                 name: 'signatures',
//                 type: 'string',
//                 isMultiValued: true
//             },
//             {
//                 name: 'cargoWeigths',
//                 type: 'int',
//                 isMultiValued: true
//             }
//         ]
//     },
//     {
//         name: 'Person',
//         attributes: [
//             {
//                 name: 'Name',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'Age',
//                 type: 'int',
//                 isMultiValued: false
//             },
//             {
//                 name: 'isSuspicious',
//                 type: 'boolean',
//                 isMultiValued: false
//             }
//         ]
//     },
//     {
//         name: 'IdCard',
//         attributes: [
//             {
//                 name: 'documentNo',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'givenName',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'surname',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'birthDate',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'birthPlace',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'nationality',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'sex',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'dateOfIssue',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'dateOfExpiry',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'maritalStatus',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'personalNo',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'permanentStay',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'authority',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'hash',
//                 type: 'string',
//                 isMultiValued: false
//             },
//         ]
//     },
//     {
//         name: 'Item',
//         attributes: [
//             {
//                 name: 'name',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'description',
//                 type: 'string',
//                 isMultiValued: false
//             },
//             {
//                 name: 'amount',
//                 type: 'float',
//                 isMultiValued: false
//             },
//             {
//                 name: 'price',
//                 type: 'int',
//                 isMultiValued: false
//             },
//             {
//                 name: 'isDeclared',
//                 type: 'boolean',
//                 isMultiValued: false
//             },
//         ]
//     },
// ];