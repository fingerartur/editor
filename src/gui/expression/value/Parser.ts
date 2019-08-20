import { TypeConverter } from 'rule/types/TypeConverter';
import { IType } from 'rule/types/IType';
import { VariableAccessFilter } from './VariableAccessFilter';
import { OperationFilter } from './OperationFilter';
import { VariableAccess } from 'rule/expression/VariableAccess';
import { AutocompleteType } from './AutocompleteType';
import { IParserOutput } from './IParserOutput';
import { Operation } from 'rule/expression/Operation';
import { HardwiredTypes } from 'rule/types/HardwiredTypes';
import { Literal } from 'rule/expression/Literal';

export class Parser {
    constructor(
        private typeConverter: TypeConverter,
        private type: IType,
        private accessFilter: VariableAccessFilter,
        private operationFilter: OperationFilter
    ) {}

    parse(text: string): IParserOutput {
        return this.parseAccess(text) || this.parseOperation(text) || this.parseString(text) || this.parseNumerics(text);
    }

    parseAccess(text: string): IParserOutput {
        const access = this.accessFilter.getByFilter(text);
        if (access) {
            const value = new VariableAccess(access);
            let type = AutocompleteType.VARIABLE_ACCESS;
            const canBeSingleValued = !this.type || !this.type.isMultiValued;
            if (value.getType().isMultiValued && canBeSingleValued) {
                type = AutocompleteType.ARRAY_ACCESS;
            }
            return {
                value,
                type
            };
        }
        return null;
    }

    parseOperation(text: string): IParserOutput {
        const operation = this.operationFilter.getByFilter(text);
        if (operation) {
            return {
                value: new Operation(operation),
                type: AutocompleteType.OPERATION
            };
        }
        return null;
    }

    isAcceptableType(type: IType): boolean {
        return this.typeConverter.allows(type, this.type);
    }

    parseString(text: string): IParserOutput {        
        const typeString = { name: HardwiredTypes.STRING };
        if (text.length >= 2 && text.startsWith('"') && text.endsWith('"') && this.isAcceptableType(typeString)) {
            return {
                value: new Literal({ value: text, type: typeString }),
                type: AutocompleteType.LITERAL
            };
        }
        return null;
    }

    parseNumerics(text: string): IParserOutput {
        const literal = new Literal({ value: text });
        const types = literal.guessTypes()
            .filter(typeName => typeName !== HardwiredTypes.STRING)
            .filter(name => this.isAcceptableType({ name }));
        if (types.length > 0) {
            const type: IType = { name: types[0] };
            literal.setType(type);
            return {
                value: literal,
                type: AutocompleteType.LITERAL,
                literalTypes: types
            };
        }
        return null;
    }
}