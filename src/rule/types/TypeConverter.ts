import { IType } from './IType';
import { ITypeConversion } from './ITypeConversion';
import { Sets } from 'utils/Sets';
import { Types } from './Types';

export class TypeConverter {
    constructor(
        private conversions: ITypeConversion[]
    ) {}

    allows(from: IType, to: IType): boolean {
        if (!from) {
            throw new Error('bug: from-type must be specified');
        }
        if (!to) {
            return true;
        }
        Types.normalize(from);
        Types.normalize(to);
        if (from.isMultiValued !== to.isMultiValued) {
            return false;
        }
        const allowed = this.getTransitiveClosureOf(from.name);
        return allowed.has(to.name);
    }

    private getTosFor(types: Set<string>): Set<string> {
        let result: string[] = [];
        types.forEach(type => {
            const tos = this.conversions
                .filter(conversion => conversion.from === type)
                .map(conversion => conversion.to);
            result = result.concat(tos);
        });
        return new Set<string>(result);
    }

    private getTransitiveClosureOf(type: string): Set<string> {
        let tos = new Set<string>();
        tos.add(type);
        let difference = new Set<string>();
        difference.add(type);
        do {
            let newTos = this.getTosFor(difference);
            difference = Sets.difference(newTos, tos);
            tos = Sets.union(tos, newTos);
        } while (difference.size > 0);
        return tos;
    }
}