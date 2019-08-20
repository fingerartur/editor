import { AutocompleteType } from './AutocompleteType';
import { Value } from 'rule/expression/Value';

export interface IParserOutput {
    type: AutocompleteType;
    value: Value;
    literalTypes?: string[];
}