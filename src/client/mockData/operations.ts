import { IOperationGroup } from 'rule/expression/IOperationGroup';

export const operationGroups: IOperationGroup[] = [
    {
        name: 'Mathematical operations',
        operations: [
            {
                name: 'sum (int)',
                sign: '+',
                type: { name: 'int' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'int' }
                    },
                    {
                        name: 'b',
                        type: { name: 'int' }
                    }
                ]
            },
            {
                name: 'sum (float)',
                sign: '+',
                type: { name: 'float' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'float' }
                    },
                    {
                        name: 'b',
                        type: { name: 'float' }
                    }
                ]
            },
            {
                name: 'minus (int)',
                sign: '-',
                type: { name: 'int' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'int' }
                    },
                    {
                        name: 'b',
                        type: { name: 'int' }
                    }
                ]
            },
            {
                name: 'minus (float)',
                sign: '-',
                type: { name: 'float' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'float' }
                    },
                    {
                        name: 'b',
                        type: { name: 'float' }
                    }
                ]
            },
            {
                name: 'times (int)',
                sign: '*',
                type: { name: 'int' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'int' }
                    },
                    {
                        name: 'b',
                        type: { name: 'int' }
                    }
                ]
            },
            {
                name: 'times (float)',
                sign: '*',
                type: { name: 'float' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'float' }
                    },
                    {
                        name: 'b',
                        type: { name: 'float' }
                    }
                ]
            },
            {
                name: 'division (float)',
                sign: '/',
                type: { name: 'float' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'float' }
                    },
                    {
                        name: 'b',
                        type: { name: 'float' }
                    }
                ]
            },
            {
                name: 'division (int)',
                sign: '/',
                type: { name: 'int' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'int' }
                    },
                    {
                        name: 'b',
                        type: { name: 'int' }
                    }
                ]
            },
            {
                name: 'modulo (int)',
                sign: '%',
                type: { name: 'int' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'int' }
                    },
                    {
                        name: 'b',
                        type: { name: 'int' }
                    }
                ]
            },
            {
                name: 'floor',
                sign: null,
                type: { name: 'int' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'number' }
                    }
                ]
            },
            {
                name: 'ceil',
                sign: null,
                type: { name: 'int' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'number' }
                    }
                ]
            },
            {
                name: 'equals',
                sign: '=',
                type: { name: 'boolean' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'string' }
                    },
                    {
                        name: 'b',
                        type: { name: 'string' }
                    }
                ]
            },
            {
                name: 'squareRoot',
                sign: null,
                type: { name: 'number' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'number' }
                    }
                ]
            },
        ]
    },
    {
        name: 'Relational operations',
        operations: [
            {
                name: 'equals',
                sign: '=',
                type: { name: 'boolean' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'string' }
                    },
                    {
                        name: 'b',
                        type: { name: 'string' }
                    }
                ]
            },
            {
                name: 'and',
                sign: 'AND',
                type: { name: 'boolean' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'boolean' }
                    },
                    {
                        name: 'b',
                        type: { name: 'boolean' }
                    }
                ]
            },
            {
                name: 'or',
                sign: 'OR',
                type: { name: 'boolean' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'boolean' }
                    },
                    {
                        name: 'b',
                        type: { name: 'boolean' }
                    }
                ]
            },
            {
                name: 'xor',
                sign: 'XOR',
                type: { name: 'boolean' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'boolean' }
                    },
                    {
                        name: 'b',
                        type: { name: 'boolean' }
                    }
                ]
            },
            {
                name: 'not',
                sign: 'NOT',
                type: { name: 'boolean' },
                args: [
                    {
                        name: 'a',
                        type: { name: 'boolean' }
                    }
                ]
            },
            {
                name: 'implies',
                sign: '=>',
                type: { name: 'boolean' },
                args: [
                    {
                        name: 'left',
                        type: { name: 'boolean' }
                    },
                    {
                        name: 'right',
                        type: { name: 'boolean' }
                    }
                ]
            },
            {
                name: 'less or equal',
                sign: '=<',
                type: { name: 'boolean' },
                args: [
                    {
                        name: 'left',
                        type: { name: 'string' }
                    },
                    {
                        name: 'right',
                        type: { name: 'string' }
                    }
                ]
            },
            {
                name: 'less',
                sign: '<',
                type: { name: 'boolean' },
                args: [
                    {
                        name: 'left',
                        type: { name: 'string' }
                    },
                    {
                        name: 'right',
                        type: { name: 'string' }
                    }
                ]
            },
        ]
    },
    {
        name: 'String operations',
        operations: [
            {
                name: 'trim',
                sign: null,
                type: { name: 'string' },
                args: [
                    {
                        name: 'text',
                        type: { name: 'string' }
                    }
                ]
            },
            {
                name: 'subString',
                sign: null,
                type: { name: 'string' },
                args: [
                    {
                        name: 'text',
                        type: { name: 'string' }
                    },
                    {
                        name: 'start',
                        type: { name: 'int' }
                    },
                    {
                        name: 'length',
                        type: { name: 'int' }
                    }
                ]
            },
            {
                name: 'concatenate',
                sign: '+',
                type: { name: 'string' },
                args: [
                    {
                        name: 'left',
                        type: { name: 'string' }
                    },
                    {
                        name: 'right',
                        type: { name: 'string' }
                    }
                ]
            },
            {
                name: 'toLowerCase',
                sign: null,
                type: { name: 'string' },
                args: [
                    {
                        name: 'text',
                        type: { name: 'string' }
                    }
                ]
            },
        ]
    },
    {
        name: 'Custom function calls',
        operations: [
            {
                name: 'GetHaForPassport',
                sign: null,
                type: { name: 'HistoricalApplication',  isMultiValued: true },
                args: [
                    {
                        name: 'Passport',
                        type: { name: 'string' }
                    }
                ]
            },
            {
                name: 'GetHaForEmail',
                sign: null,
                type: { name: 'HistoricalApplication',  isMultiValued: true },
                args: [
                    {
                        name: 'Passport',
                        type: { name: 'string' }
                    }
                ]
            },
            {
                name: 'GetHaForPhone',
                sign: null,
                type: { name: 'HistoricalApplication',  isMultiValued: true },
                args: [
                    {
                        name: 'Passport',
                        type: { name: 'string' }
                    }
                ]
            },
        ]
    }
];