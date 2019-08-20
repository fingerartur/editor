import { VariableAccessFilter } from './VariableAccessFilter';
import { OperationFilter } from './OperationFilter';
import { AutocompleteType } from './AutocompleteType';
import { IIndex } from './IIndex';

export class Index {
    /**
     * always a legal index or 0
     */
    private index: number;
    constructor(
        private variables: VariableAccessFilter,
        private operations: OperationFilter
    ) {
        this.reset();
    }

    reset(): void {
        this.index = 0;
    }

    set(index: number): void {
        this.index = index;
        console.log('set index', index);
    }

    get(): IIndex {
        if (this.variables.isEmpty() && this.operations.isEmpty()) {
            return null;
        }

        let index = this.index;
        if (index < this.variables.getSize()) {
            return { index, type: AutocompleteType.VARIABLE_ACCESS };
        } else {
            index -= this.variables.getSize();
            return { index, type: AutocompleteType.OPERATION };
        }
    }

    increment(): void {
        this.index++;
        if (this.index === this.variables.getSize() + this.operations.getSize()) {
            this.index = 0;
        }
    }

    decrement(): void {
        this.index--;
        if (this.index < 0) {
            this.index = Math.max(this.variables.getSize() + this.operations.getSize() - 1, 0);
        }
    }
}