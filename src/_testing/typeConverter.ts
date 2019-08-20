import { TypeConverter } from 'rule/types/TypeConverter';

const serializedTypeConversions = [
    { from: 'boolean', to: 'int' },
    { from: 'int', to: 'float' },
    { from: 'float', to: 'number' },
    { from: 'number', to: 'string' },
    { from: 'string', to: 'any' }
];
export const typeConverter = new TypeConverter(serializedTypeConversions);