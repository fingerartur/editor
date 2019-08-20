import { IVariableAccess } from 'rule/expression/IVariableAccess';
import { IOffer } from './IOffer';

export class VariableAccessFilter {
    private filter = '';
    private offers: IOffer[] = [];

    constructor(
        private variableAccesses: IVariableAccess[]
    ) {
        this.filterBy('');
    }

    filterBy(filter: string): void {
        this.filter = filter;
        this.generateOffers();
    }

    getSize(): number {
        return this.offers.length;
    }

    isEmpty(): boolean {
        return this.getSize() === 0;
    }

    get(index: number): IOffer {
        return this.offers[index];
    }

    getAll(): IOffer[] {
        return this.offers;
    }

    getByFilter(filter: string): IVariableAccess {
        let result: IVariableAccess = null;
        this.variableAccesses.forEach(access => {
            if (access.access === filter) {
                result = access;
            }
        });
        return result;
    }

    private generateOffers(): void {
        const depth = this.filter.split('.').length;
        const texts = new Set<string>();
        const result: IOffer[] = [];
        this.variableAccesses.forEach(access => {
            const text = access.access;
            if (this.matchesFilter(text)) {
                const splits = text.split('.');
                const split = splits[depth - 1];
                let variableAccess = access;
                let prefix = splits.slice(0, depth).join('.'); 
                if (splits.length !== depth) {
                    variableAccess = null;
                    prefix += '.';
                }
                if (!texts.has(split)) {
                    texts.add(split);
                    result.push({
                        prefix,
                        attribute: split,
                        variableAccess
                    });
                }
            }
        });
        this.offers = result;
    }

    private matchesFilter(text: string): boolean {
        return text.startsWith(this.filter) && text !== this.filter && !text.startsWith(this.filter + '.');
    }
}